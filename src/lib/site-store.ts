// Local persistence for "My Sites". MVP storage = localStorage, scoped per
// wallet. Swap this module for an on-chain index (codeIn + updateUserMetadata)
// later without touching the UI — the function surface stays the same.

import type { Site } from "./types";
import { getTemplate } from "./templates/registry";

const KEY = "iqforge:sites";

function readAll(): Site[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Site[];
  } catch {
    return [];
  }
}

function writeAll(sites: Site[]): void {
  localStorage.setItem(KEY, JSON.stringify(sites));
}

/** Sites owned by a wallet, newest first. */
export function listSites(owner: string): Site[] {
  return readAll()
    .filter((s) => s.owner === owner)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSite(id: string): Site | undefined {
  return readAll().find((s) => s.id === id);
}

export function saveSite(site: Site): void {
  const all = readAll();
  const i = all.findIndex((s) => s.id === site.id);
  const next = { ...site, updatedAt: Date.now() };
  if (i >= 0) all[i] = next;
  else all.push(next);
  writeAll(all);
}

export function deleteSite(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

/** Create a fresh draft Site from a template, owned by the connected wallet. */
export function newSiteFromTemplate(templateId: string, owner: string): Site {
  const tpl = getTemplate(templateId);
  if (!tpl) throw new Error(`unknown template: ${templateId}`);
  const now = Date.now();
  return {
    id: `site_${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    owner,
    name: tpl.defaultContent.title || tpl.name,
    templateId: tpl.id,
    archetype: tpl.archetype,
    theme: { ...tpl.defaultTheme },
    content: structuredClone(tpl.defaultContent),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}
