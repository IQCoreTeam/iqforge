// The 18 gallery templates. Pure data: each is an archetype + theme + starter
// content. The renderer and customizer never branch per-template — only per
// archetype — so adding a template is just one entry here.

import type { TemplateDef, SiteContent, SiteTheme, Category } from "../types";

const EMPTY: SiteContent = {
  title: "",
  tagline: "",
  bio: "",
  avatar: "",
  heroImage: "",
  ctaLabel: "",
  ctaUrl: "",
  links: [],
  socials: [],
  ticker: "",
  contract: "",
  stats: [],
  mintInfo: "",
  gallery: [],
  features: [],
  roadmap: [],
  posts: [],
  footer: "",
};

const c = (partial: Partial<SiteContent>): SiteContent => ({ ...EMPTY, ...partial });

// Theme presets seeded from the IQLabs neon palette + complements for variety.
const NEON = "#22f56b";
const t = (accent: string, background: string, mode: SiteTheme["mode"], font: SiteTheme["font"]): SiteTheme => ({
  accent,
  background,
  mode,
  font,
});

const GRID_BG = "radial-gradient(60rem 60rem at 75% -10%, rgba(34,245,107,.12), transparent 60%), #070b09";

export const TEMPLATES: TemplateDef[] = [
  // ── Personal / Creator (3) ───────────────────────────────────────────────
  {
    id: "aurora",
    name: "Aurora",
    category: "Personal",
    archetype: "spotlight",
    blurb: "A glowing link-in-bio. Avatar, bio, and a stack of buttons.",
    swatch: "linear-gradient(135deg,#0b1f14,#22f56b33,#0b1f14)",
    defaultTheme: t(NEON, GRID_BG, "dark", "sans"),
    defaultContent: c({
      tagline: "creator · builder",
      title: "Nova Reyes",
      bio: "Designing onchain experiences and writing about the permaweb. Everything I make lives forever.",
      links: [
        { label: "Latest drop", url: "https://" },
        { label: "Newsletter", url: "https://" },
        { label: "Book a call", url: "https://" },
      ],
      socials: [
        { label: "X", url: "https://x.com/" },
        { label: "GitHub", url: "https://github.com/" },
      ],
      footer: "Nova Reyes",
    }),
  },
  {
    id: "terminal",
    name: "Terminal",
    category: "Personal",
    archetype: "spotlight",
    blurb: "Monospace, retro-web. For devs who like it raw.",
    swatch: "linear-gradient(135deg,#04140b,#0a3,#04140b)",
    defaultTheme: t("#a6ff00", "#05100a", "dark", "mono"),
    defaultContent: c({
      tagline: "~/whoami",
      title: "you@onchain:~$",
      bio: "Solana dev. I ship small tools that do one thing well. Currently building on IQLabs.",
      links: [
        { label: "→ projects", url: "https://" },
        { label: "→ resume", url: "https://" },
      ],
      socials: [{ label: "github", url: "https://github.com/" }],
      footer: "compiled & stored on-chain",
    }),
  },
  {
    id: "polaroid",
    name: "Polaroid",
    category: "Personal",
    archetype: "gallery",
    blurb: "A photo wall with a short intro. For artists and photographers.",
    swatch: "linear-gradient(135deg,#1a0b1f,#ff3df0aa,#1a0b1f)",
    defaultTheme: t("#ff3df0", "#0b070d", "dark", "serif"),
    defaultContent: c({
      tagline: "selected work",
      title: "Mara Okonkwo",
      bio: "Visual artist working between film photography and generative onchain art.",
      ctaLabel: "Commission a piece",
      ctaUrl: "https://",
      gallery: [
        { image: "", caption: "Untitled, 2025" },
        { image: "", caption: "Series II" },
        { image: "", caption: "Field notes" },
      ],
      socials: [{ label: "Instagram", url: "https://" }],
      footer: "© Mara Okonkwo",
    }),
  },

  // ── Team / Company About (2) ─────────────────────────────────────────────
  {
    id: "atlas",
    name: "Atlas",
    category: "Team",
    archetype: "cover",
    blurb: "A confident company about-page. Split hero + feature grid.",
    swatch: "linear-gradient(135deg,#06140e,#16f5c733,#06140e)",
    defaultTheme: t("#16f5c7", GRID_BG, "dark", "sans"),
    defaultContent: c({
      tagline: "about us",
      title: "We build the decentralized internet.",
      bio: "A small team shipping infrastructure for fully onchain apps — storage, naming, and the tools between them.",
      ctaLabel: "Work with us",
      ctaUrl: "https://",
      features: [
        { title: "Permanent", body: "Everything we ship is written on-chain and stays there." },
        { title: "Open", body: "Our gateway and SDK are open source. Run your own." },
        { title: "Fast", body: "Parallel uploads and an edge cache keep it snappy." },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "IQLabs Inc.",
    }),
  },
  {
    id: "boardroom",
    name: "Boardroom",
    category: "Team",
    archetype: "cover",
    blurb: "Editorial, serif-led. For studios and agencies.",
    swatch: "linear-gradient(135deg,#14110a,#ffb62733,#14110a)",
    defaultTheme: t("#ffb627", "#0c0a06", "dark", "serif"),
    defaultContent: c({
      tagline: "studio",
      title: "Form follows the chain.",
      bio: "A design studio for Web3 products. We make protocols feel human.",
      ctaLabel: "Start a project",
      ctaUrl: "https://",
      features: [
        { title: "Brand", body: "Identity systems built for onchain-native products." },
        { title: "Product", body: "End-to-end design from wireframe to mainnet." },
        { title: "Story", body: "Narrative and launch strategy that lands." },
      ],
      footer: "Studio — est. 2025",
    }),
  },

  // ── Token / Meme Coin (3) ────────────────────────────────────────────────
  {
    id: "moonshot",
    name: "MoonShot",
    category: "Token",
    archetype: "token",
    blurb: "Big ticker, stats, contract, roadmap. The full launch page.",
    swatch: "linear-gradient(135deg,#04140b,#22f56b66,#04140b)",
    defaultTheme: t(NEON, GRID_BG, "dark", "sans"),
    defaultContent: c({
      ticker: "MOON",
      title: "MoonShot",
      bio: "The community coin that actually does something. Fair launch, locked liquidity, 100% onchain.",
      contract: "So1aNaC0ntractAddre55Goes111111111111111111",
      ctaLabel: "Buy on Jupiter",
      ctaUrl: "https://jup.ag/",
      stats: [
        { value: "$2.4M", label: "Market cap" },
        { value: "8,213", label: "Holders" },
        { value: "100%", label: "LP locked" },
      ],
      roadmap: [
        { phase: "Phase 1", title: "Launch", body: "Fair launch, CEX listings, community raids." },
        { phase: "Phase 2", title: "Utility", body: "Staking and the MoonShot onchain dashboard." },
      ],
      socials: [
        { label: "Telegram", url: "https://t.me/" },
        { label: "X", url: "https://x.com/" },
      ],
      footer: "$MOON — not financial advice",
    }),
  },
  {
    id: "degen",
    name: "Degen",
    category: "Token",
    archetype: "token",
    blurb: "Loud, lime, mono. Maximum meme energy.",
    swatch: "linear-gradient(135deg,#0a1400,#a6ff0066,#0a1400)",
    defaultTheme: t("#a6ff00", "#070d00", "dark", "mono"),
    defaultContent: c({
      ticker: "DEGEN",
      title: "DEGEN",
      bio: "we have no roadmap. we have no utility. we have vibes and they are immutable.",
      contract: "DeGeNc0ntractAddre55Goes1111111111111111111",
      ctaLabel: "ape now",
      ctaUrl: "https://",
      stats: [
        { value: "69K", label: "holders" },
        { value: "∞", label: "ambition" },
      ],
      socials: [{ label: "telegram", url: "https://t.me/" }],
      footer: "$DEGEN",
    }),
  },
  {
    id: "pumpstation",
    name: "PumpStation",
    category: "Token",
    archetype: "token",
    blurb: "Clean teal launch page with tokenomics stats.",
    swatch: "linear-gradient(135deg,#04130f,#16f5c766,#04130f)",
    defaultTheme: t("#16f5c7", GRID_BG, "dark", "sans"),
    defaultContent: c({
      ticker: "PUMP",
      title: "PumpStation",
      bio: "A transparent launch with onchain tokenomics anyone can verify.",
      contract: "PumPc0ntractAddre55Goes11111111111111111111",
      ctaLabel: "Trade now",
      ctaUrl: "https://",
      stats: [
        { value: "1B", label: "Total supply" },
        { value: "5%", label: "Team (vested)" },
        { value: "0%", label: "Tax" },
      ],
      roadmap: [{ phase: "Now", title: "Launch", body: "Live on Solana with locked liquidity." }],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "$PUMP",
    }),
  },

  // ── NFT Project (3) ──────────────────────────────────────────────────────
  {
    id: "mintpass",
    name: "Mintpass",
    category: "NFT",
    archetype: "gallery",
    blurb: "Mint info, preview grid, roadmap. Drop-ready.",
    swatch: "linear-gradient(135deg,#0b0717,#9b5cff66,#0b0717)",
    defaultTheme: t("#9b5cff", "#08060f", "dark", "sans"),
    defaultContent: c({
      tagline: "genesis mint",
      title: "Chain Spirits",
      bio: "1,000 hand-drawn spirits living entirely on Solana. Holders unlock the Spirits onchain world.",
      mintInfo: "1,000 supply · 0.5 SOL · live now",
      ctaLabel: "Mint now",
      ctaUrl: "https://",
      gallery: [
        { image: "", caption: "#001" },
        { image: "", caption: "#420" },
        { image: "", caption: "#777" },
      ],
      roadmap: [
        { phase: "Q1", title: "Mint", body: "Genesis 1,000 goes live." },
        { phase: "Q2", title: "Staking", body: "Stake spirits to earn." },
      ],
      socials: [{ label: "Discord", url: "https://discord.gg/" }],
      footer: "Chain Spirits",
    }),
  },
  {
    id: "pfp-vault",
    name: "PFP Vault",
    category: "NFT",
    archetype: "gallery",
    blurb: "PFP-forward with a tight trait gallery.",
    swatch: "linear-gradient(135deg,#04140b,#22f56b55,#04140b)",
    defaultTheme: t(NEON, GRID_BG, "dark", "mono"),
    defaultContent: c({
      tagline: "10,000 pfps",
      title: "Vault Punks",
      bio: "A fully onchain PFP collection. Your art is stored on-chain, not on someone's S3 bucket.",
      mintInfo: "10,000 supply · whitelist open",
      ctaLabel: "Join whitelist",
      ctaUrl: "https://",
      gallery: [
        { image: "", caption: "rare" },
        { image: "", caption: "epic" },
        { image: "", caption: "legendary" },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "Vault Punks",
    }),
  },
  {
    id: "genesis",
    name: "Genesis",
    category: "NFT",
    archetype: "gallery",
    blurb: "Premium, editorial NFT showcase in serif.",
    swatch: "linear-gradient(135deg,#14110a,#ffb62755,#14110a)",
    defaultTheme: t("#ffb627", "#0b0906", "dark", "serif"),
    defaultContent: c({
      tagline: "1/1 collection",
      title: "Genesis",
      bio: "A curated set of one-of-one works minted and stored permanently on Solana.",
      mintInfo: "12 pieces · auction live",
      ctaLabel: "View auction",
      ctaUrl: "https://",
      gallery: [
        { image: "", caption: "Lot 01" },
        { image: "", caption: "Lot 02" },
        { image: "", caption: "Lot 03" },
      ],
      footer: "Genesis Collection",
    }),
  },

  // ── DAO / Community (2) ──────────────────────────────────────────────────
  {
    id: "assembly",
    name: "Assembly",
    category: "DAO",
    archetype: "cover",
    blurb: "Mission-forward DAO page with pillars + links.",
    swatch: "linear-gradient(135deg,#06140e,#22f56b44,#06140e)",
    defaultTheme: t(NEON, GRID_BG, "dark", "sans"),
    defaultContent: c({
      tagline: "the dao",
      title: "Govern the permaweb together.",
      bio: "An open assembly stewarding onchain public goods. One member, one voice.",
      ctaLabel: "Join the DAO",
      ctaUrl: "https://",
      features: [
        { title: "Propose", body: "Anyone can submit a proposal onchain." },
        { title: "Vote", body: "Transparent, verifiable, immutable." },
        { title: "Fund", body: "Treasury grants for public goods." },
      ],
      socials: [{ label: "Discord", url: "https://discord.gg/" }],
      footer: "The Assembly",
    }),
  },
  {
    id: "commons",
    name: "Commons",
    category: "DAO",
    archetype: "feed",
    blurb: "Community updates feed. Announcements front and center.",
    swatch: "linear-gradient(135deg,#04130f,#16f5c744,#04130f)",
    defaultTheme: t("#16f5c7", "#06100d", "dark", "sans"),
    defaultContent: c({
      tagline: "community",
      title: "The Commons",
      bio: "Updates, proposals, and wins from our onchain community.",
      posts: [
        { title: "Treasury report — May", date: "2025-05-30", excerpt: "Grants funded, runway, and what's next." },
        { title: "New proposal: grants v2", date: "2025-05-18", excerpt: "Streamlining how we fund builders." },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "The Commons",
    }),
  },

  // ── Portfolio / Resume (2) ───────────────────────────────────────────────
  {
    id: "resume",
    name: "Résumé",
    category: "Portfolio",
    archetype: "spotlight",
    blurb: "A clean one-page resume with quick links.",
    swatch: "linear-gradient(135deg,#0a0f0c,#5cc8ff44,#0a0f0c)",
    defaultTheme: t("#5cc8ff", "#070b0e", "dark", "sans"),
    defaultContent: c({
      tagline: "product engineer",
      title: "Jordan Lee",
      bio: "8 years shipping consumer products. Previously at two YC startups. Looking for the next hard problem.",
      links: [
        { label: "Download CV", url: "https://" },
        { label: "Portfolio", url: "https://" },
        { label: "Email me", url: "mailto:" },
      ],
      socials: [{ label: "LinkedIn", url: "https://" }],
      footer: "Jordan Lee",
    }),
  },
  {
    id: "showcase",
    name: "Showcase",
    category: "Portfolio",
    archetype: "gallery",
    blurb: "Project showcase grid for designers & makers.",
    swatch: "linear-gradient(135deg,#0b0717,#9b5cff44,#0b0717)",
    defaultTheme: t("#9b5cff", "#08060f", "dark", "sans"),
    defaultContent: c({
      tagline: "selected projects",
      title: "Sam Rivera",
      bio: "Product designer. A few things I've shipped recently.",
      ctaLabel: "Get in touch",
      ctaUrl: "mailto:",
      gallery: [
        { image: "", caption: "Fintech app" },
        { image: "", caption: "Brand system" },
        { image: "", caption: "Onchain game UI" },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "Sam Rivera",
    }),
  },

  // ── Startup / Product Landing (2) ────────────────────────────────────────
  {
    id: "launchpad",
    name: "Launchpad",
    category: "Startup",
    archetype: "cover",
    blurb: "Product hero + feature trio + CTA. SaaS-grade.",
    swatch: "linear-gradient(135deg,#04140b,#22f56b55,#04140b)",
    defaultTheme: t(NEON, GRID_BG, "dark", "sans"),
    defaultContent: c({
      tagline: "now in beta",
      title: "Ship onchain in minutes.",
      bio: "The fastest way to put your product on the permaweb. No servers, no takedowns, no rent.",
      ctaLabel: "Start free",
      ctaUrl: "https://",
      features: [
        { title: "No backend", body: "Your app lives on-chain. We handle the rest." },
        { title: "Own your domain", body: "Point a .sol name and you're live." },
        { title: "Pay once", body: "Permanent storage, no monthly bill." },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "© 2025",
    }),
  },
  {
    id: "saasly",
    name: "SaaSly",
    category: "Startup",
    archetype: "cover",
    blurb: "Hero image + benefit grid for a product launch.",
    swatch: "linear-gradient(135deg,#06140e,#16f5c755,#06140e)",
    defaultTheme: t("#16f5c7", GRID_BG, "dark", "sans"),
    defaultContent: c({
      tagline: "introducing",
      title: "The tool your team actually keeps.",
      bio: "Plan, track, and ship — without the sprawl. Built for small teams that move fast.",
      ctaLabel: "Try it now",
      ctaUrl: "https://",
      features: [
        { title: "Simple", body: "Onboard in under a minute." },
        { title: "Fast", body: "Keyboard-first, zero lag." },
        { title: "Yours", body: "Export everything, anytime." },
      ],
      footer: "© 2025",
    }),
  },

  // ── Blog / Content (1) ───────────────────────────────────────────────────
  {
    id: "dispatch",
    name: "Dispatch",
    category: "Blog",
    archetype: "feed",
    blurb: "A reading-first blog. Posts as a clean feed.",
    swatch: "linear-gradient(135deg,#0a0f0c,#22f56b44,#0a0f0c)",
    defaultTheme: t(NEON, "#070b09", "dark", "serif"),
    defaultContent: c({
      tagline: "writing",
      title: "Dispatch",
      bio: "Essays on building for the onchain internet.",
      posts: [
        { title: "Why websites should be permanent", date: "2025-06-01", excerpt: "The case against rent-seeking hosting." },
        { title: "A .sol is a hyperlink", date: "2025-05-20", excerpt: "Naming as the missing layer of Web3." },
      ],
      socials: [{ label: "X", url: "https://x.com/" }],
      footer: "Dispatch",
    }),
  },
];

export const CATEGORIES: Category[] = [
  "Personal",
  "Team",
  "Token",
  "NFT",
  "DAO",
  "Portfolio",
  "Startup",
  "Blog",
];

export function getTemplate(id: string): TemplateDef | undefined {
  return TEMPLATES.find((x) => x.id === id);
}
