"use client";

// Profile preview rendered entirely through our own iqui kit — the same flat
// ProfileTheme that gets stored on-chain drives the look here. Proves the kit:
// new theme object = new look, zero new component code.

import { ThemeProvider, Window, Panel, Anchor } from "@/components/iqui";
import { SOCIAL_PLATFORMS, type ProfileData, type ProfileTheme } from "@/lib/profile";

const isUrl = (v: string) => /^(https?:|mailto:|\/\/)/.test(v.trim());

export function ProfileCard({ data, theme }: { data: ProfileData; theme: ProfileTheme }) {
  return (
    <ThemeProvider theme={theme}>
      <Window title={theme.name}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {data.profilePicture && (
            <Panel style={{ padding: 3 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.profilePicture}
                alt="avatar"
                style={{ width: 56, height: 56, objectFit: "cover", display: "block" }}
              />
            </Panel>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700 }}>{data.name || "Your Name"}</p>
            {data.bio && <p style={{ fontSize: 13, marginTop: 4 }}>{data.bio}</p>}
          </div>
        </div>

        {Object.keys(data.socials).length > 0 && (
          <Panel style={{ marginTop: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12 }}>
              {SOCIAL_PLATFORMS.filter((p) => data.socials[p.key]).map((p) => {
                const v = data.socials[p.key] as string;
                return (
                  <span key={p.key}>
                    {p.label}:{" "}
                    {isUrl(v) ? <Anchor href={v}>{v.replace(/^https?:\/\//, "")}</Anchor> : v}
                  </span>
                );
              })}
            </div>
          </Panel>
        )}
      </Window>
    </ThemeProvider>
  );
}
