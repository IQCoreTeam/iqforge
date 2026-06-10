# IQForge — Technical Notes for Zo

Engineering handoff: what was built, what was verified against your repos, the
decisions made and why, and exactly what still needs your eyes. Written for
someone who knows the IQ stack better than I do — please flag anything that
contradicts how the protocol is meant to be used.

## TL;DR

Template-first no-code site builder. 18 schema-driven templates → one generic
customizer → publish pipeline that follows the deploy-site.ts flow exactly:
`codeIn(index.html)` → `codeIn(manifest.json)` → manifest sig is the pointer →
SNS V2 `Url` record gets the bare sig → any gateway serves it at
`/site/{manifestSig}`. Writes happen client-side via wallet-adapter (your SDK's
`SignerInput` accepts it). `tsc --noEmit` and `next build` are clean. **No real
transaction has been fired yet** — that's the one thing only someone with a
funded wallet can do.

## Architecture in one diagram

```
TemplateDefinition (lib/templates.ts)          ← data, not code
  ├─ fields[]  ──────────────► TemplateCustomizer renders the form generically
  └─ defaultContent/Theme ───► TEMPLATE_COMPONENTS[id] renders the page
                                      │
                              (same component everywhere)
                                      │
        ┌────────────┬────────────────┼────────────────┐
   live preview   /preview/[id]   exportSiteHtml()   gateway render
                                      │
                              publishToIQLabs()
                              codeIn ×2 → manifestSig
                                      │
                              attachContentRecord()
                              SNS V2 Url record = manifestSig
```

The key property: adding template #19 is one render component + one
`TemplateDefinition` object. Zero new form code, zero new publish code.

## What was verified against your actual code (not guessed)

I cloned `IQCoreTeam/iqlabs-solana-sdk` and `IQCoreTeam/iq-gateway` and read
them before wiring anything:

1. **Publish flow** mirrors `iq-gateway/scripts/deploy-site.ts` line-for-line in
   structure: per-file `iqlabs.writer.codeIn(ctx, base64, path, 0, mime)`, then
   a manifest `{ index: { path }, paths: { [path]: { id: sig } } }` uploaded as
   `manifest.json`. Manifest sig = pointer. (lib/iqlabs.ts)
2. **Browser signing**: `sdk/src/sdk/utils/wallet.ts` — `SignerInput` is
   `Signer | Keypair | WalletSigner`, and `WalletSigner` is structurally
   identical to wallet-adapter's `signTransaction/signAllTransactions` shape.
   So no server, no keypair files; Phantom signs directly. The `onProgress`
   callback from `prepareCodeIn` drives the publish progress bar.
3. **SNS record format**: from `gw/src/chain/solana/sns.ts` —
   `resolveDomainToSig` probes `Record.Url` then `Record.TXT` (V2), accepts a
   bare base58 tx sig (`/^[1-9A-HJ-NP-Za-km-z]{86,90}$/`) or a URL containing
   `/site/<sig>`. I write the **bare sig** so domains aren't coupled to any
   single gateway host. Create-vs-update is decided by a `getRecordV2` probe.
   Bonfida call signatures (`createRecordV2Instruction(domain, record, content,
   owner, payer)`) were pulled from the installed package's d.ts, v3.0.21.
4. **Reads**: lib/gateway.ts hits the deployed gateway (`/site/{sig}`,
   `/site/{sig}/manifest`, `/health`). Reads need no SDK — by your design.
5. **Fees**: I saw `DEFAULT_WRITE_FEE_RECEIVER` + `DEFAULT_IQ_MINT` (the $IQ
   mint) + ATA resolution in the writer. The UI doesn't yet estimate the $IQ
   fee — see open questions.

## Decisions you may want to veto

- **Single-file sites.** Exported sites are ONE self-contained index.html:
  compiled template CSS embedded (lib/template-css.ts, ~14KB generated from the
  18 components via Tailwind CLI), images inlined as data URLs (compressed
  client-side first — see below). Tradeoff: simplest possible manifest (one
  file + manifest) and atomic permanence, at the cost of larger single
  payloads vs. splitting images into separate manifest entries. If you'd rather
  have per-asset entries (better gateway caching, dedupe), the seam is
  `publishToIQLabs()` — split `site.content` images out before the index
  upload and rewrite their srcs to root-relative paths; the gateway already
  resolves those against the manifest.
- **Image policy.** Client-side downscale to ≤1600px JPEG q0.85 before any
  image enters content (lib/image.ts), since storage is priced per byte.
  Originals are never kept. Veto if you want lossless.
- **Web fonts are progressive enhancement.** Layout CSS is embedded; the two
  font stylesheets are external `<link>`s with system fallbacks. Inlining
  woff2 would add ~150-300KB per site. Your call on which way "eternal" should
  lean; flip is trivial.
- **Mock mode default ON** (`NEXT_PUBLIC_IQ_MOCK=1`) so the flow is walkable
  with zero funds. Real mode is the same code path minus the early return.
- **In-app domain registration intentionally not wired.**
  `registerDomainNameV2` exists in Bonfida v3 but needs a payment ATA
  (USDC/SOL) and price handling; I won't ship an untested payment flow. UI
  directs to sns.id; owned domains list via `getAllDomains` + `reverseLookup`.

## File map (the parts that matter)

```
lib/types.ts          TemplateDefinition / Site / PublishWallet — the contract
lib/templates.ts      all 18 definitions (fields + defaults), registry
components/templates/ 18 render components + index.ts registry
components/template-customizer.tsx   schema-driven form + live preview
lib/export-html.ts    Site → self-contained index.html (renderToStaticMarkup)
lib/template-css.ts   GENERATED — regenerate when template classes change
lib/image.ts          upload compression
lib/iqlabs.ts         WRITE layer (codeIn ×2). The only file touching your SDK
lib/gateway.ts        READ layer (deployed gateway endpoints)
lib/sns.ts            domain list/resolve/attach (Bonfida v3)
lib/publish.ts        orchestration: storage → record
lib/site-store.ts     localStorage drafts (see roadmap)
app/build/[templateId]  customize → domain → publish stepper
```

Per your code rules: reads and writes are separated (gateway.ts vs iqlabs.ts),
no duplicate-purpose functions (a `readFromIQLabs` wrapper was deleted once the
gateway layer existed), and the SDK is touched in exactly one file.

## Untested / open questions for you

1. **No live-fire tx yet.** Everything compiles against SDK 0.1.27 and builds,
   but the first real `codeIn` from a browser wallet needs a funded throwaway
   wallet + decent RPC. Watch for: tx size limits on large data-URL images
   (the SDK throws "Transaction size exceeded"), and whether `method=0` is the
   right write mode for ~50-300KB HTML payloads or if sessions/linked-list
   thresholds need tuning (`DEFAULT_LINKED_LIST_THRESHOLD`).
2. **$IQ fee UX.** Does `codeIn` require the wallet to hold $IQ, and is there a
   per-byte price I can quote pre-publish? The size estimate is shown; the fee
   estimate isn't.
3. **Record value preference.** Gateway accepts bare sig or /site/ URL — I
   chose bare sig. If you'd rather standardize on the URL form (e.g., for
   non-IQ resolvers), it's one line in lib/sns.ts.
4. **Drafts are localStorage-only.** Obvious roadmap item: persist drafts
   onchain via iqdb (`createTable`/`writeRow` are right there in the writer)
   so "My Sites" follows the wallet across devices. Didn't want to spend
   protocol writes on every keystroke without talking cost model first.
5. **`BACKFILL_FROM_SLOT=398615411`** — noted from your README for anyone
   running a fresh gateway against full IQ history.

## Verification record

- `npx tsc --noEmit` — clean, real SDK types.
- `npx next build` — clean, all routes; Buffer polyfilled via ProvidePlugin
  (next.config.mjs) since the SDKs expect the Node global in-browser.
- `package-lock.json` is committed — the exact dependency tree that built.
