// components/templates/onchain-journal.tsx
"use client";

import type { TemplateRenderProps } from "@/lib/types";

interface Post { date: string; title: string; body: string }
interface LinkItem { label: string; url: string }

export function OnchainJournal({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    journal?: string; author?: string; about?: string;
    posts?: Post[]; links?: LinkItem[];
  };
  const accent = theme.primary;

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="min-h-full w-full">
      <main className="mx-auto max-w-xl px-6 py-16">
        <header className="border-b pb-8" style={{ borderColor: `${accent}26` }}>
          <h1 className="font-display text-3xl font-bold">{c.journal || "Journal"}</h1>
          <p className="mt-2 text-sm" style={{ color: theme.muted }}>
            {c.author && <span style={{ color: accent }}>{c.author}</span>}
            {c.author && c.about && " — "}
            {c.about}
          </p>
        </header>

        {!!c.posts?.length && (
          <section className="mt-10 space-y-12">
            {c.posts.map((p, i) => (
              <article key={i}>
                <p className="font-mono text-xs" style={{ color: accent }}>{p.date}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-snug">{p.title}</h2>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-loose" style={{ color: theme.muted }}>
                  {p.body}
                </p>
              </article>
            ))}
          </section>
        )}

        {!!c.links?.length && (
          <footer className="mt-16 border-t pt-6" style={{ borderColor: `${accent}26` }}>
            <div className="flex flex-wrap gap-4 text-sm">
              {c.links.map((l, i) => (
                <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                  target={preview ? undefined : "_blank"} rel="noreferrer"
                  className="underline-offset-4 hover:underline" style={{ color: accent }}>
                  {l.label}
                </a>
              ))}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest" style={{ color: theme.muted }}>
              written forever · onchain
            </p>
          </footer>
        )}
      </main>
    </div>
  );
}
