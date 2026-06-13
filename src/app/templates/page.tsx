"use client";

import * as React from "react";
import { SiteHeader } from "@/components/site-header";
import { TemplateCard } from "@/components/template-card";
import { TEMPLATES, CATEGORIES } from "@/lib/templates";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const [filter, setFilter] = React.useState<Category | "All">("All");
  const shown = filter === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <>
      <SiteHeader />
      <main className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="mt-2 text-muted-foreground">Pick a starting point. Everything is editable, and nothing is permanent until you publish.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                filter === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </main>
    </>
  );
}
