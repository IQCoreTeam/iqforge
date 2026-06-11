// components/templates/startup-about.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Member { name: string; role: string; photo: string }
interface Value { title: string; detail: string }
interface LinkItem { label: string; url: string }

export function StartupAbout({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    company?: string; mission?: string; logo?: string; story?: string;
    team?: Member[]; values?: Value[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="text-center">
          {c.logo && (
            <div className="mx-auto mb-6 h-16 w-16 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.company} className="h-full w-full object-cover" />
            </div>
          )}
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>{c.company || "Company"}</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            {c.mission || "Our mission statement goes here."}
          </h1>
        </header>

        {c.story && (
          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed" style={{ color: theme.muted }}>
            {c.story}
          </p>
        )}

        {!!c.values?.length && (
          <section className="mt-16 grid gap-4 sm:grid-cols-3">
            {c.values.map((v, i) => (
              <div key={i} className="rounded-xl border p-5" style={{ borderColor: `${accent}26` }}>
                <span className="font-mono text-xs" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm" style={{ color: theme.muted }}>{v.detail}</p>
              </div>
            ))}
          </section>
        )}

        {!!c.team?.length && (
          <section className="mt-16">
            <h2 className="text-center font-display text-2xl font-bold">The team</h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {c.team.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full" style={{ background: `${accent}14`, boxShadow: `0 0 0 2px ${accent}40` }}>
                    {m.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold">{m.name}</p>
                  <p className="font-mono text-xs" style={{ color: theme.muted }}>{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-16 flex justify-center gap-3">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-full border px-5 py-2 text-sm" style={{ borderColor: `${accent}55` }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
