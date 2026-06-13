"use client";

import * as React from "react";
import type { SiteTheme } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ACCENTS = ["#22f56b", "#a6ff00", "#16f5c7", "#5cc8ff", "#9b5cff", "#ff3df0", "#ffb627", "#ff5c5c"];
const BACKDROPS: { label: string; value: string }[] = [
  { label: "Onchain", value: "radial-gradient(60rem 60rem at 75% -10%, rgba(34,245,107,.12), transparent 60%), #070b09" },
  { label: "Void", value: "#070b09" },
  { label: "Slate", value: "#0d1117" },
  { label: "Plum", value: "#0b070d" },
  { label: "Paper", value: "#f5f3ec" },
];
const FONTS: { label: string; value: SiteTheme["font"] }[] = [
  { label: "Sans", value: "sans" },
  { label: "Mono", value: "mono" },
  { label: "Serif", value: "serif" },
];

function Swatches({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function ThemeControls({ theme, onChange }: { theme: SiteTheme; onChange: (t: SiteTheme) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-foreground">Accent</Label>
        <Swatches>
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              aria-label={a}
              onClick={() => onChange({ ...theme, accent: a })}
              className={cn("h-8 w-8 rounded-full border-2 transition", theme.accent === a ? "border-foreground" : "border-transparent")}
              style={{ background: a, boxShadow: theme.accent === a ? `0 0 16px ${a}` : "none" }}
            />
          ))}
          <Input
            type="color"
            value={theme.accent}
            onChange={(e) => onChange({ ...theme, accent: e.target.value })}
            className="h-8 w-12 cursor-pointer p-1"
            aria-label="Custom accent"
          />
        </Swatches>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Background</Label>
        <Swatches>
          {BACKDROPS.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => onChange({ ...theme, background: b.value, mode: b.label === "Paper" ? "light" : "dark" })}
              className={cn(
                "h-9 rounded-md border px-3 text-xs transition",
                theme.background === b.value ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {b.label}
            </button>
          ))}
        </Swatches>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Mode</Label>
        <Swatches>
          {(["dark", "light"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange({ ...theme, mode: m })}
              className={cn(
                "h-9 rounded-md border px-4 text-xs capitalize transition",
                theme.mode === m ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </Swatches>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Typeface</Label>
        <Swatches>
          {FONTS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ ...theme, font: f.value })}
              className={cn(
                "h-9 rounded-md border px-4 text-xs transition",
                theme.font === f.value ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </Swatches>
      </div>
    </div>
  );
}
