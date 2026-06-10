// components/templates/meme-coin-launcher.tsx
"use client";

import { useEffect, useState } from "react";
import type { TemplateRenderProps } from "@/lib/types";

interface Step { step: string }
interface Social { label: string; url: string }

function useCountdown(target?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target) return null;
  const t = new Date(target).getTime();
  if (Number.isNaN(t)) return null;
  const diff = Math.max(0, t - now);
  return {
    live: diff === 0,
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export function MemeCoinLauncher({ content, theme, preview }: TemplateRenderProps) {
  const c = content as {
    coinName?: string; ticker?: string; logo?: string; heroTagline?: string;
    background?: string; launchDate?: string; contractAddress?: string; buyUrl?: string;
    about?: string; howToBuy?: Step[]; socials?: Social[];
  };
  const accent = theme.primary;
  const cd = useCountdown(c.launchDate);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (preview || !c.contractAddress) return;
    navigator.clipboard?.writeText(c.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ background: theme.background, color: theme.foreground }} className="relative min-h-full w-full overflow-hidden">
      {c.background && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.background} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.background}cc, ${theme.background})` }} />
        </div>
      )}
      <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 50% 0%, ${accent}25, transparent 55%)` }} />

      <main className="relative z-10 mx-auto max-w-2xl px-6 py-16 text-center">
        {/* logo */}
        <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-3xl" style={{ boxShadow: `0 0 0 3px ${accent}, 0 0 40px ${accent}77`, transform: "rotate(-3deg)" }}>
          {c.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.logo} alt={c.coinName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl" style={{ background: `${accent}1A` }}>🚀</div>
          )}
        </div>

        <h1 className="font-display text-5xl font-bold sm:text-6xl">{c.coinName || "Your Coin"}</h1>
        <p className="mt-2 font-mono text-2xl font-bold" style={{ color: accent }}>{c.ticker || "$TICKER"}</p>
        {c.heroTagline && <p className="mx-auto mt-5 max-w-md text-lg" style={{ color: theme.muted }}>{c.heroTagline}</p>}

        {/* countdown */}
        {cd && !cd.live && (
          <div className="mt-9 inline-flex gap-3">
            {([["D", cd.d], ["H", cd.h], ["M", cd.m], ["S", cd.s]] as const).map(([lbl, v]) => (
              <div key={lbl} className="rounded-xl border px-4 py-3" style={{ borderColor: `${accent}40`, background: `${accent}0D` }}>
                <div className="font-mono text-3xl font-bold" style={{ color: accent }}>{String(v).padStart(2, "0")}</div>
                <div className="font-mono text-[10px] uppercase" style={{ color: theme.muted }}>{lbl}</div>
              </div>
            ))}
          </div>
        )}
        {cd?.live && <p className="mt-8 font-display text-2xl font-bold" style={{ color: accent }}>● LIVE NOW</p>}

        {/* buy */}
        <div className="mt-9">
          <a href={preview ? undefined : c.buyUrl} target={preview ? undefined : "_blank"} rel="noreferrer"
            onClick={(e) => preview && e.preventDefault()}
            className="inline-block rounded-2xl px-10 py-4 text-lg font-bold transition-transform hover:-translate-y-1 hover:scale-105"
            style={{ background: accent, color: theme.background, boxShadow: `0 8px 40px ${accent}66` }}>
            BUY {c.ticker || "$TICKER"} →
          </a>
        </div>

        {/* contract */}
        {c.contractAddress && (
          <button onClick={copy} className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs"
            style={{ borderColor: `${accent}30`, color: theme.muted }}>
            <span className="truncate">{c.contractAddress}</span>
            <span style={{ color: accent }}>{copied ? "copied!" : "copy"}</span>
          </button>
        )}

        {c.about && (
          <section className="mt-14">
            <p className="mx-auto max-w-lg whitespace-pre-wrap text-sm leading-relaxed" style={{ color: theme.muted }}>{c.about}</p>
          </section>
        )}

        {!!c.howToBuy?.length && (
          <section className="mt-14 text-left">
            <h2 className="text-center font-display text-2xl font-bold">How to buy</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {c.howToBuy.map((s, i) => (
                <div key={i} className="flex gap-3 rounded-xl border p-4" style={{ borderColor: `${accent}25`, background: `${accent}08` }}>
                  <span className="font-mono text-xl font-bold" style={{ color: accent }}>{i + 1}</span>
                  <span className="text-sm" style={{ color: theme.foreground }}>{s.step}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!c.socials?.length && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {c.socials.map((s, i) => (
              <a key={i} href={preview ? undefined : s.url} onClick={(e) => preview && e.preventDefault()}
                target={preview ? undefined : "_blank"} rel="noreferrer"
                className="rounded-full border px-5 py-2 text-sm font-medium" style={{ borderColor: `${accent}40` }}>
                {s.label}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
