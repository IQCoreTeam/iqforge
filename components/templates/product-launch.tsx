// components/templates/product-launch.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Feature { title: string; detail: string }

export function ProductLaunch({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    product?: string; headline?: string; subheadline?: string; screenshot?: string;
    ctaLabel?: string; ctaUrl?: string; secondaryLabel?: string; secondaryUrl?: string;
    features?: Feature[]; footnote?: string;
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: accent }}>{c.product || "Product"}</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-5xl font-bold leading-tight sm:text-6xl">
          {c.headline || "The headline that sells it."}
        </h1>
        {c.subheadline && (
          <p className="mx-auto mt-5 max-w-xl text-lg" style={{ color: theme.muted }}>{c.subheadline}</p>
        )}

        <div className="mt-8 flex justify-center gap-4">
          {c.ctaUrl && (
            <a href={preview ? undefined : c.ctaUrl} onClick={(e) => preview && e.preventDefault()}
              target={preview ? undefined : "_blank"} rel="noreferrer"
              className="rounded-xl px-8 py-3.5 font-bold transition-transform hover:-translate-y-0.5"
              style={{ background: accent, color: theme.background, boxShadow: `0 10px 40px ${accent}44` }}>
              {c.ctaLabel || "Get started"}
            </a>
          )}
          {c.secondaryUrl && (
            <a href={preview ? undefined : c.secondaryUrl} onClick={(e) => preview && e.preventDefault()}
              target={preview ? undefined : "_blank"} rel="noreferrer"
              className="rounded-xl border px-8 py-3.5 font-medium" style={{ borderColor: `${accent}55` }}>
              {c.secondaryLabel || "Learn more"}
            </a>
          )}
        </div>

        {/* product shot in a browser frame */}
        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border" style={{ borderColor: `${accent}33` }}>
          <div className="flex gap-1.5 border-b px-4 py-2.5" style={{ borderColor: `${accent}22`, background: `${accent}08` }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${accent}40` }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${accent}40` }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: `${accent}40` }} />
          </div>
          <div className="aspect-video" style={{ background: `${accent}0a` }}>
            {c.screenshot && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.screenshot} alt={c.product} className="h-full w-full object-cover" />
            )}
          </div>
        </div>

        {!!c.features?.length && (
          <section className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            {c.features.map((f, i) => (
              <div key={i} className="rounded-xl border p-5" style={{ borderColor: `${accent}26` }}>
                <span className="font-mono text-sm" style={{ color: accent }}>0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm" style={{ color: theme.muted }}>{f.detail}</p>
              </div>
            ))}
          </section>
        )}

        {c.footnote && <p className="mt-12 font-mono text-xs" style={{ color: theme.muted }}>{c.footnote}</p>}
      </main>
    </div>
  );
}
