"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  DEFAULT_PROFILE_DATA,
  PROFILE_THEMES,
  publishProfile,
  type ProfileMeta,
  type ProfileData,
  type ProfileTheme,
} from "@/lib/profile";
import { ThemePicker } from "@/components/profile/theme-picker";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileCard } from "@/components/profile/profile-card";

type Phase = "edit" | "publishing" | "done" | "error";

export default function ProfilePage() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [data, setData] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [theme, setTheme] = useState<ProfileTheme>(PROFILE_THEMES[0]);
  const [phase, setPhase] = useState<Phase>("edit");
  const [statusMsg, setStatusMsg] = useState("");
  const [pointer, setPointer] = useState("");

  const publish = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatusMsg("Connect your wallet first.");
      setPhase("error");
      return;
    }

    setPhase("publishing");

    const profile: ProfileMeta = { ...data, theme };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await publishProfile({
        profile,
        wallet: wallet as any,
        connection,
        onProgress: (step) => setStatusMsg(step),
      });
      setPointer(result.pointer);
      setPhase("done");
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  };

  const isMock = process.env.NEXT_PUBLIC_IQ_MOCK === "1";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        IQForge · Profile
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold">Your on-chain identity</h1>
      <p className="mt-2 text-muted-foreground">
        Pick a theme, fill in your details, and publish permanently onchain. Your profile
        renders identically on every IQ surface — no link rot, no middleman.
      </p>

      {isMock && (
        <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 font-mono text-xs text-yellow-400">
          Demo mode — set NEXT_PUBLIC_IQ_MOCK=0 and connect a funded wallet to publish for real.
        </div>
      )}

      {/* Theme picker */}
      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold">Choose a theme</h2>
        <ThemePicker themes={PROFILE_THEMES} selected={theme} onChange={setTheme} />
      </section>

      {/* Live preview — rendered through our own iqui kit */}
      <section className="mt-6">
        <ProfileCard data={data} theme={theme} />
      </section>

      {/* Form */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold">Profile details</h2>
        <ProfileForm data={data} onChange={setData} />
      </section>

      {/* Publish */}
      <section className="mt-10 border-t border-border pt-8">
        {phase === "publishing" && (
          <p className="mb-4 animate-pulse font-mono text-sm text-primary">{statusMsg}</p>
        )}
        {phase === "done" && (
          <div className="mb-4 rounded-xl border border-primary/40 bg-primary/10 p-4">
            <p className="font-display font-bold text-primary">Profile published ✓</p>
            <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
              txId: {pointer}
            </p>
          </div>
        )}
        {phase === "error" && (
          <p className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {statusMsg}
          </p>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={publish}
            disabled={phase === "publishing"}
            className="rounded-xl bg-primary px-7 py-3 font-medium text-primary-foreground disabled:opacity-50"
          >
            {phase === "publishing"
              ? "Publishing…"
              : phase === "done"
                ? "Update profile"
                : "Publish profile"}
          </button>
          {!wallet.publicKey && (
            <p className="text-sm text-muted-foreground">Connect your wallet to publish.</p>
          )}
        </div>
      </section>
    </div>
  );
}
