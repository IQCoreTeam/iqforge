"use client";

// iqui — IQForge's own react95-style themeable UI kit.
//
// Same contract react95 proves out: a flat named color-token object + a
// ThemeProvider. A "look" is pure data (a ProfileTheme), so a new theme is zero
// new component code — the same "templates are data, not code" principle this
// repo nails, applied to UI chrome. No styled-components: components read tokens
// from context and render the classic raised/inset bevel with box-shadow.

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import type { ProfileTheme } from "@/lib/profile";

export type IQTheme = ProfileTheme;

const ThemeContext = createContext<IQTheme | null>(null);

export function ThemeProvider({ theme, children }: { theme: IQTheme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): IQTheme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error("iqui components must be inside <ThemeProvider>");
  return t;
}

/** The whole point of the kit: a 3D bevel from four tokens. `raised` pops out
 *  (windows, buttons), `!raised` sinks in (fields, panels). Swapping the light
 *  and dark stops is the entire difference — kept pure so it's trivial to read
 *  and the only branch worth checking. */
export function bevel(t: IQTheme, raised: boolean): CSSProperties {
  const [light, lighter, dark, darker] = raised
    ? [t.borderLight, t.borderLightest, t.borderDark, t.borderDarkest]
    : [t.borderDark, t.borderDarkest, t.borderLight, t.borderLightest];
  return {
    boxShadow: `inset 1px 1px 0 ${lighter}, inset -1px -1px 0 ${darker}, inset 2px 2px 0 ${light}, inset -2px -2px 0 ${dark}`,
  };
}

export function Window({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const t = useTheme();
  return (
    <div style={{ background: t.material, color: t.materialText, padding: 4, ...bevel(t, true), ...style }}>
      {title && (
        <div
          style={{
            background: t.headerBackground,
            color: t.headerText,
            padding: "3px 8px",
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: 8 }}>{children}</div>
    </div>
  );
}

/** Inset frame — fields, content wells, image holders. */
export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const t = useTheme();
  return (
    <div style={{ background: t.canvas, color: t.canvasText, padding: 8, ...bevel(t, false), ...style }}>
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: t.material,
        color: t.materialText,
        padding: "4px 14px",
        fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...bevel(t, true),
      }}
    >
      {children}
    </button>
  );
}

export function Anchor({ href, children }: { href: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ color: t.anchor, textDecoration: "underline" }}>
      {children}
    </a>
  );
}

/** First-class IQ themes ship from lib/profile (PROFILE_THEMES). Re-export the
 *  default so kit consumers can grab a look without reaching past the kit. */
export { PROFILE_THEMES as IQ_THEMES } from "@/lib/profile";
