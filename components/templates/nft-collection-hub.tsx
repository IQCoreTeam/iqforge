// components/templates/nft-collection-hub.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface GalleryItem { image: string; name: string }
interface RoadItem { title: string; detail: string }
interface Social { label: string; url: string }

export function NftCollectionHub({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    collectionName?: string; tagline?: string; heroImage?: string;
    mintPrice?: string; totalSupply?: string; minted?: string; mintUrl?: string;
    about?: string; gallery?: GalleryItem[]; roadmap?: RoadItem[]; socials?: Social[];
  };
  const accent = theme.primary;
  const pct = Math.min(100, Math.round((Number(c.minted) / Number(c.totalSupply)) * 100) || 0);

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full">
      {/* hero */}
      <header className="relative overflow-hidden px-6 pt-16 pb-12">
        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 70% 10%, ${accent}22, transparent 55%)` }} />
        <div className="relative z-10 mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-2">
          <div className="text-left">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">{c.collectionName || "Collection"}</h1>
            {c.tagline && <p className="mt-4 text-base leading-relaxed" style={{ color: theme.muted }}>{c.tagline}</p>}
            {/* mint panel */}
            <div className="mt-7 rounded-2xl border p-5" style={{ borderColor: `${accent}33`, background: `${accent}0A` }}>
              <div className="flex justify-between font-mono text-sm" style={{ color: theme.muted }}>
                <span>{c.minted || "0"} / {c.totalSupply || "0"} minted</span>
                <span style={{ color: accent }}>{c.mintPrice}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: `${accent}1A` }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
              </div>
              <a href={preview ? undefined : c.mintUrl} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="mt-4 block rounded-xl py-3 text-center font-bold transition-transform hover:-translate-y-0.5"
                style={{ background: accent, color: theme.background }}>
                Mint now
              </a>
            </div>
          </div>
          <div className="aspect-square overflow-hidden rounded-3xl" style={{ boxShadow: `0 0 0 2px ${accent}55, 0 0 50px ${accent}33` }}>
            {c.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.heroImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl" style={{ background: `${accent}14` }}>🖼️</div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-20">
        {c.about && <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed" style={{ color: theme.muted }}>{c.about}</p>}

        {/* gallery */}
        {!!c.gallery?.length && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">Gallery</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {c.gallery.map((g, i) => (
                <div key={i} className="overflow-hidden rounded-xl border" style={{ borderColor: `${accent}25` }}>
                  <div className="aspect-square" style={{ background: `${accent}10` }}>
                    {g.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={g.image} alt={g.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="px-2 py-1.5 font-mono text-xs" style={{ color: theme.muted }}>{g.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* roadmap */}
        {!!c.roadmap?.length && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">Roadmap</h2>
            <div className="mt-5 space-y-3">
              {c.roadmap.map((r, i) => (
                <div key={i} className="flex gap-4 rounded-xl border p-4" style={{ borderColor: `${accent}25` }}>
                  <span className="font-mono text-lg font-bold" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold">{r.title}</h3>
                    {r.detail && <p className="text-sm" style={{ color: theme.muted }}>{r.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!c.socials?.length && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {c.socials.map((s, i) => (
              <a key={i} href={preview ? undefined : s.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-full border px-5 py-2 text-sm font-medium" style={{ borderColor: `${accent}40` }}>
                {s.label}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
