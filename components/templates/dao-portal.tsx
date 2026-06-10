// components/templates/dao-portal.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Stat { label: string; value: string }
interface Proposal { title: string; status: string }
interface LinkItem { label: string; url: string }

export function DaoPortal({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    dao?: string; mission?: string; logo?: string; joinUrl?: string;
    stats?: Stat[]; proposals?: Proposal[]; links?: LinkItem[];
  };
  const accent = theme.primary;
  const statusColor = (s: string) =>
    /pass|active|live/i.test(s) ? accent : /fail|reject/i.test(s) ? "#FF5C5C" : theme.muted;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-xl" style={{ background: `${accent}14`, boxShadow: `0 0 0 1px ${accent}40` }}>
            {c.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logo} alt={c.dao} className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{c.dao || "DAO"}</h1>
            {c.mission && <p className="text-sm" style={{ color: theme.muted }}>{c.mission}</p>}
          </div>
          {c.joinUrl && (
            <a href={preview ? undefined : c.joinUrl} onClick={(e) => preview && e.preventDefault()}
              target={preview ? undefined : "_blank"} rel="noreferrer"
              className="ml-auto rounded-lg px-5 py-2.5 text-sm font-bold" style={{ background: accent, color: theme.background }}>
              Join
            </a>
          )}
        </header>

        {!!c.stats?.length && (
          <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {c.stats.map((s, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ borderColor: `${accent}26`, background: `${accent}07` }}>
                <div className="font-display text-xl font-bold" style={{ color: accent }}>{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: theme.muted }}>{s.label}</div>
              </div>
            ))}
          </section>
        )}

        {!!c.proposals?.length && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Proposals</h2>
            <div className="mt-4 space-y-2">
              {c.proposals.map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border px-4 py-3"
                  style={{ borderColor: `${accent}1f` }}>
                  <span className="text-sm font-medium">{p.title}</span>
                  <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase"
                    style={{ borderColor: `${statusColor(p.status)}55`, color: statusColor(p.status) }}>
                    {p.status}
                  </span>
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
                className="rounded-full border px-4 py-1.5 text-sm" style={{ borderColor: `${accent}40` }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
