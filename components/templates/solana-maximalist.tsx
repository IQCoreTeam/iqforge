// components/templates/solana-maximalist.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Stat { label: string; value: string }
interface LinkItem { label: string; url: string }

export function SolanaMaximalist({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    name?: string; headline?: string; avatar?: string; manifesto?: string;
    stats?: Stat[]; links?: LinkItem[];
  };
  const accent = theme.primary;
  const SOLANA_PURPLE = "#9945FF";

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${SOLANA_PURPLE}26 0%, transparent 40%, ${accent}1f 100%)` }} />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-full"
          style={{ background: `linear-gradient(135deg, ${SOLANA_PURPLE}, ${accent})`, padding: 3 }}>
          <div className="h-full w-full overflow-hidden rounded-full" style={{ background: theme.background }}>
            {c.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">◎</div>
            )}
          </div>
        </div>

        <h1 className="font-display text-5xl font-bold uppercase tracking-tight"
          style={{ backgroundImage: `linear-gradient(90deg, ${SOLANA_PURPLE}, ${accent})`, WebkitBackgroundClip: "text", color: "transparent" }}>
          {c.name || "Your Name"}
        </h1>
        {c.headline && <p className="mt-3 font-mono text-sm uppercase tracking-widest" style={{ color: accent }}>{c.headline}</p>}

        {!!c.stats?.length && (
          <div className="mt-10 grid grid-cols-3 gap-3">
            {c.stats.map((s, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ borderColor: `${accent}33`, background: `${accent}0A` }}>
                <div className="font-display text-2xl font-bold" style={{ color: accent }}>{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: theme.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {c.manifesto && (
          <p className="mx-auto mt-10 max-w-md whitespace-pre-wrap text-base leading-relaxed" style={{ color: theme.muted }}>
            {c.manifesto}
          </p>
        )}

        {!!c.links?.length && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-lg px-5 py-2.5 text-sm font-bold"
                style={{ background: `linear-gradient(90deg, ${SOLANA_PURPLE}, ${accent})`, color: theme.background }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
        <p className="mt-16 font-mono text-[10px] uppercase tracking-widest" style={{ color: theme.muted }}>only possible on solana</p>
      </main>
    </div>
  );
}
