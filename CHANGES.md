# Deep-dive round — what changed and why

## The discovery that drove this round
Your project rules pointed at the deployed gateway (gateway.iqlabs.dev). It's
live and its source is public — so I studied it. Confirmed architecture:

  • A published site = files written on-chain + a MANIFEST transaction.
    The manifest tx signature IS the on-chain path (the "tail of the linked
    list" from your IQ rules, confirmed in production).
  • The gateway serves it at  gateway.iqlabs.dev/site/{manifestSig}
  • The .sol domain carries ONE URL record that the gateway resolves to the
    manifest at request time.

## Real (not stubbed) additions
- lib/gateway.ts — live read integration with the deployed gateway:
  site URLs, manifest fetch, health. Reads need no SDK or wallet.
- "Live ↗" links on the dashboard and publish-success screen open published
  sites on the real gateway (hidden for demo-mode publishes).

## New user-facing improvements
- View page (/preview/{siteId}): full-screen view of any saved site, linked
  from My Sites and the publish-success screen.
- Download HTML backup: one click exports the site as a single HTML file —
  also the exact input format the real manifest deploy pipeline needs.
- Image optimization on upload: photos are downscaled/compressed before they
  enter the site (on-chain storage is priced per byte — this cuts costs ~10-50x
  on phone photos) (lib/image.ts).
- Onchain size shown on the publish screen, so costs are never a surprise.
- Friendly error when browser storage fills up, instead of a silent failure.
- Delete now asks for confirmation.

## Cleanups (per project rules)
- Removed readFromIQLabs() — reads belong to the gateway layer; no duplicate-
  purpose functions. lib/iqlabs.ts is now writes-only and documents the
  confirmed manifest model. lib/sns.ts docs updated to the URL-record model.

## Changed files this round
NEW: lib/gateway.ts, lib/image.ts, lib/export-html.ts, app/preview/[siteId]/page.tsx
UPDATED: lib/iqlabs.ts, lib/sns.ts, lib/site-store.ts,
         components/template-customizer.tsx, components/publish/publish-step.tsx,
         app/dashboard/page.tsx, app/build/[templateId]/page.tsx
(ZIP contains the complete project so it runs as-is.)

## Awaiting owner decision (not done on purpose)
1. Make static-HTML + manifest the canonical publish format (recommended).
2. Wire real on-chain writes via the public iqlabs-solana-sdk repo.
3. Wire the real SNS URL-record write.
4. Build the remaining 14 templates.
