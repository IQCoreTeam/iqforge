// app/templates/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TEMPLATE_METAS } from "@/lib/templates";
import {
  CATEGORY_LABELS,
  type TemplateCategory,
  type TemplateMeta,
} from "@/lib/types";

const FILTERS: ("all" | TemplateCategory)[] = [
  "all",
  "creator",
  "company",
  "token",
  "nft",
  "dao",
  "portfolio",
  "startup",
  "blog",
];

export default function TemplateGalleryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const templates = useMemo(
    () => (filter === "all" ? TEMPLATE_METAS : TEMPLATE_METAS.filter((t) => t.category === filter)),
    [filter],
  );

  const readyCount = TEMPLATE_METAS.filter((t) => t.status === "ready").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">
          IQForge · Template Gallery
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Pick a starting point
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Beautiful, pre-built templates you can make yours in minutes. Customize text, images, and colors — then publish permanently onchain. All {readyCount} live.
        </p>
      </header>

      {/* filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateMeta }) {
  const ready = template.status === "ready";

  const card = (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all ${
        ready ? "border-border hover:border-primary/60 hover:glow" : "border-border/60 opacity-70"
      }`}
    >
      {/* thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${template.accentColor}26, transparent 55%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-display text-5xl font-bold text-foreground/10">
          {template.name.charAt(0)}
        </div>
        {ready ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Live
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Soon
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">{template.name}</h3>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABELS[template.category]}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {template.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {template.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          <span className={`text-sm font-medium ${ready ? "text-primary" : "text-muted-foreground"}`}>
            {ready ? "Customize →" : "Coming soon"}
          </span>
        </div>
      </div>
    </div>
  );

  return ready ? <Link href={`/build/${template.id}`}>{card}</Link> : <div>{card}</div>;
}
