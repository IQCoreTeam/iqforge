// components/templates/token-dashboard.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Alloc { label: string; value: string }
interface Utility { title: string; detail: string }
interface RoadItem { phase: string; title: string; detail: string }
interface Social { label: string; url: string }

export function TokenDashboard({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    tokenName?: string; ticker?: string; logo?: string; tagline?: string; background?: string;
    totalSupply?: string; about?: string; tokenomics?: Alloc[]; utilities?: Utility[];
    roadmap?: RoadItem[]; socials?: Social[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full">
      <header className="relative overflow-hidden px-6 pt-16 pb-10 text-center">
        {c.background && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.background} alt="" className="h-full w-full object-cover opacity-25" />
          </div>
        )}
        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}22, transparent 55%)` }} />
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-2xl" style={{ boxShadow: `0 0 0 2px ${accent}, 0 0 30px ${accent}55` }}>
            {c.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold" style={{ background: `${accent}1A`, color: accent }}>
                {(c.ticker ?? "$").replace("$", "").charAt(0) || "$"}
              </div>
            )}
          </div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">{c.tokenName || "Token"}</h1>
          <p className="mt-1 font-mono text-lg" style={{ color: accent }}>{c.ticker}</p>
          {c.tagline && <p className="mx-auto mt-4 max-w-md text-base" style={{ color: theme.muted }}>{c.tagline}</p>}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        {c.about && <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed" style={{ color: theme.muted }}>{c.about}</p>}

        {/* tokenomics */}
        {!!c.tokenomics?.length && (
          <section className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-bold">Tokenomics</h2>
              {c.totalSupply && <span className="font-mono text-sm" style={{ color: theme.muted }}>Supply: {c.totalSupply}</span>}
            </div>
            <div className="mt-5 space-y-3">
              {c.tokenomics.map((a, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm">
                    <span>{a.label}</span>
                    <span className="font-mono" style={{ color: accent }}>{a.value}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full" style={{ background: `${accent}1A` }}>
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, Number(a.value) || 0)}%`, background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* utility */}
        {!!c.utilities?.length && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Utility</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {c.utilities.map((u, i) => (
                <div key={i} className="rounded-xl border p-5" style={{ borderColor: `${accent}25`, background: `${accent}08` }}>
                  <h3 className="font-semibold" style={{ color: accent }}>{u.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: theme.muted }}>{u.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* roadmap */}
        {!!c.roadmap?.length && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold">Roadmap</h2>
            <div className="mt-5 space-y-3">
              {c.roadmap.map((r, i) => (
                <div key={i} className="flex gap-4 rounded-xl border p-4" style={{ borderColor: `${accent}25` }}>
                  <span className="shrink-0 font-mono text-sm font-bold" style={{ color: accent }}>{r.phase}</span>
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
