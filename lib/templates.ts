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

// =============================================================================
// GALLERY METADATA — your full 18, in priority order.
// Tier 1 (4) are `ready`; the rest are `coming-soon` placeholders.
// =============================================================================
export const TEMPLATE_METAS: TemplateMeta[] = [
  // Tier 1 — built
  creatorProfile,
  memeCoinLauncher,
  nftCollectionHub,
  tokenDashboard,
  // Personal / Creator (2 more)
  meta("digital-nomad", "Digital Nomad", "creator", "Modern personal brand site with bio, links, and gallery.", ["brand", "creator"]),
  meta("solana-maximalist", "Solana Maximalist", "creator", "Bold personal page for heavy Solana ecosystem participants.", ["solana", "creator"]),
  // Team / Company (2)
  meta("startup-about", "Startup About", "company", "Professional team + mission page for Web3 projects.", ["team", "mission"]),
  meta("agency-showcase", "Agency Showcase", "company", "Service-focused team site with portfolio sections.", ["agency", "services"]),
  // Token (1 more)
  meta("stealth-launch", "Stealth Launch", "token", "Mysterious dark-mode token reveal page.", ["stealth", "token"]),
  // NFT (2 more)
  meta("pfp-gallery", "PFP Gallery", "nft", "Stylish profile-picture collection showcase.", ["pfp", "nft"]),
  meta("generative-art-drop", "Generative Art Drop", "nft", "Artistic NFT project template with visual focus.", ["art", "nft"]),
  // DAO / Community (2)
  meta("dao-portal", "DAO Portal", "dao", "Governance-focused community hub with proposals and treasury.", ["dao", "governance"]),
  meta("community-hub", "Community Hub", "dao", "Vibrant Discord-style community landing page.", ["community", "discord"]),
  // Portfolio (2)
  meta("dev-portfolio", "Dev Portfolio", "portfolio", "Developer / builder portfolio with onchain credentials.", ["dev", "portfolio"]),
  meta("creator-resume", "Creator Resume", "portfolio", "Visual resume + past work for freelancers and creators.", ["resume", "portfolio"]),
  // Startup / Product (2)
  meta("product-launch", "Product Launch", "startup", "High-converting SaaS / dApp landing page.", ["saas", "landing"]),
  meta("protocol-landing", "Protocol Landing", "startup", "Technical yet beautiful blockchain protocol homepage.", ["protocol", "landing"]),
  // Blog (1)
  meta("onchain-journal", "Onchain Journal", "blog", "Minimalist blog / newsletter site for long-form content.", ["blog", "content"]),
];

/** Fully-built template definitions, keyed by id. */
export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  [creatorProfile.id]: creatorProfile,
  [memeCoinLauncher.id]: memeCoinLauncher,
  [tokenDashboard.id]: tokenDashboard,
  [nftCollectionHub.id]: nftCollectionHub,
};

export function getTemplateMeta(id: string): TemplateMeta | undefined {
  return TEMPLATE_METAS.find((t) => t.id === id);
}

export function getTemplateDefinition(id: string): TemplateDefinition | undefined {
  return TEMPLATE_DEFINITIONS[id];
}

function meta(
  id: string,
  name: string,
  category: TemplateMeta["category"],
  description: string,
  tags: string[],
): TemplateMeta {
  return {
    id, name, category, description, tags,
    thumbnail: `/templates/${id}.png`,
    accentColor: IQ_THEME.primary,
    status: "coming-soon",
  };
}
