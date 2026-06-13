// Single source of truth for IQForge data shapes.
// One Site flows through: gallery pick -> customizer edit -> renderer -> publish.

/** Layout families. Each maps to one renderer branch in render-html.ts. */
export type Archetype = "spotlight" | "cover" | "token" | "gallery" | "feed";

/** Gallery grouping shown in the Template Gallery. */
export type Category =
  | "Personal"
  | "Team"
  | "Token"
  | "NFT"
  | "DAO"
  | "Portfolio"
  | "Startup"
  | "Blog";

/** Reusable content rows. Arrays of these are edited via repeatable form rows. */
export interface LinkItem {
  label: string;
  url: string;
}
export interface StatItem {
  label: string;
  value: string;
}
export interface GalleryItem {
  /** Data-URI (preview + publish inline this directly). */
  image: string;
  caption: string;
}
export interface RoadmapItem {
  phase: string;
  title: string;
  body: string;
}
export interface FeatureItem {
  title: string;
  body: string;
}
export interface PostItem {
  title: string;
  date: string;
  excerpt: string;
}

/**
 * Visual theming for the *published* site (not the builder chrome).
 * `background` and image fields are inlined as data-URIs so a published
 * site is one self-contained index.html.
 */
export interface SiteTheme {
  /** Hex accent, seeded from the IQLabs neon-green palette. */
  accent: string;
  /** Page background: hex color, a CSS gradient string, or a data-URI image. */
  background: string;
  /** "dark" | "light" base text/surface treatment. */
  mode: "dark" | "light";
  /** "sans" | "mono" | "serif" — the display face of the published page. */
  font: "sans" | "mono" | "serif";
}

/**
 * All editable content. A flat superset — each archetype consumes the subset
 * it needs (declared by the field schema in templates/registry). One type
 * keeps the form, renderer, and store from drifting apart.
 */
export interface SiteContent {
  // shared
  title: string;
  tagline: string;
  bio: string;
  avatar: string; // data-URI
  heroImage: string; // data-URI
  ctaLabel: string;
  ctaUrl: string;
  links: LinkItem[];
  socials: LinkItem[];

  // token
  ticker: string;
  contract: string;
  stats: StatItem[];

  // gallery / nft
  mintInfo: string;
  gallery: GalleryItem[];

  // structured sections
  features: FeatureItem[];
  roadmap: RoadmapItem[];
  posts: PostItem[];

  // footer
  footer: string;
}

/** A starting point in the gallery. Pure data — no React per template. */
export interface TemplateDef {
  id: string;
  name: string;
  category: Category;
  archetype: Archetype;
  blurb: string;
  /** CSS background used as the gallery thumbnail (no binary assets needed). */
  swatch: string;
  defaultTheme: SiteTheme;
  defaultContent: SiteContent;
}

/** Publish receipt — everything needed to verify/serve the live site. */
export interface PublishInfo {
  /** codeIn signature of index.html. */
  indexSig: string;
  /** codeIn signature of manifest.json — the on-chain path. */
  manifestSig: string;
  /** Value written to the SNS URL record. */
  recordValue: string;
  /** Public viewer URL. */
  viewerUrl: string;
  publishedAt: number;
}

/** A user's site — persisted locally, and the thing that gets published. */
export interface Site {
  id: string;
  owner: string; // wallet base58
  name: string;
  templateId: string;
  archetype: Archetype;
  theme: SiteTheme;
  content: SiteContent;
  /** Attached .sol domain (without trailing dot), if any. */
  domain?: string;
  publish?: PublishInfo;
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

/** Schema row that drives the content form generically (one form, all archetypes). */
export type FieldKind = "text" | "textarea" | "image" | "color" | "url";
export interface FieldSpec {
  key: keyof SiteContent;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  help?: string;
}
/** Repeatable-list section spec (links, stats, gallery, roadmap, posts, features). */
export interface ListSpec {
  key: "links" | "socials" | "stats" | "gallery" | "roadmap" | "posts" | "features";
  label: string;
  addLabel: string;
  fields: { key: string; label: string; kind: FieldKind }[];
}
