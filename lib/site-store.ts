// lib/site-store.ts
//
// Local draft persistence for the MVP. Drafts live in the browser until the
// user publishes; published sites ultimately live onchain (indexed to the
// wallet via IQLabs). When the IQLabs read path is wired, `listSites` can merge
// onchain records in here — the rest of the app won't need to change.

import type { Site, SiteContent, TemplateDefinition, ThemeTokens } from "./types";

const KEY = "iqforge:sites";

function readAll(): Site[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Site[];
  } catch {
    return [];
  }
}

function writeAll(sites: Site[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sites));
  } catch {
    // Almost always QuotaExceededError — drafts with several images can hit
    // the ~5MB localStorage cap.
    throw new Error(
      "Your browser's local storage is full. Remove an image or two from this site (or delete an old draft) and try again.",
    );
  }
}

/** Sites owned by a wallet, newest first. */
export function listSites(wallet: string): Site[] {
  return readAll()
    .filter((s) => s.ownerWallet === wallet)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSite(id: string): Site | undefined {
  return readAll().find((s) => s.id === id);
}

/** Insert or update by id. */
export function saveSite(site: Site): Site {
  const next = { ...site, updatedAt: Date.now() };
  const all = readAll().filter((s) => s.id !== site.id);
  writeAll([next, ...all]);
  return next;
}

export function deleteSite(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

/** Build a fresh draft Site from a template + the customizer's output. */
export function newSiteFromTemplate(
  template: TemplateDefinition,
  wallet: string,
  content: SiteContent,
  theme: ThemeTokens,
): Site {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    ownerWallet: wallet,
    templateId: template.id,
    title: template.name,
    content,
    theme,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}
