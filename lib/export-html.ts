// lib/export-html.ts
//
// Renders a Site to a single SELF-CONTAINED index.html — the canonical publish
// format. The compiled template stylesheet (lib/template-css.ts) is embedded,
// so the page has zero runtime dependencies: it renders correctly forever,
// from any gateway, with no CDN. Web fonts are progressive enhancement only —
// if the font hosts ever vanish, system fallbacks keep the page intact.
//
// This output is exactly what publishToIQLabs() writes on-chain under a
// manifest, and what "Download HTML backup" hands the user.

import { createElement } from "react";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { TEMPLATE_CSS } from "./template-css";
import type { Site } from "./types";

export async function exportSiteHtml(site: Site): Promise<string> {
  const Component = TEMPLATE_COMPONENTS[site.templateId];
  if (!Component) throw new Error(`No renderer for template "${site.templateId}"`);

  // Dynamic import: react-dom/server can't sit at module top level in Next.js
  // client bundles, but loads fine on demand.
  const { renderToStaticMarkup } = await import("react-dom/server");
  const body = renderToStaticMarkup(
    createElement(Component, { content: site.content, theme: site.theme, preview: false }),
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(site.title)}</title>
<style>${TEMPLATE_CSS}</style>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Geist:wght@300;400;500;600&display=swap" />
<style>html, body { min-height: 100%; background: ${site.theme.background}; }</style>
</head>
<body>
${body}
</body>
</html>`;
}

/** Trigger a browser download of the exported site. */
export async function downloadSiteHtml(site: Site): Promise<void> {
  const html = await exportSiteHtml(site);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${site.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
