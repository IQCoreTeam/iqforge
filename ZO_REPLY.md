# Re: ZO_PLAN — implemented, with findings

Plan received and executed. Everything below was wired against the published
packages and your repos' source, then compile-verified. Structure: what I
adopted as-is, what I found along the way that you'll want to know, the two
judgment calls I made, and the questions only you can close.

## Adopted as specified

**§0 git-sdk.** `@iqlabs-official/git-sdk@0.1.18` (`/browser` entry) replaces
the hand-rolled codeIn/manifest in lib/iqlabs.ts. Flow: deterministic repo per
site (`iqforge-<siteId8>`), `readOwnerRepos` → `createRepo` on first publish,
then `commit(repo, msg, { "index.html": b64, "iqpages.json": b64 })`. The
README's `scan` example resolved to `Record<path, base64>` from the d.ts.

**§1 profile split.** Profiles no longer touch the template/website pipeline.
New `/profile` editor writes through the SAME system iq-wide-web reads — I
ported your exact flow from `use-profile-editor.ts`: dbRoot guard on
`iqprofile-root` → `codeIn(json, "profile-metadata")` → `updateUserMetadata`.
Read path mirrors `extractUserMetadata` (Buffer-free port) + gateway
`/data/{txId}` for txId-stored JSON.

**Theme contract.** `profile = { ...ProfileMeta, theme: { format: "react95",
tokens } }` with tokens in the exact original.ts flat shape. Since current
iww readers ignore unknown keys, this is backward-compatible. Shipped four
first-class IQ themes: `iq-terminal` (neon/near-black), `original` (the
classic), `vapor`, `paper`. The "(optional, fun) own UI lib" item is half-real
now — the themes exist in the contract; the component lib can follow.

**§2/§4 examples/.** Pulled and studied GrapesJS, Craft.js, Puck —
`examples/STUDY.md` has file-level findings and the v2 editor recommendation
(short version: adopt Puck's `{root, content:[{type, props}]}` document shape;
our existing field-schema system is already its `fields` concept; export
pipeline unchanged). License check: Craft.js and Puck are MIT and vendored;
**GrapesJS is BSD-3-Clause, not MIT**, so per your rule it's studied but not
vendored — permissive enough that you can overrule.

## Findings you'll want

1. **`Commit.treeTxId` is directly gateway-servable.** Your gateway's manifest
   normalizer (src/routes/site.ts) accepts both the legacy `{index, paths}`
   manifest AND the git tree format (`{path: {txId, hash}}` — "Iqoogle
   format"). So the .sol Url record now carries the bare `treeTxId`, and
   `/site/{treeTxId}` just works. No deployPages needed to be *live*.
2. **Re-publish = commit to the same repo.** Version history and blob dedup
   (unchanged files skip re-upload) came free with the git-sdk switch. This is
   strictly better than the orphan-manifest flow I had.
3. **README "GitHub" line** — grepped; the shipped README was already clean.
   If you meant a specific line elsewhere, point me at it.

## Judgment calls (overrule freely)

1. **`deployPages` is NOT auto-called.** It charges a one-time 0.2 SOL fee
   (PAGES_FEE_LAMPORTS → the protocol fee wallet). Auto-charging that on every
   first publish felt wrong; sites are fully live without it. I commit
   `iqpages.json` in every snapshot, so gallery deployment is a single later
   call. Proposed UX: an opt-in "List in the IQ Pages gallery (0.2 SOL)"
   checkbox on the publish step.
2. **The /profile editor preview doesn't import react95.** It renders a
   token-driven win95-style window by hand. Rationale: the contract is the
   theme OBJECT; the renderer of truth is iq-wide-web. Pulling react95 +
   styled-components into IQForge for one preview card adds a dependency tree
   for fidelity we don't own anyway. If exact fidelity matters more than
   bundle weight, it's a one-file swap.

## Questions for you

1. Theme key shape: I used `theme: { format: "react95", tokens: {...} }`.
   Your note shows `format → theme` adjacently — if you'd rather have
   `{ library, theme }` as the key names, say so before this ships anywhere;
   it's a contract, so naming it once correctly matters.
2. First-time profile writes: I replicated your initializeDbRoot guard. On
   mainnet `iqprofile-root` presumably exists — is the guard still wanted, or
   does updateUserMetadata's path handle a brand-new user PDA on its own?
3. git-sdk speed: default "light" is Helius-free-tier friendly. Our payloads
   are one ~50–300KB HTML blob — fine on light, or worth "medium" by default?
4. SNS record value: still the bare treeTxId (gateway-agnostic). Confirm you
   don't want the `/site/` URL form instead.
5. Live-fire is still the gap: no funded-wallet tx has been sent from this
   app. The chain layer is now your published SDKs end-to-end, so risk is
   low, but first publish + first profile save need a real test.
