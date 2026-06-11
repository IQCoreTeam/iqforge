# ZO_PLAN round — the split, on his rails

## §0 ✅ git-sdk replaces the hand-rolled chain layer
lib/iqlabs.ts now runs on @iqlabs-official/git-sdk (browser entry): each site
gets a deterministic on-chain repo (iqforge-<id8>); publishing = commit of
{ index.html, iqpages.json }. Commit.treeTxId is the pointer — verified the
gateway normalizes git tree.json ("Iqoogle format") at /site/{sig}, so the
.sol Url record carries the bare treeTxId unchanged. Re-publish commits to the
same repo: version history + blob dedup for free. deployPages (0.2 SOL gallery
fee) deliberately NOT auto-charged — proposed as an opt-in checkbox (ZO_REPLY).

## §1 ✅ Profile split out of the gallery
New /profile editor (header nav added). Writes through the SAME shared system
iq-wide-web reads — exact flow ported from its source: iqprofile-root guard →
codeIn(profile JSON) → updateUserMetadata. Contract extends ProfileMeta with
Zo's theme field: { format: "react95", tokens } in the original.ts flat-token
shape. Four first-class IQ themes ship (iq-terminal, original, vapor, paper)
with a token-driven win95-style live preview. Read path: user PDA metadata →
JSON or txId → gateway /data/{txId} (new fetchTxData in lib/gateway.ts).

## §2/§4 ✅ examples/ + study
Pulled GrapesJS, Craft.js, Puck; read their state/persist/export internals.
examples/STUDY.md has file-level findings + the v2 editor recommendation
(adopt Puck's {root, content:[{type,props}]} document shape; our field-schema
system already matches its fields concept). License check: Craft.js + Puck =
MIT (vendored locally via pull-examples.sh); GrapesJS = BSD-3 → studied, not
vendored, per the MIT rule. Sources aren't in this zip (~20MB) — run
examples/pull-examples.sh.

## Also
ZO_REPLY.md — full response: adopted items, findings, the two judgment calls,
and 5 questions for Zo. README was already clean of stale "GitHub" framing.
tsconfig excludes examples/. Webpack stubs git-sdk's optional EVM adapter.

Verified: tsc clean, next build clean (7 routes incl. /profile).

## Changed files
NEW: lib/profile.ts, app/profile/page.tsx, ZO_REPLY.md,
     examples/STUDY.md, examples/pull-examples.sh
UPDATED: lib/iqlabs.ts (git-sdk), lib/gateway.ts (+fetchTxData),
         lib/types.ts (StorageRef.repo), components/site-header.tsx,
         next.config.mjs, tsconfig.json, package.json (+git-sdk)

# Gallery thumbnails round (quick one)

Browse Templates cards no longer show a giant initial letter. Each card now
renders the REAL template (its default content + theme) scaled to fit the
card, with a soft 1.5px blur and a gentle dark scrim for text legibility.

Why live renders instead of screenshot images: they can never go stale — the
gallery always shows exactly what opens in the editor, including any future
template edits, automatically. Renders are pointer-inert and aria-hidden, so
the whole card stays one clean click target.

Changed files: app/templates/page.tsx only.
Verified: tsc clean, next build clean.
