// components/templates/dev-portfolio.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Project { name: string; detail: string; url: string; tech: string }
interface LinkItem { label: string; url: string }

export function DevPortfolio({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    name?: string; role?: string; about?: string; wallet?: string; skills?: { skill: string }[];
    projects?: Project[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full font-mono">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <header>
          <p className="text-sm" style={{ color: accent }}>~/{(c.name || "dev").toLowerCase().replace(/\s+/g, "-")}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{c.name || "Developer"}</h1>
          {c.role && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{c.role}</p>}
          {c.wallet && (
            <p className="mt-4 inline-block break-all rounded border px-3 py-1.5 text-xs"
              style={{ borderColor: `${accent}33`, color: theme.muted }}>
              <span style={{ color: accent }}>onchain:</span> {c.wallet}
            </p>
          )}
        </header>

        {c.about && <p className="mt-8 text-sm leading-relaxed" style={{ color: theme.muted }}>{c.about}</p>}

        {!!c.skills?.length && (
          <div className="mt-8 flex flex-wrap gap-2">
            {c.skills.map((s, i) => (
              <span key={i} className="rounded px-2.5 py-1 text-xs" style={{ background: `${accent}14`, color: accent }}>
                {s.skill}
              </span>
            ))}
          </div>
        )}

        {!!c.projects?.length && (
          <section className="mt-12">
            <h2 className="text-sm uppercase tracking-widest" style={{ color: theme.muted }}>// projects</h2>
            <div className="mt-4 space-y-4">
              {c.projects.map((p, i) => (
                <a key={i} href={preview ? undefined : p.url || undefined} onClick={(e) => preview && e.preventDefault()}
                  target={preview ? undefined : "_blank"} rel="noreferrer"
                  className="block rounded-lg border p-4 transition-colors hover:border-current"
                  style={{ borderColor: `${accent}26` }}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold" style={{ color: accent }}>{p.name}</h3>
                    {p.tech && <span className="shrink-0 text-[10px]" style={{ color: theme.muted }}>{p.tech}</span>}
                  </div>
                  {p.detail && <p className="mt-1.5 text-sm" style={{ color: theme.muted }}>{p.detail}</p>}
                </a>
              ))}
            </div>
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-12 flex gap-5 text-sm">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="underline-offset-4 hover:underline" style={{ color: accent }}>
                {l.label}
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
