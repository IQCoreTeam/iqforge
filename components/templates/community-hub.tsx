// components/templates/community-hub.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Channel { name: string; detail: string }
interface Rule { rule: string }
interface LinkItem { label: string; url: string }

export function CommunityHub({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    community?: string; vibe?: string; banner?: string; members?: string; joinUrl?: string;
    channels?: Channel[]; rules?: Rule[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      {/* banner */}
      <div className="relative h-44 w-full overflow-hidden sm:h-56">
        {c.banner ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.banner} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: `linear-gradient(120deg, ${accent}33, transparent 60%), ${theme.background}` }} />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${theme.background})` }} />
      </div>

      <main className="mx-auto -mt-10 max-w-2xl px-6 pb-16">
        <header className="relative z-10">
          <h1 className="font-display text-4xl font-bold">{c.community || "Community"}</h1>
          <div className="mt-2 flex items-center gap-4">
            {c.members && (
              <span className="flex items-center gap-1.5 font-mono text-sm" style={{ color: theme.muted }}>
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: accent }} />
                {c.members} members
              </span>
            )}
            {c.vibe && <span className="text-sm" style={{ color: theme.muted }}>{c.vibe}</span>}
          </div>
          {c.joinUrl && (
            <a href={preview ? undefined : c.joinUrl} onClick={(e) => preview && e.preventDefault()}
              target={preview ? undefined : "_blank"} rel="noreferrer"
              className="mt-5 inline-block rounded-xl px-7 py-3 font-bold" style={{ background: accent, color: theme.background }}>
              Join the community
            </a>
          )}
        </header>

        {!!c.channels?.length && (
          <section className="mt-12 space-y-2">
            {c.channels.map((ch, i) => (
              <div key={i} className="flex items-baseline gap-3 rounded-lg border px-4 py-3" style={{ borderColor: `${accent}1f`, background: `${accent}06` }}>
                <span className="font-mono text-lg" style={{ color: accent }}>#</span>
                <div>
                  <p className="text-sm font-semibold">{ch.name}</p>
                  {ch.detail && <p className="text-xs" style={{ color: theme.muted }}>{ch.detail}</p>}
                </div>
              </div>
            ))}
          </section>
        )}

        {!!c.rules?.length && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">House rules</h2>
            <ol className="mt-4 space-y-2">
              {c.rules.map((r, i) => (
                <li key={i} className="flex gap-3 text-sm" style={{ color: theme.muted }}>
                  <span className="font-mono" style={{ color: accent }}>{i + 1}.</span>
                  {r.rule}
                </li>
              ))}
            </ol>
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
