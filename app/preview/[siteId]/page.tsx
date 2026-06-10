// app/preview/[siteId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { getSite } from "@/lib/site-store";
import { gatewaySiteUrl } from "@/lib/gateway";
import { isMockPointer } from "@/lib/iqlabs";
import type { Site } from "@/lib/types";

export default function PreviewPage() {
  const { siteId } = useParams<{ siteId: string }>();
  // Load in an effect: localStorage isn't available during server render.
  const [site, setSite] = useState<Site | null | undefined>(undefined);

  useEffect(() => {
    setSite(getSite(siteId) ?? null);
  }, [siteId]);

  if (site === undefined) return null; // loading
  if (site === null) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Site not found</h1>
        <Link href="/dashboard" className="mt-4 inline-block text-primary">← Back to My Sites</Link>
      </div>
    );
  }

  const Render = TEMPLATE_COMPONENTS[site.templateId];
  const liveUrl =
    site.storage && !isMockPointer(site.storage.pointer)
      ? gatewaySiteUrl(site.storage.pointer)
      : null;

  return (
    <div className="relative">
      {/* floating bar */}
      <div className="sticky top-16 z-40 mx-auto flex w-fit items-center gap-4 rounded-full border border-border bg-background/90 px-5 py-2 text-sm backdrop-blur">
        <span className="font-medium">{site.title}</span>
        <span className="text-muted-foreground">·</span>
        <Link href={`/build/${site.templateId}?site=${site.id}`} className="text-primary">Edit</Link>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="text-primary">
            Live on gateway ↗
          </a>
        )}
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Close</Link>
      </div>

      <div className="min-h-screen">
        {Render ? (
          <Render content={site.content} theme={site.theme} preview />
        ) : (
          <p className="p-10 text-center text-muted-foreground">
            No renderer for template “{site.templateId}”.
          </p>
        )}
      </div>
    </div>
  );
}
