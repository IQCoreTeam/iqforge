// components/templates/creator-resume.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Experience { period: string; role: string; org: string; detail: string }
interface LinkItem { label: string; url: string }

export function CreatorResume({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    name?: string; title?: string; photo?: string; summary?: string;
    experience?: Experience[]; skills?: { skill: string }[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-2xl px-6 py-16">
        <header className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold">{c.name || "Your Name"}</h1>
            {c.title && <p className="mt-1 text-base" style={{ color: accent }}>{c.title}</p>}
            {c.summary && <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: theme.muted }}>{c.summary}</p>}
          </div>
          {c.photo && (
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl" style={{ boxShadow: `0 0 0 2px ${accent}55` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.photo} alt={c.name} className="h-full w-full object-cover" />
            </div>
          )}
        </header>

        {!!c.experience?.length && (
          <section className="mt-12">
            <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: theme.muted }}>Experience</h2>
            <div className="mt-5 border-l-2 pl-6" style={{ borderColor: `${accent}33` }}>
              {c.experience.map((e, i) => (
                <div key={i} className="relative pb-8 last:pb-0">
                  <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                  <p className="font-mono text-xs" style={{ color: accent }}>{e.period}</p>
                  <h3 className="mt-1 font-semibold">{e.role} <span style={{ color: theme.muted }}>· {e.org}</span></h3>
                  {e.detail && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{e.detail}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {!!c.skills?.length && (
          <section className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-widest" style={{ color: theme.muted }}>Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {c.skills.map((s, i) => (
                <span key={i} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: `${accent}44` }}>
                  {s.skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-12 flex flex-wrap gap-4 text-sm">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="font-medium underline-offset-4 hover:underline" style={{ color: accent }}>
                {l.label} ↗
              </a>
            ))}
          </footer>
        )}
      </main>
    </div>
  );
}
