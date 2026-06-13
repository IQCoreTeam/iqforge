// Field schema per archetype. The customizer's ContentForm renders itself from
// this — one form, every template. Add a field here and it appears in the editor
// for that archetype with no component changes.

import type { Archetype, FieldSpec, ListSpec } from "../types";

const SCALAR: Record<Archetype, FieldSpec[]> = {
  spotlight: [
    { key: "tagline", label: "Eyebrow", kind: "text", placeholder: "creator · builder · degen" },
    { key: "title", label: "Display name", kind: "text" },
    { key: "bio", label: "Bio", kind: "textarea", help: "A line or two about you." },
    { key: "avatar", label: "Avatar", kind: "image" },
    { key: "footer", label: "Footer note", kind: "text" },
  ],
  cover: [
    { key: "tagline", label: "Eyebrow", kind: "text" },
    { key: "title", label: "Headline", kind: "text" },
    { key: "bio", label: "Sub-headline", kind: "textarea" },
    { key: "heroImage", label: "Hero image", kind: "image" },
    { key: "ctaLabel", label: "Primary button label", kind: "text", placeholder: "Get started" },
    { key: "ctaUrl", label: "Primary button link", kind: "url" },
    { key: "footer", label: "Footer note", kind: "text" },
  ],
  token: [
    { key: "ticker", label: "Ticker", kind: "text", placeholder: "DOGE" },
    { key: "title", label: "Token name", kind: "text" },
    { key: "bio", label: "Pitch", kind: "textarea" },
    { key: "avatar", label: "Token logo", kind: "image" },
    { key: "contract", label: "Contract address", kind: "text" },
    { key: "ctaLabel", label: "Buy button label", kind: "text", placeholder: "Buy on Jupiter" },
    { key: "ctaUrl", label: "Buy link", kind: "url" },
    { key: "footer", label: "Footer note", kind: "text" },
  ],
  gallery: [
    { key: "tagline", label: "Eyebrow", kind: "text" },
    { key: "title", label: "Collection name", kind: "text" },
    { key: "bio", label: "Description", kind: "textarea" },
    { key: "mintInfo", label: "Mint info line", kind: "text", placeholder: "1,000 supply · 0.5 SOL · live now" },
    { key: "ctaLabel", label: "Mint button label", kind: "text", placeholder: "Mint now" },
    { key: "ctaUrl", label: "Mint link", kind: "url" },
    { key: "footer", label: "Footer note", kind: "text" },
  ],
  feed: [
    { key: "tagline", label: "Eyebrow", kind: "text" },
    { key: "title", label: "Site title", kind: "text" },
    { key: "bio", label: "Description", kind: "textarea" },
    { key: "footer", label: "Footer note", kind: "text" },
  ],
};

const LISTS: Record<Archetype, ListSpec[]> = {
  spotlight: [
    { key: "links", label: "Links", addLabel: "Add link", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
    { key: "socials", label: "Socials", addLabel: "Add social", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
  ],
  cover: [
    { key: "features", label: "Features", addLabel: "Add feature", fields: [{ key: "title", label: "Title", kind: "text" }, { key: "body", label: "Body", kind: "textarea" }] },
    { key: "links", label: "Secondary links", addLabel: "Add link", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
    { key: "socials", label: "Socials", addLabel: "Add social", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
  ],
  token: [
    { key: "stats", label: "Stats", addLabel: "Add stat", fields: [{ key: "value", label: "Value", kind: "text" }, { key: "label", label: "Label", kind: "text" }] },
    { key: "roadmap", label: "Roadmap", addLabel: "Add phase", fields: [{ key: "phase", label: "Phase", kind: "text" }, { key: "title", label: "Title", kind: "text" }, { key: "body", label: "Body", kind: "textarea" }] },
    { key: "socials", label: "Socials", addLabel: "Add social", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
  ],
  gallery: [
    { key: "gallery", label: "Gallery", addLabel: "Add image", fields: [{ key: "image", label: "Image", kind: "image" }, { key: "caption", label: "Caption", kind: "text" }] },
    { key: "roadmap", label: "Roadmap", addLabel: "Add phase", fields: [{ key: "phase", label: "Phase", kind: "text" }, { key: "title", label: "Title", kind: "text" }, { key: "body", label: "Body", kind: "textarea" }] },
    { key: "links", label: "Links", addLabel: "Add link", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
    { key: "socials", label: "Socials", addLabel: "Add social", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
  ],
  feed: [
    { key: "posts", label: "Posts", addLabel: "Add post", fields: [{ key: "title", label: "Title", kind: "text" }, { key: "date", label: "Date", kind: "text" }, { key: "excerpt", label: "Excerpt", kind: "textarea" }] },
    { key: "socials", label: "Socials", addLabel: "Add social", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "url", label: "URL", kind: "url" }] },
  ],
};

export function scalarFields(a: Archetype): FieldSpec[] {
  return SCALAR[a];
}
export function listSections(a: Archetype): ListSpec[] {
  return LISTS[a];
}
