// lib/export-html.ts
//
// Renders a Site to a single self-contained index.html. Two purposes:
//   1. "Download my site" — users get a real artifact they own, today.
//   2. This is the input format of the REAL publish pipeline: the gateway
//      serves static files under an on-chain manifest, so the eventual
//      publishToIQLabs() will feed exactly this output to the SDK.
//
// Interim tradeoff (flagged for the owner): templates style themselves with
// Tailwind utility classes, so the export loads Tailwind from a CDN. That
// works everywhere but is an external dependency — not yet "eternal". The
// permanent fix is inlining compiled CSS at export time.

import { createElement } from "react";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import type { Site } from "./types";

export async function exportSiteHtml(site: Site): Promise<string> {
  const Component = TEMPLATE_COMPONENTS[site.templateId];
  if (!Component) throw new Error(`No renderer for template "${site.templateId}"`);

  // Dynamic import: react-dom/server can't be imported at module top level in
  // Next.js client bundles, but works fine when loaded on demand.
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
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Geist:wght@300;400;500;600&display=swap" />
<script src="https://cdn.tailwindcss.com"></script>
<style>
  html, body { margin: 0; min-height: 100%; background: ${site.theme.background}; }
  body { font-family: "Geist", system-ui, sans-serif; }
  .font-display { font-family: "Clash Display", sans-serif; }
  .font-mono { font-family: "JetBrains Mono", ui-monospace, monospace; }
</style>
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
