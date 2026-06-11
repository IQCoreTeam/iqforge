// components/templates/agency-showcase.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Service { title: string; detail: string }
interface CaseStudy { title: string; detail: string; image: string }

export function AgencyShowcase({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    agency?: string; tagline?: string; intro?: string; contactLabel?: string; contactUrl?: string;
    services?: Service[]; work?: CaseStudy[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header>
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>{c.agency || "Agency"}</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-bold leading-tight">{c.tagline || "We build things people remember."}</h1>
          {c.intro && <p className="mt-6 max-w-xl text-base leading-relaxed" style={{ color: theme.muted }}>{c.intro}</p>}
        </header>

        {!!c.services?.length && (
          <section className="mt-14 divide-y" style={{ borderColor: `${accent}1f` }}>
            {c.services.map((s, i) => (
              <div key={i} className="flex items-baseline gap-6 py-5" style={{ borderColor: `${accent}1f` }}>
                <span className="font-mono text-sm" style={{ color: accent }}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  {s.detail && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{s.detail}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {!!c.work?.length && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold">Selected work</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {c.work.map((w, i) => (
                <article key={i} className="overflow-hidden rounded-xl border" style={{ borderColor: `${accent}26` }}>
                  <div className="aspect-video" style={{ background: `${accent}10` }}>
                    {w.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{w.title}</h3>
                    {w.detail && <p className="mt-1 text-sm" style={{ color: theme.muted }}>{w.detail}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {c.contactUrl && (
          <footer className="mt-16 text-center">
            <a href={preview ? undefined : c.contactUrl} onClick={(e) => preview && e.preventDefault()}
              target={preview ? undefined : "_blank"} rel="noreferrer"
              className="inline-block rounded-xl px-8 py-3.5 font-bold" style={{ background: accent, color: theme.background }}>
              {c.contactLabel || "Work with us"}
            </a>
          </footer>
        )}
      </main>
    </div>
  );
}
