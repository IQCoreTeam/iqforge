// lib/templates.ts
import {
  IQ_THEME,
  type TemplateDefinition,
  type TemplateMeta,
} from "./types";

// =============================================================================
// TIER 1 — fully built templates (the 4 highest-demand types).
// Pattern for all of them: meta + `fields` (drives the Customizer form) +
// `defaultContent`. To ship a Tier-2 template later, copy one of these.
// =============================================================================

// 1) CREATOR PROFILE — the link-in-bio / personal homepage. Highest volume.
export const creatorProfile: TemplateDefinition = {
  id: "creator-profile",
  name: "Creator Profile",
  category: "creator",
  description:
    "Clean personal homepage for artists, developers, and influencers. Name, tagline, avatar, and a stack of links.",
  tags: ["creator", "links", "personal"],
  thumbnail: "/templates/creator-profile.png",
  accentColor: IQ_THEME.primary,
  status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "name", label: "Display name", type: "text", group: "Hero", placeholder: "Satoshi", maxLength: 40 },
    { key: "handle", label: "Handle", type: "text", group: "Hero", placeholder: "@satoshi", maxLength: 30 },
    { key: "tagline", label: "Tagline", type: "textarea", group: "Hero", placeholder: "Building eternal things onchain.", maxLength: 160 },
    { key: "avatar", label: "Avatar image", type: "image", group: "Hero", helpText: "Square works best (512×512)." },
    { key: "background", label: "Background image", type: "image", group: "Look", helpText: "Optional. Sits behind a dark scrim." },
    { key: "aboutTitle", label: "Section title", type: "text", group: "About", placeholder: "About", maxLength: 40 },
    { key: "about", label: "About text", type: "textarea", group: "About", placeholder: "A few sentences about you.", maxLength: 600 },
    {
      key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [
        { key: "label", label: "Label", type: "text", placeholder: "Twitter / X" },
        { key: "url", label: "URL", type: "url", placeholder: "https://x.com/..." },
      ],
      defaultItem: { label: "New link", url: "https://" },
    },
  ],
  defaultContent: {
    name: "Your Name",
    handle: "@yourhandle",
    tagline: "Creator, builder, permanently onchain.",
    avatar: "",
    background: "",
    aboutTitle: "About",
    about:
      "Write a short introduction here. Who are you, what do you make, and where can people find you? Keep it punchy — this is your front page.",
    links: [
      { label: "Twitter / X", url: "https://x.com/" },
      { label: "GitHub", url: "https://github.com/" },
      { label: "Website", url: "https://" },
    ],
  },
};

// 6) MEME COIN LAUNCHER — Solana's signature use case. Countdown + buy + how-to.
export const memeCoinLauncher: TemplateDefinition = {
  id: "meme-coin-launcher",
  name: "Meme Coin Launcher",
  category: "token",
  description:
    "Fun, viral-ready token launch page with countdown, contract-copy, and a big buy button.",
  tags: ["meme", "token", "launch"],
  thumbnail: "/templates/meme-coin-launcher.png",
  accentColor: "#FFE14D",
  status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#FFE14D" },
  fields: [
    { key: "coinName", label: "Coin name", type: "text", group: "Hero", placeholder: "DogWifMoon", maxLength: 40 },
    { key: "ticker", label: "Ticker", type: "text", group: "Hero", placeholder: "$WIFM", maxLength: 12 },
    { key: "logo", label: "Coin logo", type: "image", group: "Hero" },
    { key: "heroTagline", label: "Tagline", type: "textarea", group: "Hero", placeholder: "The only coin your dog endorses.", maxLength: 140 },
    { key: "background", label: "Background image", type: "image", group: "Look" },
    { key: "launchDate", label: "Launch date/time", type: "text", group: "Launch", placeholder: "2026-07-01T18:00:00Z", helpText: "ISO format. Leave blank if already live." },
    { key: "contractAddress", label: "Contract address", type: "text", group: "Launch", placeholder: "So1111...1112" },
    { key: "buyUrl", label: "Buy button link", type: "url", group: "Launch", placeholder: "https://raydium.io/swap/..." },
    { key: "about", label: "About / lore", type: "textarea", group: "About", maxLength: 600 },
    {
      key: "howToBuy", label: "How to buy steps", type: "list", group: "How to buy",
      itemFields: [{ key: "step", label: "Step", type: "text", placeholder: "Get a Phantom wallet" }],
      defaultItem: { step: "New step" },
    },
    {
      key: "socials", label: "Socials", type: "list", group: "Socials",
      itemFields: [
        { key: "label", label: "Label", type: "text", placeholder: "Telegram" },
        { key: "url", label: "URL", type: "url", placeholder: "https://t.me/..." },
      ],
      defaultItem: { label: "New", url: "https://" },
    },
  ],
  defaultContent: {
    coinName: "MoonDoge",
    ticker: "$MOON",
    logo: "",
    heroTagline: "The community coin powering the next leg up. No roadmap, just vibes.",
    background: "",
    launchDate: "",
    contractAddress: "So11111111111111111111111111111111111111112",
    buyUrl: "https://raydium.io/swap/",
    about:
      "Born from a meme, raised by the community. $MOON is a fair-launch token with no team allocation and locked liquidity. Apes together strong.",
    howToBuy: [
      { step: "Download a Solana wallet like Phantom" },
      { step: "Fund it with SOL from any exchange" },
      { step: "Hit the Buy button and swap SOL for the token" },
      { step: "Hold, meme, repeat" },
    ],
    socials: [
      { label: "Telegram", url: "https://t.me/" },
      { label: "Twitter / X", url: "https://x.com/" },
    ],
  },
};

// 7) TOKEN DASHBOARD — clean utility token site: tokenomics + roadmap + utility.
export const tokenDashboard: TemplateDefinition = {
  id: "token-dashboard",
  name: "Token Dashboard",
  category: "token",
  description:
    "Clean utility token site with tokenomics breakdown, roadmap, and utility highlights.",
  tags: ["tokenomics", "utility", "token"],
  thumbnail: "/templates/token-dashboard.png",
  accentColor: IQ_THEME.primary,
  status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "tokenName", label: "Token name", type: "text", group: "Hero", maxLength: 40 },
    { key: "ticker", label: "Ticker", type: "text", group: "Hero", maxLength: 12 },
    { key: "logo", label: "Logo", type: "image", group: "Hero" },
    { key: "tagline", label: "Tagline", type: "textarea", group: "Hero", maxLength: 160 },
    { key: "background", label: "Background image", type: "image", group: "Look" },
    { key: "totalSupply", label: "Total supply", type: "text", group: "Stats", placeholder: "1,000,000,000" },
    { key: "about", label: "About", type: "textarea", group: "About", maxLength: 600 },
    {
      key: "tokenomics", label: "Tokenomics", type: "list", group: "Tokenomics",
      itemFields: [
        { key: "label", label: "Allocation", type: "text", placeholder: "Liquidity" },
        { key: "value", label: "Percent", type: "text", placeholder: "40" },
      ],
      defaultItem: { label: "Allocation", value: "10" },
    },
    {
      key: "utilities", label: "Utility", type: "list", group: "Utility",
      itemFields: [
        { key: "title", label: "Title", type: "text", placeholder: "Staking" },
        { key: "detail", label: "Detail", type: "text", placeholder: "Earn yield by locking tokens." },
      ],
      defaultItem: { title: "New utility", detail: "" },
    },
    {
      key: "roadmap", label: "Roadmap", type: "list", group: "Roadmap",
      itemFields: [
        { key: "phase", label: "Phase", type: "text", placeholder: "Q3 2026" },
        { key: "title", label: "Title", type: "text", placeholder: "CEX listings" },
        { key: "detail", label: "Detail", type: "text" },
      ],
      defaultItem: { phase: "Q1", title: "New milestone", detail: "" },
    },
    {
      key: "socials", label: "Links", type: "list", group: "Links",
      itemFields: [
        { key: "label", label: "Label", type: "text" },
        { key: "url", label: "URL", type: "url", placeholder: "https://" },
      ],
      defaultItem: { label: "New", url: "https://" },
    },
  ],
  defaultContent: {
    tokenName: "IQ Token",
    ticker: "$IQ",
    logo: "",
    tagline: "Utility-first token powering eternal onchain infrastructure.",
    background: "",
    totalSupply: "1,000,000,000",
    about:
      "A utility token designed for real usage: pay for permanent onchain storage, stake for protocol rewards, and govern the network.",
    tokenomics: [
      { label: "Liquidity", value: "40" },
      { label: "Community", value: "30" },
      { label: "Treasury", value: "20" },
      { label: "Team", value: "10" },
    ],
    utilities: [
      { title: "Storage", detail: "Spend tokens to write data permanently onchain." },
      { title: "Staking", detail: "Lock tokens to earn protocol fees." },
      { title: "Governance", detail: "Vote on proposals and treasury spend." },
    ],
    roadmap: [
      { phase: "Q1 2026", title: "Mainnet", detail: "Protocol live on Solana." },
      { phase: "Q2 2026", title: "Staking", detail: "Staking and rewards launch." },
      { phase: "Q3 2026", title: "Listings", detail: "Exchange and partner integrations." },
    ],
    socials: [
      { label: "Twitter / X", url: "https://x.com/" },
      { label: "Docs", url: "https://" },
    ],
  },
};

// 9) NFT COLLECTION HUB — hero + gallery + mint panel + roadmap.
export const nftCollectionHub: TemplateDefinition = {
  id: "nft-collection-hub",
  name: "NFT Collection Hub",
  category: "nft",
  description:
    "Full-featured NFT project site with collection gallery, mint panel, and roadmap.",
  tags: ["mint", "gallery", "nft"],
  thumbnail: "/templates/nft-collection-hub.png",
  accentColor: "#A78BFA",
  status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#A78BFA" },
  fields: [
    { key: "collectionName", label: "Collection name", type: "text", group: "Hero", maxLength: 50 },
    { key: "tagline", label: "Tagline", type: "textarea", group: "Hero", maxLength: 160 },
    { key: "heroImage", label: "Hero image", type: "image", group: "Hero" },
    { key: "mintPrice", label: "Mint price", type: "text", group: "Mint", placeholder: "1.5 SOL" },
    { key: "totalSupply", label: "Total supply", type: "text", group: "Mint", placeholder: "5000" },
    { key: "minted", label: "Minted so far", type: "text", group: "Mint", placeholder: "1284" },
    { key: "mintUrl", label: "Mint button link", type: "url", group: "Mint", placeholder: "https://" },
    { key: "about", label: "About", type: "textarea", group: "About", maxLength: 600 },
    {
      key: "gallery", label: "Gallery items", type: "list", group: "Gallery",
      itemFields: [
        { key: "image", label: "Image", type: "image" },
        { key: "name", label: "Name", type: "text", placeholder: "#001" },
      ],
      defaultItem: { image: "", name: "#000" },
    },
    {
      key: "roadmap", label: "Roadmap", type: "list", group: "Roadmap",
      itemFields: [
        { key: "title", label: "Title", type: "text" },
        { key: "detail", label: "Detail", type: "text" },
      ],
      defaultItem: { title: "New phase", detail: "" },
    },
    {
      key: "socials", label: "Socials", type: "list", group: "Socials",
      itemFields: [
        { key: "label", label: "Label", type: "text" },
        { key: "url", label: "URL", type: "url", placeholder: "https://" },
      ],
      defaultItem: { label: "New", url: "https://" },
    },
  ],
  defaultContent: {
    collectionName: "Eternal Apes",
    tagline: "5,000 fully onchain apes living forever on Solana.",
    heroImage: "",
    mintPrice: "1.5 SOL",
    totalSupply: "5000",
    minted: "1284",
    mintUrl: "https://",
    about:
      "A collection that lives entirely onchain — no IPFS link rot, no broken images in five years. Mint one and it's yours, permanently.",
    gallery: [
      { image: "", name: "#001" },
      { image: "", name: "#002" },
      { image: "", name: "#003" },
      { image: "", name: "#004" },
    ],
    roadmap: [
      { title: "Mint", detail: "Public mint opens." },
      { title: "Staking", detail: "Stake your ape for rewards." },
      { title: "IRL", detail: "Holder events and merch." },
    ],
    socials: [
      { label: "Twitter / X", url: "https://x.com/" },
      { label: "Discord", url: "https://discord.gg/" },
    ],
  },
};

// ── 5) DIGITAL NOMAD ─────────────────────────────────────────────────────────
export const digitalNomad: TemplateDefinition = {
  id: "digital-nomad", name: "Digital Nomad", category: "creator",
  description: "Modern personal brand site with bio, links, and a photo gallery.",
  tags: ["brand", "gallery", "creator"], thumbnail: "/templates/digital-nomad.png",
  accentColor: "#5EC9FF", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#5EC9FF" },
  fields: [
    { key: "name", label: "Name", type: "text", group: "Hero", maxLength: 40 },
    { key: "location", label: "Current location", type: "text", group: "Hero", placeholder: "Lisbon, Portugal" },
    { key: "avatar", label: "Photo", type: "image", group: "Hero" },
    { key: "bio", label: "Bio", type: "textarea", group: "Hero", maxLength: 400 },
    { key: "photos", label: "Gallery", type: "list", group: "Gallery",
      itemFields: [{ key: "image", label: "Photo", type: "image" }, { key: "caption", label: "Caption", type: "text" }],
      defaultItem: { image: "", caption: "" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    name: "Your Name", location: "Somewhere, Earth", avatar: "",
    bio: "Designer, writer, and perpetual traveler. Documenting the journey one city at a time.",
    photos: [ { image: "", caption: "Tokyo, 2025" }, { image: "", caption: "Mexico City" }, { image: "", caption: "Lisbon" } ],
    links: [ { label: "Instagram", url: "https://instagram.com/" }, { label: "Newsletter", url: "https://" } ],
  },
};

// ── 6) SOLANA MAXIMALIST ─────────────────────────────────────────────────────
export const solanaMaximalist: TemplateDefinition = {
  id: "solana-maximalist", name: "Solana Maximalist", category: "creator",
  description: "Bold personal page for heavy Solana ecosystem participants.",
  tags: ["solana", "degen", "creator"], thumbnail: "/templates/solana-maximalist.png",
  accentColor: "#14F195", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#14F195" },
  fields: [
    { key: "name", label: "Name", type: "text", group: "Hero", maxLength: 40 },
    { key: "headline", label: "Headline", type: "text", group: "Hero", placeholder: "OPOS believer since 2021" },
    { key: "avatar", label: "Avatar", type: "image", group: "Hero" },
    { key: "stats", label: "Stats", type: "list", group: "Stats",
      itemFields: [{ key: "value", label: "Value", type: "text" }, { key: "label", label: "Label", type: "text" }],
      defaultItem: { value: "0", label: "stat" } },
    { key: "manifesto", label: "Manifesto", type: "textarea", group: "Manifesto", maxLength: 500 },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    name: "Anatoly's Strongest Soldier", headline: "Only possible on Solana", avatar: "",
    stats: [ { value: "2021", label: "first tx" }, { value: "47", label: "NFTs held" }, { value: "∞", label: "conviction" } ],
    manifesto: "Cheap blockspace is a human right. I was here for the outages, I'll be here for the flippening.",
    links: [ { label: "Follow on X", url: "https://x.com/" }, { label: "My collection", url: "https://" } ],
  },
};

// ── 7) STARTUP ABOUT ─────────────────────────────────────────────────────────
export const startupAbout: TemplateDefinition = {
  id: "startup-about", name: "Startup About", category: "company",
  description: "Professional team + mission page for Web3 projects.",
  tags: ["team", "mission", "company"], thumbnail: "/templates/startup-about.png",
  accentColor: IQ_THEME.primary, status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "company", label: "Company name", type: "text", group: "Hero", maxLength: 40 },
    { key: "mission", label: "Mission statement", type: "textarea", group: "Hero", maxLength: 160 },
    { key: "logo", label: "Logo", type: "image", group: "Hero" },
    { key: "story", label: "Our story", type: "textarea", group: "Story", maxLength: 600 },
    { key: "values", label: "Values", type: "list", group: "Values",
      itemFields: [{ key: "title", label: "Title", type: "text" }, { key: "detail", label: "Detail", type: "text" }],
      defaultItem: { title: "New value", detail: "" } },
    { key: "team", label: "Team", type: "list", group: "Team",
      itemFields: [{ key: "name", label: "Name", type: "text" }, { key: "role", label: "Role", type: "text" }, { key: "photo", label: "Photo", type: "image" }],
      defaultItem: { name: "New member", role: "", photo: "" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    company: "Acme Labs", mission: "Making the permanent web inevitable.", logo: "",
    story: "We started Acme because the internet forgets. Links rot, platforms die, and a decade of culture vanishes. We're building infrastructure that remembers.",
    values: [ { title: "Permanence", detail: "If it matters, it stays." }, { title: "Openness", detail: "Anyone can verify, anyone can build." }, { title: "Craft", detail: "Quality is the strategy." } ],
    team: [ { name: "Alex Kim", role: "CEO", photo: "" }, { name: "Sam Rivera", role: "CTO", photo: "" }, { name: "Jo Park", role: "Design", photo: "" }, { name: "Max Chen", role: "Protocol", photo: "" } ],
    links: [ { label: "Twitter / X", url: "https://x.com/" }, { label: "Careers", url: "https://" } ],
  },
};

// ── 8) AGENCY SHOWCASE ───────────────────────────────────────────────────────
export const agencyShowcase: TemplateDefinition = {
  id: "agency-showcase", name: "Agency Showcase", category: "company",
  description: "Service-focused team site with portfolio sections.",
  tags: ["agency", "services", "portfolio"], thumbnail: "/templates/agency-showcase.png",
  accentColor: "#FF8A3D", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#FF8A3D" },
  fields: [
    { key: "agency", label: "Agency name", type: "text", group: "Hero", maxLength: 40 },
    { key: "tagline", label: "Tagline", type: "textarea", group: "Hero", maxLength: 120 },
    { key: "intro", label: "Intro", type: "textarea", group: "Hero", maxLength: 400 },
    { key: "services", label: "Services", type: "list", group: "Services",
      itemFields: [{ key: "title", label: "Service", type: "text" }, { key: "detail", label: "Detail", type: "text" }],
      defaultItem: { title: "New service", detail: "" } },
    { key: "work", label: "Case studies", type: "list", group: "Work",
      itemFields: [{ key: "title", label: "Title", type: "text" }, { key: "detail", label: "Detail", type: "text" }, { key: "image", label: "Image", type: "image" }],
      defaultItem: { title: "New project", detail: "", image: "" } },
    { key: "contactLabel", label: "Contact button text", type: "text", group: "Contact" },
    { key: "contactUrl", label: "Contact link", type: "url", group: "Contact" },
  ],
  defaultContent: {
    agency: "Studio North", tagline: "We build brands people remember.",
    intro: "A small senior team doing strategy, identity, and product design for ambitious Web3 companies.",
    services: [ { title: "Brand identity", detail: "Naming, logo, voice, system." }, { title: "Product design", detail: "From zero to shipped dApp." }, { title: "Launch campaigns", detail: "Make the timeline yours for a week." } ],
    work: [ { title: "Nova Protocol", detail: "Full rebrand + site", image: "" }, { title: "Mintropolis", detail: "NFT launch campaign", image: "" } ],
    contactLabel: "Work with us", contactUrl: "https://",
  },
};

// ── 9) STEALTH LAUNCH ────────────────────────────────────────────────────────
export const stealthLaunch: TemplateDefinition = {
  id: "stealth-launch", name: "Stealth Launch", category: "token",
  description: "Mysterious dark-mode token reveal page with countdown.",
  tags: ["stealth", "countdown", "token"], thumbnail: "/templates/stealth-launch.png",
  accentColor: "#FF3B5C", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#FF3B5C", background: "#050506" },
  fields: [
    { key: "codename", label: "Codename / ticker", type: "text", group: "Reveal", placeholder: "$REDACTED", maxLength: 20 },
    { key: "teaser", label: "Teaser line", type: "textarea", group: "Reveal", maxLength: 200 },
    { key: "revealDate", label: "Reveal date/time", type: "text", group: "Reveal", placeholder: "2026-07-01T18:00:00Z", helpText: "ISO format. Countdown shows until then." },
    { key: "contractAddress", label: "Contract (shown after reveal)", type: "text", group: "Reveal" },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "telegram", url: "https://" } },
  ],
  defaultContent: {
    codename: "$REDACTED",
    teaser: "Something is waking up. Those who know, know. Those who don't will find out together.",
    revealDate: "", contractAddress: "",
    links: [ { label: "telegram", url: "https://t.me/" }, { label: "x", url: "https://x.com/" } ],
  },
};

// ── 10) PFP GALLERY ──────────────────────────────────────────────────────────
export const pfpGallery: TemplateDefinition = {
  id: "pfp-gallery", name: "PFP Gallery", category: "nft",
  description: "Stylish profile-picture collection showcase.",
  tags: ["pfp", "gallery", "nft"], thumbnail: "/templates/pfp-gallery.png",
  accentColor: "#FF6BD6", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#FF6BD6" },
  fields: [
    { key: "collection", label: "Collection name", type: "text", group: "Hero", maxLength: 40 },
    { key: "tagline", label: "Tagline", type: "textarea", group: "Hero", maxLength: 140 },
    { key: "supply", label: "Supply", type: "text", group: "Stats" },
    { key: "holders", label: "Holders", type: "text", group: "Stats" },
    { key: "pfps", label: "PFPs", type: "list", group: "Gallery",
      itemFields: [{ key: "image", label: "Image", type: "image" }, { key: "name", label: "Name", type: "text" }],
      defaultItem: { image: "", name: "#0000" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    collection: "Pixel Pals", tagline: "10,000 friends living rent-free onchain.",
    supply: "10,000", holders: "3,412",
    pfps: [ { image: "", name: "#0001" }, { image: "", name: "#0042" }, { image: "", name: "#0137" }, { image: "", name: "#0420" }, { image: "", name: "#0777" } ],
    links: [ { label: "Buy on Tensor", url: "https://" }, { label: "Discord", url: "https://discord.gg/" } ],
  },
};

// ── 11) GENERATIVE ART DROP ──────────────────────────────────────────────────
export const generativeArtDrop: TemplateDefinition = {
  id: "generative-art-drop", name: "Generative Art Drop", category: "nft",
  description: "Artistic NFT project template with visual focus and artist statement.",
  tags: ["art", "generative", "nft"], thumbnail: "/templates/generative-art-drop.png",
  accentColor: "#E8E4D8", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#E8E4D8" },
  fields: [
    { key: "series", label: "Series title", type: "text", group: "Hero", maxLength: 60 },
    { key: "artist", label: "Artist name", type: "text", group: "Hero", maxLength: 40 },
    { key: "hero", label: "Hero artwork", type: "image", group: "Hero" },
    { key: "statement", label: "Artist statement", type: "textarea", group: "Statement", maxLength: 800 },
    { key: "mintInfo", label: "Mint info", type: "text", group: "Mint", placeholder: "256 editions · 0.8 SOL" },
    { key: "mintUrl", label: "Collect link", type: "url", group: "Mint" },
    { key: "pieces", label: "Series pieces", type: "list", group: "Series",
      itemFields: [{ key: "image", label: "Image", type: "image" }, { key: "title", label: "Title", type: "text" }],
      defaultItem: { image: "", title: "Untitled" } },
  ],
  defaultContent: {
    series: "Entropy Garden", artist: "0xPainter", hero: "",
    statement: "Each piece is grown, not drawn — a seed of noise cultivated through a hundred generations of a custom algorithm. No two gardens share a root.\n\nThe series explores what permanence means for living systems: frozen onchain, yet forever in bloom.",
    mintInfo: "256 editions · 0.8 SOL", mintUrl: "https://",
    pieces: [ { image: "", title: "Garden 001" }, { image: "", title: "Garden 002" }, { image: "", title: "Garden 003" } ],
  },
};

// ── 12) DAO PORTAL ───────────────────────────────────────────────────────────
export const daoPortal: TemplateDefinition = {
  id: "dao-portal", name: "DAO Portal", category: "dao",
  description: "Governance hub with treasury stats and proposals.",
  tags: ["dao", "governance", "treasury"], thumbnail: "/templates/dao-portal.png",
  accentColor: IQ_THEME.primary, status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "dao", label: "DAO name", type: "text", group: "Hero", maxLength: 40 },
    { key: "mission", label: "One-line mission", type: "text", group: "Hero", maxLength: 100 },
    { key: "logo", label: "Logo", type: "image", group: "Hero" },
    { key: "joinUrl", label: "Join link", type: "url", group: "Hero" },
    { key: "stats", label: "Treasury / stats", type: "list", group: "Stats",
      itemFields: [{ key: "value", label: "Value", type: "text" }, { key: "label", label: "Label", type: "text" }],
      defaultItem: { value: "0", label: "stat" } },
    { key: "proposals", label: "Proposals", type: "list", group: "Proposals",
      itemFields: [{ key: "title", label: "Title", type: "text" }, { key: "status", label: "Status", type: "text", placeholder: "Active / Passed / Failed" }],
      defaultItem: { title: "New proposal", status: "Active" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    dao: "Forge DAO", mission: "Funding tools for the permanent web.", logo: "", joinUrl: "https://",
    stats: [ { value: "$2.4M", label: "treasury" }, { value: "1,847", label: "members" }, { value: "63", label: "proposals" }, { value: "12", label: "grants" } ],
    proposals: [ { title: "FIP-12: Fund gateway redundancy", status: "Active" }, { title: "FIP-11: Grants round 4", status: "Passed" }, { title: "FIP-10: Treasury diversification", status: "Failed" } ],
    links: [ { label: "Forum", url: "https://" }, { label: "Vote", url: "https://" } ],
  },
};

// ── 13) COMMUNITY HUB ────────────────────────────────────────────────────────
export const communityHub: TemplateDefinition = {
  id: "community-hub", name: "Community Hub", category: "dao",
  description: "Vibrant Discord-style community landing page.",
  tags: ["community", "discord", "social"], thumbnail: "/templates/community-hub.png",
  accentColor: "#7B8CFF", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#7B8CFF" },
  fields: [
    { key: "community", label: "Community name", type: "text", group: "Hero", maxLength: 40 },
    { key: "vibe", label: "Vibe / description", type: "text", group: "Hero", maxLength: 100 },
    { key: "banner", label: "Banner image", type: "image", group: "Hero" },
    { key: "members", label: "Member count", type: "text", group: "Hero" },
    { key: "joinUrl", label: "Join link", type: "url", group: "Hero" },
    { key: "channels", label: "Channels", type: "list", group: "Channels",
      itemFields: [{ key: "name", label: "Channel", type: "text" }, { key: "detail", label: "What happens here", type: "text" }],
      defaultItem: { name: "general", detail: "" } },
    { key: "rules", label: "House rules", type: "list", group: "Rules",
      itemFields: [{ key: "rule", label: "Rule", type: "text" }],
      defaultItem: { rule: "Be excellent to each other" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "New link", url: "https://" } },
  ],
  defaultContent: {
    community: "The Foundry", vibe: "Builders, artists, and degens shipping together.", banner: "", members: "4,200", joinUrl: "https://discord.gg/",
    channels: [ { name: "introductions", detail: "Say gm, tell us what you're building" }, { name: "show-and-tell", detail: "Ship it, share it" }, { name: "alpha", detail: "Holders only 👀" } ],
    rules: [ { rule: "Be excellent to each other" }, { rule: "No shilling outside #shill-zone" }, { rule: "Touch grass at least weekly" } ],
    links: [ { label: "Twitter / X", url: "https://x.com/" } ],
  },
};

// ── 14) DEV PORTFOLIO ────────────────────────────────────────────────────────
export const devPortfolio: TemplateDefinition = {
  id: "dev-portfolio", name: "Dev Portfolio", category: "portfolio",
  description: "Developer portfolio with onchain credentials and projects.",
  tags: ["dev", "projects", "portfolio"], thumbnail: "/templates/dev-portfolio.png",
  accentColor: IQ_THEME.primary, status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "name", label: "Name / handle", type: "text", group: "Hero", maxLength: 40 },
    { key: "role", label: "Role", type: "text", group: "Hero", maxLength: 60 },
    { key: "wallet", label: "Public wallet (onchain cred)", type: "text", group: "Hero", helpText: "Shown as your verifiable onchain identity." },
    { key: "about", label: "About", type: "textarea", group: "About", maxLength: 400 },
    { key: "skills", label: "Skills", type: "list", group: "Skills",
      itemFields: [{ key: "skill", label: "Skill", type: "text" }],
      defaultItem: { skill: "rust" } },
    { key: "projects", label: "Projects", type: "list", group: "Projects",
      itemFields: [{ key: "name", label: "Name", type: "text" }, { key: "detail", label: "Description", type: "text" }, { key: "tech", label: "Tech", type: "text" }, { key: "url", label: "Link", type: "url" }],
      defaultItem: { name: "new-project", detail: "", tech: "", url: "https://" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "github", url: "https://github.com/" } },
  ],
  defaultContent: {
    name: "0xdev", role: "Solana program engineer", wallet: "ARh1...x9Kp",
    about: "I write programs that move money and can't be turned off. Previously broke things at two protocols you've used.",
    skills: [ { skill: "rust" }, { skill: "anchor" }, { skill: "typescript" }, { skill: "zk" } ],
    projects: [
      { name: "perp-engine", detail: "On-chain perpetuals matching engine, 40k TPS in bench.", tech: "rust · anchor", url: "https://github.com/" },
      { name: "merkle-drop", detail: "Gas-optimal airdrop claims for 1M+ wallets.", tech: "rust", url: "https://github.com/" },
    ],
    links: [ { label: "github", url: "https://github.com/" }, { label: "x", url: "https://x.com/" } ],
  },
};

// ── 15) CREATOR RESUME ───────────────────────────────────────────────────────
export const creatorResume: TemplateDefinition = {
  id: "creator-resume", name: "Creator Resume", category: "portfolio",
  description: "Visual resume with experience timeline for freelancers and creators.",
  tags: ["resume", "timeline", "portfolio"], thumbnail: "/templates/creator-resume.png",
  accentColor: "#FFC94D", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#FFC94D" },
  fields: [
    { key: "name", label: "Name", type: "text", group: "Hero", maxLength: 40 },
    { key: "title", label: "Title", type: "text", group: "Hero", maxLength: 60 },
    { key: "photo", label: "Photo", type: "image", group: "Hero" },
    { key: "summary", label: "Summary", type: "textarea", group: "Hero", maxLength: 300 },
    { key: "experience", label: "Experience", type: "list", group: "Experience",
      itemFields: [{ key: "period", label: "Period", type: "text", placeholder: "2023 — now" }, { key: "role", label: "Role", type: "text" }, { key: "org", label: "Org", type: "text" }, { key: "detail", label: "Detail", type: "text" }],
      defaultItem: { period: "", role: "New role", org: "", detail: "" } },
    { key: "skills", label: "Skills", type: "list", group: "Skills",
      itemFields: [{ key: "skill", label: "Skill", type: "text" }],
      defaultItem: { skill: "New skill" } },
    { key: "links", label: "Contact / links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "Email me", url: "mailto:" } },
  ],
  defaultContent: {
    name: "Jordan Vale", title: "Freelance motion designer", photo: "",
    summary: "Eight years making brands move. Available for select projects from March.",
    experience: [
      { period: "2023 — now", role: "Independent", org: "Studio of one", detail: "Motion systems for Web3 launches." },
      { period: "2020 — 2023", role: "Senior motion designer", org: "BigCo", detail: "Led a team of four on product animation." },
      { period: "2017 — 2020", role: "Designer", org: "Agencyland", detail: "Brand and campaign work." },
    ],
    skills: [ { skill: "After Effects" }, { skill: "Blender" }, { skill: "Rive" }, { skill: "Art direction" } ],
    links: [ { label: "Email me", url: "mailto:hello@example.com" }, { label: "Showreel", url: "https://" } ],
  },
};

// ── 16) PRODUCT LAUNCH ───────────────────────────────────────────────────────
export const productLaunch: TemplateDefinition = {
  id: "product-launch", name: "Product Launch", category: "startup",
  description: "High-converting SaaS / dApp landing page.",
  tags: ["saas", "landing", "startup"], thumbnail: "/templates/product-launch.png",
  accentColor: "#38E1C6", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#38E1C6" },
  fields: [
    { key: "product", label: "Product name", type: "text", group: "Hero", maxLength: 40 },
    { key: "headline", label: "Headline", type: "textarea", group: "Hero", maxLength: 90 },
    { key: "subheadline", label: "Subheadline", type: "textarea", group: "Hero", maxLength: 160 },
    { key: "screenshot", label: "Product screenshot", type: "image", group: "Hero" },
    { key: "ctaLabel", label: "Primary button text", type: "text", group: "Buttons" },
    { key: "ctaUrl", label: "Primary button link", type: "url", group: "Buttons" },
    { key: "secondaryLabel", label: "Secondary button text", type: "text", group: "Buttons" },
    { key: "secondaryUrl", label: "Secondary button link", type: "url", group: "Buttons" },
    { key: "features", label: "Features", type: "list", group: "Features",
      itemFields: [{ key: "title", label: "Title", type: "text" }, { key: "detail", label: "Detail", type: "text" }],
      defaultItem: { title: "New feature", detail: "" } },
    { key: "footnote", label: "Footnote", type: "text", group: "Footer", maxLength: 100 },
  ],
  defaultContent: {
    product: "ShipFast", headline: "Launch your dApp before lunch.", subheadline: "Everything you need to go from idea to mainnet — wallets, payments, and infra in one SDK.",
    screenshot: "",
    ctaLabel: "Start building", ctaUrl: "https://", secondaryLabel: "Read the docs", secondaryUrl: "https://",
    features: [ { title: "5-minute setup", detail: "One command scaffolds the whole stack." }, { title: "Wallet-native", detail: "Every major Solana wallet, out of the box." }, { title: "Mainnet-grade", detail: "The same infra powering 2M+ tx/day." } ],
    footnote: "Free for the first 10k transactions.",
  },
};

// ── 17) PROTOCOL LANDING ─────────────────────────────────────────────────────
export const protocolLanding: TemplateDefinition = {
  id: "protocol-landing", name: "Protocol Landing", category: "startup",
  description: "Technical yet beautiful blockchain protocol homepage.",
  tags: ["protocol", "infra", "startup"], thumbnail: "/templates/protocol-landing.png",
  accentColor: IQ_THEME.primary, status: "ready",
  defaultTheme: { ...IQ_THEME },
  fields: [
    { key: "protocol", label: "Protocol name", type: "text", group: "Hero", maxLength: 40 },
    { key: "oneLiner", label: "One-liner", type: "textarea", group: "Hero", maxLength: 120 },
    { key: "description", label: "Description", type: "textarea", group: "Hero", maxLength: 400 },
    { key: "metrics", label: "Metrics", type: "list", group: "Metrics",
      itemFields: [{ key: "value", label: "Value", type: "text" }, { key: "label", label: "Label", type: "text" }],
      defaultItem: { value: "0", label: "metric" } },
    { key: "steps", label: "How it works", type: "list", group: "How it works",
      itemFields: [{ key: "title", label: "Step", type: "text" }, { key: "detail", label: "Detail", type: "text" }],
      defaultItem: { title: "New step", detail: "" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "Docs", url: "https://" } },
  ],
  defaultContent: {
    protocol: "Permaweb", oneLiner: "Permanent data availability for Solana.",
    description: "Write once, read forever. Permaweb shards data across transaction history and PDAs, indexed to wallets, recoverable by anyone running a gateway.",
    metrics: [ { value: "31TB", label: "stored" }, { value: "99.99%", label: "uptime" }, { value: "$0.0002", label: "per KB" } ],
    steps: [
      { title: "Write", detail: "Data is chunked into linked transactions or PDAs — the tail becomes the path." },
      { title: "Index", detail: "Path + metadata packaged into one transaction, indexed to your wallet." },
      { title: "Serve", detail: "Any gateway resolves and caches it. No single point of failure." },
    ],
    links: [ { label: "Read the docs", url: "https://" }, { label: "GitHub", url: "https://github.com/" } ],
  },
};

// ── 18) ONCHAIN JOURNAL ──────────────────────────────────────────────────────
export const onchainJournal: TemplateDefinition = {
  id: "onchain-journal", name: "Onchain Journal", category: "blog",
  description: "Minimalist blog / newsletter for long-form writing.",
  tags: ["blog", "writing", "content"], thumbnail: "/templates/onchain-journal.png",
  accentColor: "#D8C9A8", status: "ready",
  defaultTheme: { ...IQ_THEME, primary: "#D8C9A8" },
  fields: [
    { key: "journal", label: "Journal name", type: "text", group: "Header", maxLength: 50 },
    { key: "author", label: "Author", type: "text", group: "Header", maxLength: 40 },
    { key: "about", label: "About line", type: "text", group: "Header", maxLength: 120 },
    { key: "posts", label: "Posts", type: "list", group: "Posts",
      itemFields: [{ key: "date", label: "Date", type: "text", placeholder: "Jun 2026" }, { key: "title", label: "Title", type: "text" }, { key: "body", label: "Body", type: "textarea" }],
      defaultItem: { date: "", title: "New post", body: "" } },
    { key: "links", label: "Links", type: "list", group: "Links",
      itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "url", label: "URL", type: "url" }],
      defaultItem: { label: "Subscribe", url: "https://" } },
  ],
  defaultContent: {
    journal: "Notes from the Permanent Web", author: "A. Writer", about: "Essays on what the internet keeps and what it forgets.",
    posts: [
      { date: "Jun 2026", title: "The case for slow websites", body: "We optimized for speed and lost something on the way. A page that loads in 40ms but vanishes in 4 years is not fast — it's temporary.\n\nThis journal lives onchain. It will outlive its author, its host, and probably its readers. That changes what's worth writing." },
      { date: "May 2026", title: "Link rot is a choice", body: "Every 404 is a decision someone made: to stop paying, to stop caring, to move on. Permanence is also a choice — and for the first time, a cheap one." },
    ],
    links: [ { label: "Subscribe", url: "https://" }, { label: "X", url: "https://x.com/" } ],
  },
};

// =============================================================================
// REGISTRY — all 18, live. Order = gallery order.
// =============================================================================
export const TEMPLATE_DEFINITIONS_LIST: TemplateDefinition[] = [
  creatorProfile, digitalNomad, solanaMaximalist,
  startupAbout, agencyShowcase,
  memeCoinLauncher, tokenDashboard, stealthLaunch,
  nftCollectionHub, pfpGallery, generativeArtDrop,
  daoPortal, communityHub,
  devPortfolio, creatorResume,
  productLaunch, protocolLanding,
  onchainJournal,
];

export const TEMPLATE_METAS: TemplateMeta[] = TEMPLATE_DEFINITIONS_LIST;

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> =
  Object.fromEntries(TEMPLATE_DEFINITIONS_LIST.map((t) => [t.id, t]));

export function getTemplateMeta(id: string): TemplateMeta | undefined {
  return TEMPLATE_DEFINITIONS[id];
}

export function getTemplateDefinition(id: string): TemplateDefinition | undefined {
  return TEMPLATE_DEFINITIONS[id];
}
