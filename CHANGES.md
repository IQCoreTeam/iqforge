# Launch plumbing — what's in this update

Plain-English summary. This is the round that turns the clickable demo into
something people can actually use end-to-end.

## What now works
- **Connect wallet** — a Connect button (Phantom / Solflare) sits in the top bar
  on every page. Sites are tied to the connected wallet.
- **My Sites dashboard** (`/dashboard`) — see everything you've built, with a
  status tag (draft / published) and the attached domain. Big **Create New Site**
  button. Edit or delete any site.
- **Domain step** — after editing, you pick one of your existing `.sol` domains,
  register a new one, or skip and attach later.
- **Publish step** — writes the site onchain via IQLabs and points the domain at
  it, with a progress display and a success screen.
- A simple **home page** tying it together.

## The full flow, start to finish
Home → Templates → pick one → edit with live preview → **Continue** →
choose a `.sol` domain → **Publish onchain** → lands in **My Sites**.

## Try the whole thing today
    npm install
    NEXT_PUBLIC_IQ_MOCK=1 npm run dev

With `NEXT_PUBLIC_IQ_MOCK=1`, the publish + domain steps complete in a simulated
mode so you can walk the entire experience without the live SDKs. (Reading your
real `.sol` domains uses live SNS, so connect a wallet that owns one — or just
use the "register new" / "skip" options in mock mode.)

## Honoring your rules
- **Zip rule:** only changed/new files are included.
- **IQ rule:** publishing follows your model — write the site as an on-chain path
  (tail transaction or PDA), then index that path to the wallet. The real SDK
  call is still a clearly-marked placeholder; mock mode stands in for now.

## Still placeholder (need the real SDKs)
- IQLabs write/read (`lib/iqlabs.ts`) — the one spot to wire the SDK.
- SNS domain registration + record write (`lib/sns.ts`) — domain *lookup* is
  already live; *registering* and *writing the record* are stubbed.

## Files in this ZIP
New:
- app/page.tsx                       (home)
- app/layout.tsx                     (wraps app in wallet providers + header)
- app/providers.tsx                  (wallet adapter setup)
- app/dashboard/page.tsx             (My Sites)
- components/site-header.tsx         (top bar + connect button)
- components/publish/domain-step.tsx
- components/publish/publish-step.tsx
- lib/site-store.ts                  (your sites, saved in the browser for now)
- lib/publish.ts                     (runs publish + domain attach together)

Changed:
- app/build/[templateId]/page.tsx    (now runs the full 3-step flow)
- app/globals.css                    (themed the wallet button neon-green)
