# IQForge

**The Squarespace for the Solana Internet**

No-code website builder that creates beautiful, fully onchain websites tied to your SNS (.sol) domains.

Built for **IQLabs Official** in partnership with **SNS**.

---

### Features

- **Wallet Connect** — Phantom, Solflare, and other Solana wallets
- **Template Gallery** — 18 professionally designed templates
- **Easy Customizer** — Modify text, images, backgrounds, and colors
- **SNS Integration** — Connect existing .sol domains or register new ones
- **One-Click Publish** — Store site permanently on Solana via IQLabs + update SNS record
- **Eternal Websites** — Truly decentralized, censorship-resistant, and permanent

---

### 🚀 Roadmap

#### Phase 1: Foundation (Completed)
- Next.js 15 + TypeScript + Tailwind + shadcn/ui
- Wallet connection
- Clean project structure and routing
- IQLabs neon-green / near-black theming

#### Phase 2: Template System (In Progress)
- 18 high-quality templates
- Template Gallery page
- Template Customizer (text, images, background, colors)
- Live preview while editing

#### Phase 3: SNS + IQLabs Integration (Next)
- Display user's .sol domains
- Register new SNS domains if needed
- Publish flow: IQLabs onchain storage (`codeIn`) → Update SNS record
- IPFS/Arweave as optional fallback

#### Phase 4: Polish & MVP Launch
- User dashboard ("My Sites")
- Mobile-responsive templates
- Basic SEO & metadata settings
- Publish success page with shareable link

#### Phase 5: AI Assistant & Enhancements
- AI-powered content & section generation
- Smart template suggestions
- Advanced customization options

#### Future (Post-MVP)
- Full drag & drop editor
- Team collaboration
- Template marketplace
- Analytics
- Advanced Web3 components (NFT galleries, token widgets, payment buttons)
- Multi-chain support

---

### Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS + shadcn/ui**
- **Solana Wallet Adapter**
- **SNS SDK** (Solana Name Service)
- **IQLabs SDK** (primary onchain storage)
- Framer Motion (animations)

---

### Quick Start

```bash
git clone https://github.com/jsketto/iqforge.git
cd iqforge
npm install --legacy-peer-deps
cp .env.local.example .env.local
npm run dev
