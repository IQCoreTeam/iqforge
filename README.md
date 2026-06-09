# IQForge

**The Squarespace for the Solana Internet**

No-code drag & drop builder that creates fully onchain websites tied to SNS (.sol) domains.

Built for IQLabs Official.

## Features
- Wallet Connect (Phantom, Solflare, etc.)
- Drag & Drop Website Editor
- Publish directly to IPFS + SNS domain
- AI-powered section generation
- Beautiful templates (NFT projects, personal sites, dApps, etc.)

## Roadmap
Phase 1: Foundation (Completed)

Next.js 15 + TypeScript + Tailwind + shadcn/ui setup
Wallet connection (Phantom, Solflare, etc.)
Basic project structure and routing

Phase 2: Drag & Drop Editor (Completed)

Visual canvas with live preview
Component library (Hero, Text, Image, Button, etc.)
Properties panel for editing
Drag & drop reordering using @dnd-kit

Phase 3: SNS + IQLabs Integration (Next)

SNS domain selection and management
IQLabs SDK integration for onchain storage (codeIn)
Publish flow: Build → Store on Solana via IQLabs → Update SNS record
IPFS as optional fallback

Phase 4: AI Assistant

AI-powered section generation
"Describe your site" → auto layout
Smart content suggestions

Phase 5: Polish & Launch

Template gallery
Responsive design tools
Analytics & SEO settings
User dashboard (My Sites)
Custom domain support
Mobile editor experience

Future (Post-MVP)

Team collaboration on sites
Marketplace for premium templates
Advanced components (NFT galleries, token widgets, payment buttons)
Multi-chain support

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind + shadcn/ui
- Solana Web3.js + SNS SDK
- IPFS / Arweave

## Quick Start

```bash
git clone https://github.com/yourusername/iqforge.git
cd iqforge
npm install
npm run dev
