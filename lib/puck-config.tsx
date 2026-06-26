// lib/puck-config.tsx
//
// The IQForge visual-builder block library, expressed as a Puck `Config`.
// Shared by BOTH the editor (app/build/website) and the HTML exporter
// (lib/puck-export). Defining it once guarantees the live editor and the
// published page render identically.
//
// Design rule for these blocks: style with INLINE styles only. The exported
// index.html must be fully self-contained — no Tailwind CDN, no external CSS —
// so a published Puck site is "eternal" the moment it lands on-chain. (This is
// the permanent fix for the CDN tradeoff flagged in lib/export-html.ts.)

import React from "react";
import type { Config, Data } from "@measured/puck";
import { IQ_THEME } from "./types";

const FONT_STACK = '"Geist", system-ui, -apple-system, sans-serif';
const MONO_STACK = '"JetBrains Mono", ui-monospace, monospace';

/** Per-block color schemes, anchored to the IQForge token palette. */
const SCHEMES: Record<string, React.CSSProperties> = {
  dark: { background: IQ_THEME.background, color: IQ_THEME.foreground },
  panel: { background: "#101314", color: IQ_THEME.foreground },
  accent: {
    background: `linear-gradient(135deg, ${IQ_THEME.primary}, #2bd968)`,
    color: IQ_THEME.background,
  },
  light: { background: "#F4FFF7", color: IQ_THEME.background },
};

export interface IQProps {
  HeroSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    scheme: keyof typeof SCHEMES;
  };
  TextBlock: {
    text: string;
    align: "left" | "center" | "right";
    size: "sm" | "md" | "lg";
  };
  FeatureGrid: {
    heading: string;
    items: { title: string; body: string }[];
  };
  CTASection: {
    heading: string;
    buttonLabel: string;
    buttonHref: string;
    scheme: keyof typeof SCHEMES;
  };
  Spacer: { height: number };
}

const schemeOptions = [
  { value: "dark", label: "Dark" },
  { value: "panel", label: "Panel" },
  { value: "accent", label: "Accent (green)" },
  { value: "light", label: "Light" },
];

export const iqPuckConfig: Config<IQProps> = {
  root: {
    fields: {},
    render: ({ children }) => (
      <div style={{ fontFamily: FONT_STACK, background: IQ_THEME.background, minHeight: "100%" }}>
        {children}
      </div>
    ),
  },
  components: {
    HeroSection: {
      label: "Hero Section",
      fields: {
        eyebrow: { type: "text", label: "Eyebrow" },
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        scheme: { type: "select", label: "Color scheme", options: schemeOptions },
      },
      defaultProps: {
        eyebrow: "SNS × IQLabs",
        title: "Build things that live forever",
        subtitle: "Publish permanently on-chain. No servers, no link rot.",
        scheme: "dark",
      },
      render: ({ eyebrow, title, subtitle, scheme }) => (
        <section style={{ ...SCHEMES[scheme], textAlign: "center", padding: "96px 24px" }}>
          {eyebrow ? (
            <p
              style={{
                fontFamily: MONO_STACK,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.7,
                margin: "0 0 16px",
              }}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.1 }}>
            {title}
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: 560, margin: "0 auto" }}>
            {subtitle}
          </p>
        </section>
      ),
    },

    TextBlock: {
      label: "Text",
      fields: {
        text: { type: "textarea", label: "Content" },
        align: {
          type: "select",
          label: "Alignment",
          options: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ],
        },
        size: {
          type: "select",
          label: "Text size",
          options: [
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
          ],
        },
      },
      defaultProps: { text: "Edit this text block.", align: "left", size: "md" },
      render: ({ text, align, size }) => {
        const fontSize = size === "lg" ? 20 : size === "sm" ? 14 : 16;
        return (
          <p
            style={{
              fontSize,
              textAlign: align,
              lineHeight: 1.7,
              color: IQ_THEME.foreground,
              maxWidth: 720,
              margin: "0 auto",
              padding: "24px",
            }}
          >
            {text}
          </p>
        );
      },
    },

    FeatureGrid: {
      label: "Feature Grid",
      fields: {
        heading: { type: "text", label: "Heading" },
        items: {
          type: "array",
          label: "Features",
          arrayFields: {
            title: { type: "text", label: "Title" },
            body: { type: "textarea", label: "Body" },
          },
          defaultItemProps: { title: "Feature", body: "Describe this feature." },
        },
      },
      defaultProps: {
        heading: "Why on-chain?",
        items: [
          { title: "Permanent", body: "Your site lives on Solana forever." },
          { title: "Yours", body: "Owned by your wallet, not a platform." },
          { title: "No link rot", body: "Attach a .sol domain that never breaks." },
        ],
      },
      render: ({ heading, items }) => (
        <section style={{ padding: "64px 24px", background: IQ_THEME.background }}>
          {heading ? (
            <h2
              style={{
                color: IQ_THEME.foreground,
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: 700,
                margin: "0 0 40px",
              }}
            >
              {heading}
            </h2>
          ) : null}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {(items ?? []).map((it, i) => (
              <div
                key={i}
                style={{
                  background: "#101314",
                  border: `1px solid ${IQ_THEME.primary}22`,
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <h3 style={{ color: IQ_THEME.primary, margin: "0 0 8px", fontSize: "1.1rem" }}>
                  {it.title}
                </h3>
                <p style={{ color: IQ_THEME.muted, margin: 0, lineHeight: 1.6, fontSize: 14 }}>
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    CTASection: {
      label: "Call to Action",
      fields: {
        heading: { type: "text", label: "Heading" },
        buttonLabel: { type: "text", label: "Button label" },
        buttonHref: { type: "text", label: "Button URL" },
        scheme: { type: "select", label: "Color scheme", options: schemeOptions },
      },
      defaultProps: {
        heading: "Ready to go on-chain?",
        buttonLabel: "Publish now",
        buttonHref: "#",
        scheme: "accent",
      },
      render: ({ heading, buttonLabel, buttonHref, scheme }) => {
        const s = SCHEMES[scheme];
        const onAccent = scheme === "accent" || scheme === "light";
        return (
          <section style={{ ...s, textAlign: "center", padding: "72px 24px" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 24px" }}>{heading}</h2>
            <a
              href={buttonHref}
              style={{
                display: "inline-block",
                padding: "14px 32px",
                borderRadius: 8,
                fontWeight: 600,
                textDecoration: "none",
                background: onAccent ? IQ_THEME.background : IQ_THEME.primary,
                color: onAccent ? IQ_THEME.foreground : IQ_THEME.background,
              }}
            >
              {buttonLabel}
            </a>
          </section>
        );
      },
    },

    Spacer: {
      label: "Spacer",
      fields: { height: { type: "number", label: "Height (px)" } },
      defaultProps: { height: 48 },
      render: ({ height }) => <div style={{ height }} />,
    },
  },
};

/** A sensible starting page for a brand-new website draft. */
export const initialPuckData: Data = {
  content: [
    {
      type: "HeroSection",
      props: {
        id: "hero-1",
        eyebrow: "SNS × IQLabs",
        title: "My IQForge Site",
        subtitle: "Built on Solana. Drag blocks from the left to make it yours.",
        scheme: "dark",
      },
    },
    {
      type: "FeatureGrid",
      props: {
        id: "features-1",
        heading: "Why on-chain?",
        items: [
          { title: "Permanent", body: "Your site lives on Solana forever." },
          { title: "Yours", body: "Owned by your wallet, not a platform." },
          { title: "No link rot", body: "Attach a .sol domain that never breaks." },
        ],
      },
    },
    {
      type: "CTASection",
      props: {
        id: "cta-1",
        heading: "Ready to go on-chain?",
        buttonLabel: "Publish now",
        buttonHref: "#",
        scheme: "accent",
      },
    },
  ],
  root: { props: {} },
  zones: {},
};
