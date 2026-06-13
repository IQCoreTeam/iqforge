# IQForge

A no-code builder for **fully on-chain Solana websites**. Pick a template, customize it, and publish it permanently with IQLabs storage — addressed by your own `.sol` domain via SNS.

Built with Next.js 15 (App Router), TypeScript, Tailwind + shadcn/ui, and the Solana wallet adapter. Theme: IQLabs neon-green on near-black.

---

## What it does

1. **Pick a template** — 18 starting points across 8 categories (Personal, Team, Token, NFT, DAO, Portfolio, Startup, Blog).
2. **Customize** — edit text, images, links, colors, background, and typeface, with a live preview that is byte-identical to what ships.
3. **Publish on-chain** — the page is stored with IQLabs `codeIn`, wrapped in a gateway manifest, and your `.sol` domain is pointed at it. Two wallet signatures: one to store, one to point the domain.

The result is served at `name.sol` (Brave native), `name.sol.site`, and `gateway.iqlabs.dev/sns/name`.

---

## How publishing works (matches `iq-gateway/scripts/deploy-site.ts` exactly)

```
renderSiteHtml(site)                      // one self-contained index.html (images inlined)
  → codeIn(base64(html), "index.html")    // → indexSig
  → manifest = { index:{path:"index.html"}, paths:{ "index.html": { id: indexSig } } }
  → codeIn(base64(manifest), "manifest.json")   // → manifestSig  (the on-chain path)
  → SNS Record.Url = https://gateway.iqlabs.dev/site/<manifestSig>/index.html
```

The gateway's `resolveDomainToSig()` reads the URL record (TXT fallback), extracts the sig, and serves the manifest. Data is **base64-encoded** because the gateway's `decodeAssetData` decodes base64 — this is the only encoding compatible with the production gateway.

### Design note — URL record vs. SOL/TXT PDA gating

The brief suggested putting an **iqgithub PDA** in the SOL/TXT record to gate `browser.iqlabs.dev` traffic to 0.2-SOL payers. Reading the gateway resolver (`src/chain/solana/sns.ts`):

- The **SOL record** deserializes **32 bytes → a bare pubkey/PDA**. A `codeIn` result is a **64-byte tx signature** (86–90 char base58) — it cannot fit a SOL record.
- So a site published as a manifest must use the **URL record** (or a bare sig in TXT, which `resolveDomainToSig` also accepts).
- The PDA-in-SOL-record path is the right home for a **SOLGIT repo PDA** (a mutable 32-byte account the browser maps to the latest manifest) — that's the natural place to gate by payment, but it depends on the SOLGIT repo system and isn't in the public SDK yet.

This MVP publishes via the **URL record**. The record type and value are isolated in `buildRecordValue()` (`lib/iqlabs.ts`) and `setSiteRecord()` (`lib/sns.ts`), so switching to "SOL record = repo PDA" later is a one-function change.

---

## Architecture

- **One renderer.** `lib/render-html.ts` turns a `Site` into a complete HTML document. The live preview (`iframe srcDoc`) and the published `index.html` use the same function — the preview can never drift from what ships.
- **Templates are data.** `lib/templates/registry.ts` holds 18 `TemplateDef`s; each maps to one of five layout archetypes (`spotlight`, `cover`, `token`, `gallery`, `feed`). The renderer and the editor branch only per **archetype**, never per template — adding a template is one data entry.
- **One schema-driven form.** `lib/templates/schema.ts` declares which fields and list sections each archetype exposes; `components/customizer/content-form.tsx` renders itself from that schema.
- **Wallet = signer.** A connected `@solana/wallet-adapter` wallet is structurally a `WalletSigner`, so it's passed straight to the IQLabs SDK and bonfida — no adapter layer.

```
src/
  app/
    layout.tsx  providers.tsx  globals.css
    page.tsx                     landing
    templates/page.tsx           gallery + category filter
    dashboard/page.tsx           My Sites (per wallet)
    build/[templateId]/page.tsx  customizer entry
  components/
    customizer/ (customizer, content-form, theme-controls, image-field, live-preview, domain-step, publish-dialog)
    ui/         shadcn primitives
    site-header, template-card, site-card, wallet/connect-button
  lib/
    types.ts            single source of truth (Template, Site, content, theme)
    render-html.ts      Site -> self-contained HTML (preview + publish)
    iqlabs.ts           codeIn publish pipeline + manifest
    sns.ts              list domains, read/write URL record, availability
    templates/          registry (18) + schema
    site-store.ts       localStorage persistence (per wallet)
    use-wallet-signer.ts
```

---

## Run it

```bash
cp .env.example .env.local      # set a real RPC (Helius/Triton) for mainnet writes
npm install
npm run dev                     # http://localhost:3000
```

Environment:

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SOLANA_RPC` | RPC for `codeIn` + SNS reads/writes. Use a paid RPC in production. |
| `NEXT_PUBLIC_IQ_GATEWAY` | Gateway the published URL record points at (default `https://gateway.iqlabs.dev`). |

`npm run build` and `npm run typecheck` both pass.

---

## Scope notes / next steps

- **Storage of the user's site list** is `localStorage` (per wallet) for the MVP. Swap `lib/site-store.ts` for an on-chain index (`codeIn` + `updateUserMetadata`) without touching the UI.
- **Images are inlined** as compact data-URIs (downscaled client-side) so a published site is a single manifest entry. Splitting large media into separate manifest files is a later optimization.
- **Domain registration** is handled on sns.id (the builder checks availability and deep-links). Attaching + record writes happen in-app via the SDK.
- **PDA gating** for `browser.iqlabs.dev` is the SOLGIT-repo-PDA path described above — wire it in once repo PDAs are exposed.
