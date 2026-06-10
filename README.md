# IQForge — complete project

This is the **whole app in one folder** (not a patch). Unzip it and run it.

## Run it (3 steps)

You need **Node.js 18 or newer** installed first. If you don't have it, get the
"LTS" version from https://nodejs.org and install it, then reopen your terminal.

Then, in a terminal pointed at this folder:

```
npm install
npm run dev
```

When it says "ready", open your browser to:

```
http://localhost:3000
```

That's it. Click **Browse templates**, pick one, edit it, and walk the whole
flow through to Publish.

## About "demo mode"
The file `.env.local` has `NEXT_PUBLIC_IQ_MOCK=1` turned on. That lets the
**Publish** and **domain** steps finish in a pretend mode, so you can experience
the full journey before the real blockchain SDKs are connected. Nothing is
actually written onchain in this mode. To go live later, those two connections
(IQLabs + SNS) get wired in `lib/iqlabs.ts` and `lib/sns.ts`.

## What's inside
- 4 finished templates (Creator Profile, Meme Coin Launcher, NFT Collection Hub,
  Token Dashboard) + 14 "coming soon" tiles, named per your list.
- Wallet connect, a "My Sites" dashboard, the domain-attach step, and publish.
- IQLabs neon-green / near-black theme throughout.

## Going live (real onchain publishing)
Demo mode is ON by default. To publish for real: open .env.local, change
NEXT_PUBLIC_IQ_MOCK to 0, restart npm run dev, connect a funded wallet.
Real publishing pays Solana transaction fees plus an IQ protocol fee, and
attaching a domain writes a real SNS record on your .sol name. Test with a
throwaway wallet first.

## Common hiccups
- **"npm: command not found"** → Node.js isn't installed yet. See step above.
- **A wall of red text during `npm install`** → usually just warnings, not errors.
  If it finishes and you can run `npm run dev`, you're fine.
- **Install crashes on Windows mentioning `git config`, `yarn`, or `'true' is
  not recognized`** → this project already handles it (the included `.npmrc`
  skips those Mac/Linux-only setup scripts). If you somehow still hit it, run
  `npm install --ignore-scripts` instead, then `npm run dev`.
- **Port already in use** → run `npm run dev -- -p 3001` and use port 3001.
