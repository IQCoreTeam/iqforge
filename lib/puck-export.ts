// lib/puck-export.ts
//
// Renders Puck editor `Data` to a single self-contained index.html via Puck's
// <Render> component + react-dom/server. Unlike lib/export-html.ts (template
// path), the output needs NO Tailwind CDN: every block in lib/puck-config.tsx
// styles itself with inline styles, so the published page is fully eternal.
//
// This is the input format of the real publish pipeline — publishToIQLabs()
// feeds exactly this string to the git-sdk commit as index.html.

import { createElement } from "react";
import type { Data } from "@measured/puck";
import { iqPuckConfig } from "./puck-config";
import { IQ_THEME } from "./types";

export async function exportPuckHtml(data: Data, title: string): Promise<string> {
  // Dynamic import: react-dom/server and Puck's Render can't be imported at
  // module top level in Next.js client bundles, but load fine on demand.
  const [{ renderToStaticMarkup }, { Render }] = await Promise.all([
    import("react-dom/server"),
    import("@measured/puck"),
  ]);

  const body = renderToStaticMarkup(
    createElement(Render, { config: iqPuckConfig, data }),
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Geist:wght@300;400;500;600;700&display=swap" />
<style>
  html, body { margin: 0; min-height: 100%; background: ${IQ_THEME.background}; }
  body { font-family: "Geist", system-ui, sans-serif; }
  * { box-sizing: border-box; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
