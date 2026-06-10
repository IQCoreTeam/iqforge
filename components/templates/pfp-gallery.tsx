// components/templates/pfp-gallery.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Pfp { image: string; name: string }
interface LinkItem { label: string; url: string }

export function PfpGallery({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    collection?: string; tagline?: string; supply?: string; holders?: string;
    pfps?: Pfp[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="font-display text-5xl font-bold">{c.collection || "Collection"}</h1>
        {c.tagline && <p className="mx-auto mt-3 max-w-md" style={{ color: theme.muted }}>{c.tagline}</p>}
        <div className="mt-5 flex justify-center gap-6 font-mono text-sm">
          {c.supply && <span><b style={{ color: accent }}>{c.supply}</b> <span style={{ color: theme.muted }}>supply</span></span>}
          {c.holders && <span><b style={{ color: accent }}>{c.holders}</b> <span style={{ color: theme.muted }}>holders</span></span>}
        </div>

        {!!c.pfps?.length && (
          <section className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {c.pfps.map((p, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl"
                style={{ background: `${accent}12`, boxShadow: `inset 0 0 0 1px ${accent}26` }}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                )}
                {p.name && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-5 text-left font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-12 flex flex-wrap justify-center gap-3">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-full px-5 py-2 text-sm font-bold" style={{ background: accent, color: theme.background }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
