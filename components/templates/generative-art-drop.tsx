// components/templates/generative-art-drop.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Piece { image: string; title: string }

export function GenerativeArtDrop({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    series?: string; artist?: string; statement?: string; hero?: string;
    mintInfo?: string; mintUrl?: string; pieces?: Piece[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* hero artwork dominates */}
        <div className="overflow-hidden rounded-2xl" style={{ boxShadow: `0 30px 80px ${accent}1f` }}>
          <div className="aspect-square sm:aspect-[4/3]" style={{ background: `${accent}0d` }}>
            {c.hero ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.hero} alt={c.series} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">✳</div>
            )}
          </div>
        </div>

        <header className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-4xl font-bold">{c.series || "Untitled Series"}</h1>
          {c.artist && <p className="font-mono text-sm" style={{ color: accent }}>by {c.artist}</p>}
        </header>

        {c.statement && (
          <p className="mt-6 max-w-xl whitespace-pre-wrap text-base leading-loose" style={{ color: theme.muted }}>
            {c.statement}
          </p>
        )}

        {(c.mintInfo || c.mintUrl) && (
          <div className="mt-8 flex items-center gap-5">
            {c.mintUrl && (
              <a href={preview ? undefined : c.mintUrl} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-lg px-6 py-3 font-bold" style={{ background: accent, color: theme.background }}>
                Collect
              </a>
            )}
            {c.mintInfo && <span className="font-mono text-sm" style={{ color: theme.muted }}>{c.mintInfo}</span>}
          </div>
        )}

        {!!c.pieces?.length && (
          <section className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {c.pieces.map((p, i) => (
              <figure key={i}>
                <div className="aspect-square overflow-hidden rounded-lg" style={{ background: `${accent}0d` }}>
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  )}
                </div>
                {p.title && <figcaption className="mt-2 font-mono text-xs" style={{ color: theme.muted }}>{p.title}</figcaption>}
              </figure>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
