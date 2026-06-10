// components/templates/stealth-launch.tsx
"use client";

import { useEffect, useState } from "react";
import type { TemplateRenderProps } from "@/lib/types";

interface LinkItem { label: string; url: string }

export function StealthLaunch({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    codename?: string; teaser?: string; revealDate?: string; contractAddress?: string; links?: LinkItem[];
  };
  const accent = theme.primary;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = c.revealDate ? new Date(c.revealDate).getTime() : NaN;
  const diff = Number.isNaN(t) ? null : Math.max(0, t - now);
  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative flex min-h-full w-full items-center justify-center overflow-hidden">
      {/* scanline texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, ${accent}, ${accent} 1px, transparent 1px, transparent 4px)` }} />
      <main className="relative z-10 px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em]" style={{ color: theme.muted }}>classified</p>
        <h1 className="mt-6 font-mono text-5xl font-bold tracking-widest sm:text-6xl" style={{ color: accent, textShadow: `0 0 30px ${accent}88` }}>
          {c.codename || "$REDACTED"}
        </h1>
        {c.teaser && <p className="mx-auto mt-6 max-w-sm font-mono text-sm leading-relaxed" style={{ color: theme.muted }}>{c.teaser}</p>}

        {diff !== null && diff > 0 && (
          <p className="mt-10 font-mono text-3xl tabular-nums" style={{ color: accent }}>
            {fmt(Math.floor(diff / 86400000))}:{fmt(Math.floor((diff / 3600000) % 24))}:{fmt(Math.floor((diff / 60000) % 60))}:{fmt(Math.floor((diff / 1000) % 60))}
          </p>
        )}
        {diff === 0 && c.contractAddress && (
          <p className="mx-auto mt-10 max-w-full break-all rounded-lg border px-4 py-3 font-mono text-xs"
            style={{ borderColor: `${accent}44`, color: accent }}>
            {c.contractAddress}
          </p>
        )}

        {!!c.links?.length && (
          <div className="mt-12 flex justify-center gap-6">
            {c.links.map((l, i) => (
              <a key={i} href={preview ? undefined : l.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="font-mono text-xs uppercase tracking-widest underline-offset-4 hover:underline"
                style={{ color: theme.muted }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
