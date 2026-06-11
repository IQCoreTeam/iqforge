// components/templates/protocol-landing.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Metric { label: string; value: string }
interface Step { title: string; detail: string }
interface LinkItem { label: string; url: string }

export function ProtocolLanding({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    protocol?: string; oneLiner?: string; description?: string;
    metrics?: Metric[]; steps?: Step[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: `linear-gradient(${accent}14 1px, transparent 1px), linear-gradient(90deg, ${accent}14 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-16">
        <header>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            {c.protocol || "Protocol"}<span style={{ color: accent }}>_</span>
          </h1>
          {c.oneLiner && <p className="mt-3 max-w-xl text-xl font-medium">{c.oneLiner}</p>}
          {c.description && <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: theme.muted }}>{c.description}</p>}
        </header>

        {!!c.metrics?.length && (
          <section className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-y py-6" style={{ borderColor: `${accent}26` }}>
            {c.metrics.map((m, i) => (
              <div key={i}>
                <div className="font-mono text-2xl font-bold" style={{ color: accent }}>{m.value}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: theme.muted }}>{m.label}</div>
              </div>
            ))}
          </section>
        )}

        {!!c.steps?.length && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: theme.muted }}>How it works</h2>
            <div className="mt-5 space-y-0">
              {c.steps.map((s, i) => (
                <div key={i} className="flex gap-5 border-l py-4 pl-6" style={{ borderColor: i === 0 ? accent : `${accent}33` }}>
                  <span className="font-mono text-sm font-bold" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    {s.detail && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{s.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-12 flex flex-wrap gap-3">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className={`rounded-lg px-5 py-2.5 text-sm font-medium ${i === 0 ? "" : "border"}`}
                style={i === 0 ? { background: accent, color: theme.background } : { borderColor: `${accent}44` }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
