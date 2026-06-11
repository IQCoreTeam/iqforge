// app/profile/page.tsx
//
// The PROFILE editor (ZO_PLAN §1). Distinct flow from websites: this writes
// { ...profileData, theme } into the shared IQ profile system that
// iq-wide-web reads — the same identity everywhere on the network.
//
// The preview below is a token-driven render of a react95-style window. The
// renderer of TRUTH is iq-wide-web (real react95 + ThemeProvider); this
// preview exists so theme choice is visual, not abstract. Deliberately not
// importing react95 here — it would pull styled-components into IQForge for
// a preview card; the contract is the theme OBJECT, not the library.
"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fileToCompressedDataUrl } from "@/lib/image";
import {
  DEFAULT_PROFILE,
  IQ_THEMES,
  SOCIAL_KEYS,
  readProfile,
  writeProfile,
  type IQProfile,
  type React95Tokens,
} from "@/lib/profile";

type Phase = "idle" | "loading" | "saving" | "saved" | "error";

export default function ProfilePage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [profile, setProfile] = useState<IQProfile>(DEFAULT_PROFILE);
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");

  // Load the existing onchain profile when a wallet connects.
  useEffect(() => {
    if (!wallet.publicKey) return;
    let active = true;
    setPhase("loading");
    readProfile(connection, wallet.publicKey)
      .then((p) => {
        if (!active) return;
        if (p) setProfile({ ...DEFAULT_PROFILE, ...p });
        setPhase("idle");
      })
      .catch(() => active && setPhase("idle"));
    return () => {
      active = false;
    };
  }, [connection, wallet.publicKey]);

  const tokens = profile.theme?.tokens ?? IQ_THEMES[0];

  const save = async () => {
    setPhase("saving");
    setMessage("");
    try {
      const txId = await writeProfile(connection, wallet, profile);
      setPhase("saved");
      setMessage(txId);
    } catch (e) {
      setPhase("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  if (!wallet.publicKey) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Connect your wallet</h1>
        <p className="mt-2 text-muted-foreground">
          Your profile is your identity across the whole IQ network — it lives on your wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[400px_1fr]">
      {/* ---------- FORM ---------- */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary">IQ Profile</p>
        <h1 className="mt-1 font-display text-3xl font-bold">Your network identity</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          One profile, rendered identically on every IQ surface — browser.iqlabs.dev and beyond.
        </p>

        <div className="mt-8 space-y-5">
          <Field label="Name">
            <input
              value={profile.name}
              maxLength={40}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Bio">
            <textarea
              value={profile.bio ?? ""}
              maxLength={280}
              rows={3}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </Field>
          <Field label="Profile picture">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                {profile.profilePicture && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.profilePicture} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground hover:border-primary hover:text-primary">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setProfile({ ...profile, profilePicture: await fileToCompressedDataUrl(f) });
                  }}
                />
              </label>
            </div>
          </Field>

          <div>
            <p className="mb-2 text-sm font-medium">Socials</p>
            <div className="space-y-2">
              {SOCIAL_KEYS.map(({ key, label, placeholder }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{label}</span>
                  <input
                    value={profile.socials?.[key] ?? ""}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setProfile({ ...profile, socials: { ...profile.socials, [key]: e.target.value } })
                    }
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {IQ_THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setProfile({ ...profile, theme: { format: "react95", tokens: t } })}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    tokens.name === t.name ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  <span className="flex gap-1">
                    <i className="h-4 w-4 rounded-sm" style={{ background: t.headerBackground }} />
                    <i className="h-4 w-4 rounded-sm" style={{ background: t.material }} />
                    <i className="h-4 w-4 rounded-sm border border-border" style={{ background: t.canvas }} />
                  </span>
                  {t.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Format: react95 — a flat token object any IQ surface can render.
            </p>
          </div>

          <button
            onClick={save}
            disabled={phase === "saving" || !profile.name}
            className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {phase === "saving" ? "Saving onchain…" : "Save profile onchain"}
          </button>
          {phase === "saved" && (
            <p className="break-all rounded-lg border border-primary/40 bg-primary/10 p-3 font-mono text-xs text-primary">
              Saved ✓ tx: {message}
            </p>
          )}
          {phase === "error" && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* ---------- PREVIEW: token-driven react95-style window ---------- */}
      <div
        className="flex items-start justify-center rounded-xl p-8 lg:sticky lg:top-24 lg:self-start"
        style={{ background: tokens.desktopBackground }}
      >
        <Win95Window tokens={tokens} profile={profile} />
      </div>
    </div>
  );
}

function Win95Window({ tokens: t, profile }: { tokens: React95Tokens; profile: IQProfile }) {
  const bevelOut = `inset -2px -2px 0 ${t.borderDarkest}, inset 2px 2px 0 ${t.borderLightest}, inset -4px -4px 0 ${t.borderDark}, inset 4px 4px 0 ${t.borderLight}`;
  const bevelIn = `inset 2px 2px 0 ${t.borderDark}, inset -2px -2px 0 ${t.borderLightest}`;
  const socials = Object.entries(profile.socials ?? {}).filter(([, v]) => v);

  return (
    <div className="w-full max-w-sm p-1" style={{ background: t.material, boxShadow: bevelOut }}>
      {/* title bar */}
      <div
        className="m-1 flex items-center justify-between px-2 py-1 text-sm font-bold"
        style={{ background: t.headerBackground, color: t.headerText }}
      >
        <span className="truncate">{profile.name || "anonymous"}.profile — IQ</span>
        <span className="flex gap-1">
          {["_", "□", "✕"].map((g) => (
            <span
              key={g}
              className="flex h-4 w-4 items-center justify-center text-[9px] font-bold"
              style={{ background: t.material, color: t.materialText, boxShadow: bevelIn.replace("inset 2px 2px 0", "inset -1px -1px 0").replace("inset -2px -2px 0", "inset 1px 1px 0") }}
            >
              {g}
            </span>
          ))}
        </span>
      </div>
      {/* content */}
      <div className="m-1 p-4" style={{ background: t.canvas, color: t.canvasText, boxShadow: bevelIn }}>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden" style={{ boxShadow: bevelIn, background: t.material }}>
            {profile.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.profilePicture} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl" style={{ color: t.canvasTextDisabled }}>
                ☺
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{profile.name || "anonymous"}</p>
            <p className="text-xs" style={{ color: t.canvasTextDisabled }}>wallet-keyed identity</p>
          </div>
        </div>
        {profile.bio && <p className="mt-3 text-sm leading-relaxed">{profile.bio}</p>}
        {!!socials.length && (
          <div className="mt-4 space-y-1">
            {socials.map(([k, v]) => (
              <p key={k} className="truncate text-sm">
                <span style={{ color: t.canvasTextDisabled }}>{k}: </span>
                <span style={{ color: t.anchor, textDecoration: "underline" }}>{v as string}</span>
              </p>
            ))}
          </div>
        )}
        {/* progress strip for flavor */}
        <div className="mt-4 h-4 w-full p-0.5" style={{ boxShadow: bevelIn }}>
          <div className="h-full w-2/3" style={{ background: t.progress }} />
        </div>
      </div>
      {/* status bar */}
      <div className="m-1 flex justify-between px-2 py-0.5 text-[10px]" style={{ background: t.material, color: t.materialText }}>
        <span>theme: {t.name}</span>
        <span>format: react95</span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
