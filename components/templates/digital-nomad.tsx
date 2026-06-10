// components/templates/digital-nomad.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Photo { image: string; caption: string }
interface LinkItem { label: string; url: string }

export function DigitalNomad({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    name?: string; location?: string; bio?: string; avatar?: string;
    photos?: Photo[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* hero: avatar beside name */}
        <header className="flex items-center gap-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl" style={{ boxShadow: `0 0 0 2px ${accent}66` }}>
            {c.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl" style={{ background: `${accent}14` }}>🌍</div>
            )}
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold">{c.name || "Your Name"}</h1>
            {c.location && (
              <p className="mt-1 font-mono text-sm" style={{ color: accent }}>📍 {c.location}</p>
            )}
          </div>
        </header>

        {c.bio && (
          <p className="mt-8 max-w-xl text-lg leading-relaxed" style={{ color: theme.muted }}>{c.bio}</p>
        )}

        {/* photo gallery — staggered grid */}
        {!!c.photos?.length && (
          <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {c.photos.map((p, i) => (
              <figure key={i} className={`overflow-hidden rounded-xl ${i % 3 === 1 ? "sm:translate-y-6" : ""}`}>
                <div className="aspect-[3/4]" style={{ background: `${accent}10` }}>
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.caption} className="h-full w-full object-cover transition-transform hover:scale-105" />
                  )}
                </div>
                {p.caption && (
                  <figcaption className="px-1 py-2 font-mono text-xs" style={{ color: theme.muted }}>{p.caption}</figcaption>
                )}
              </figure>
            ))}
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-16 flex flex-wrap gap-3">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-full border px-5 py-2 text-sm transition-colors"
                style={{ borderColor: `${accent}55` }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
