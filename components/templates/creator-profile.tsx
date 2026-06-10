// components/templates/creator-profile.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface LinkItem { label: string; url: string }

export function CreatorProfile({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    name?: string; handle?: string; tagline?: string; avatar?: string;
    background?: string; aboutTitle?: string; about?: string; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full overflow-hidden">
      {c.background ? (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.background} alt="" className="h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.background}99, ${theme.background})` }} />
        </div>
      ) : (
        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}22, transparent 60%)` }} />
      )}

      <main className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 py-20 text-center">
        <div className="mb-7 h-28 w-28 overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${accent}, 0 0 30px ${accent}66` }}>
          {c.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold" style={{ background: `${accent}1A`, color: accent }}>
              {(c.name ?? "?").charAt(0)}
            </div>
          )}
        </div>

        <h1 className="font-display text-4xl font-bold sm:text-5xl" style={{ textShadow: `0 0 24px ${accent}55` }}>
          {c.name || "Your Name"}
        </h1>
        {c.handle && <p className="mt-2 font-mono text-sm" style={{ color: accent }}>{c.handle}</p>}
        {c.tagline && <p className="mt-4 max-w-md text-base leading-relaxed" style={{ color: theme.muted }}>{c.tagline}</p>}

        {!!c.links?.length && (
          <div className="mt-9 flex w-full flex-col gap-3">
            {c.links.map((link, i) => (
              <a key={i} href={preview ? undefined : link.url} target={preview ? undefined : "_blank"} rel="noreferrer"
                onClick={(e) => preview && e.preventDefault()}
                className="rounded-xl border px-5 py-3.5 text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${accent}40`, background: `${accent}0A` }}>
                {link.label || "Untitled link"}
              </a>
            ))}
          </div>
        )}

        {c.about && (
          <section className="mt-14 w-full text-left">
            <h2 className="font-display text-lg font-semibold" style={{ color: accent }}>{c.aboutTitle || "About"}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: theme.muted }}>{c.about}</p>
          </section>
        )}

        <footer className="mt-16 font-mono text-[10px] uppercase tracking-widest" style={{ color: theme.muted }}>
          eternal · onchain · iqforge
        </footer>
      </main>
    </div>
  );
}
