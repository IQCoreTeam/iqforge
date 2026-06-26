// lib/types.ts
// Core type system for IQForge.
//
// Design principle: templates are DATA, not bespoke editors. A template declares
// a list of editable `fields`. The Customizer renders a generic form from those
// fields, and the template's React component renders from the resulting `content`
// object. One Customizer + one publish pipeline serves all 18 templates.

export type TemplateCategory =
  | "creator"
  | "company"
  | "token"
  | "nft"
  | "dao"
  | "portfolio"
  | "startup"
  | "blog";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  creator: "Personal / Creator",
  company: "Team / Company",
  token: "Token / Meme Coin",
  nft: "NFT Project",
  dao: "DAO / Community",
  portfolio: "Portfolio / Resume",
  startup: "Startup / Product",
  blog: "Blog / Content",
};

/** Editable field primitives the Customizer knows how to render. */
export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "color"
  | "url"
  | "list";

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  /** Visual grouping in the form sidebar, e.g. "Hero", "About", "Links". */
  group?: string;
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  /** For `type: "list"` — the shape of each repeatable item. */
  itemFields?: TemplateField[];
  /** Default value used when a user adds a new list item. */
  defaultItem?: Record<string, unknown>;
}

/** Theme tokens are user-overridable per site; defaults come from the template. */
export interface ThemeTokens {
  primary: string; // neon-green accent by default
  background: string; // near-black by default
  foreground: string; // text
  muted: string; // secondary text / borders
}

export const IQ_THEME: ThemeTokens = {
  primary: "#3DFE7E", // IQLabs neon green
  background: "#08090A", // near-black
  foreground: "#F4FFF7",
  muted: "#8A938C",
};

/** Lightweight info shown in the gallery (no field schema needed to list it). */
export interface TemplateMeta {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  thumbnail: string; // path or data URL
  accentColor: string;
  status: "ready" | "coming-soon";
}

/** A fully customizable template: meta + field schema + sensible defaults. */
export interface TemplateDefinition extends TemplateMeta {
  status: "ready";
  fields: TemplateField[];
  defaultContent: SiteContent;
  defaultTheme: ThemeTokens;
}

/** Free-form bag of values keyed by `TemplateField.key`. */
export type SiteContent = Record<string, unknown>;

// --- Sites & publishing -----------------------------------------------------

export type PublishStatus =
  | "draft"
  | "publishing"
  | "published"
  | "failed";

/** Where the published site bytes actually live. */
export interface StorageRef {
  provider: "iqlabs" | "ipfs" | "arweave";
  /** IQLabs onchain account/content pointer (or CID for fallbacks). */
  pointer: string;
  /** Tx that wrote it (for IQLabs / Arweave). */
  txSignature?: string;
}

/** Which editor produced this site. */
export type SiteBuilder = "template" | "puck";

export interface Site {
  id: string;
  ownerWallet: string;
  /** "template" (schema-driven, default) or "puck" (visual drag-and-drop). */
  builder?: SiteBuilder;
  /** Template id for builder === "template"; "puck" for visual-builder sites. */
  templateId: string;
  title: string;
  content: SiteContent;
  /** Puck editor `Data` (serializable JSON) — present when builder === "puck". */
  puckData?: unknown;
  theme: ThemeTokens;
  /** Attached SNS domain, e.g. "alice.sol". */
  domain?: string;
  storage?: StorageRef;
  status: PublishStatus;
  createdAt: number;
  updatedAt: number;
}

/** Props every template render component receives. */
export interface TemplateRenderProps {
  content: SiteContent;
  theme: ThemeTokens;
  /** True when rendered inside the live-preview pane (disables real links). */
  preview?: boolean;
}
