"use client";

import * as React from "react";
import type { Site } from "@/lib/types";
import { renderSiteHtml } from "@/lib/render-html";

/** Renders the exact published HTML in a sandboxed iframe. Same renderer as publish. */
export function LivePreview({ site }: { site: Site }) {
  const html = React.useMemo(() => renderSiteHtml(site), [site]);
  return (
    <iframe
      title="Live preview"
      className="h-full w-full rounded-xl border border-border bg-black"
      sandbox="allow-same-origin"
      srcDoc={html}
    />
  );
}
