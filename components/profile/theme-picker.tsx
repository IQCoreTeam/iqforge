"use client";

import type { ProfileTheme } from "@/lib/profile";

export function ThemePicker({
  themes,
  selected,
  onChange,
}: {
  themes: ProfileTheme[];
  selected: ProfileTheme;
  onChange: (theme: ProfileTheme) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {themes.map((t) => {
        const active = t.name === selected.name;
        return (
          <button
            key={t.name}
            onClick={() => onChange(t)}
            className={`flex-shrink-0 rounded-xl border-2 p-3 text-left transition-all w-36 ${
              active ? "border-primary" : "border-border hover:border-muted"
            }`}
            style={{ background: t.desktopBackground }}
          >
            {/* title bar preview */}
            <div
              className="mb-2 rounded px-2 py-1 text-[10px] font-bold truncate"
              style={{ background: t.headerBackground, color: t.headerText }}
            >
              {t.name}
            </div>
            {/* canvas preview */}
            <div
              className="rounded px-2 py-1.5 text-[9px] leading-relaxed"
              style={{ background: t.canvas, color: t.canvasText }}
            >
              <div className="font-bold">Display Name</div>
              <div style={{ color: t.canvasTextDisabled }}>@handle</div>
            </div>
            {/* accent dot */}
            <div className="mt-2 flex gap-1">
              <div className="h-2 w-2 rounded-full" style={{ background: t.anchor }} />
              <div className="h-2 w-2 rounded-full" style={{ background: t.progress }} />
              <div className="h-2 w-2 rounded-full" style={{ background: t.focusSecondary }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
