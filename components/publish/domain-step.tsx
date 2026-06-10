// components/publish/domain-step.tsx
"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getOwnedDomains, type OwnedDomain } from "@/lib/sns";

const MOCK = process.env.NEXT_PUBLIC_IQ_MOCK === "1";

export function DomainStep({
  ownerWallet,
  onAttached,
  onBack,
}: {
  ownerWallet: string;
  onAttached: (domain?: string) => void;
  onBack: () => void;
}) {
  const { connection } = useConnection();
  const [domains, setDomains] = useState<OwnedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const owned = await getOwnedDomains(connection, new PublicKey(ownerWallet));
        if (active) setDomains(owned);
      } catch {
        if (active) setError("Couldn't load your domains right now.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [connection, ownerWallet]);

  const registerNew = () => {
    const name = newName.trim().replace(/\.sol$/i, "");
    if (!name) return;
    if (!MOCK) {
      setError("Domain registration isn't wired to the live SNS SDK yet.");
      return;
    }
    const fqdn = `${name}.sol`;
    setDomains((d) => [{ name, fqdn, address: "mock" }, ...d]);
    setSelected(fqdn);
    setNewName("");
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Step 2 of 3</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Attach a .sol domain</h1>
      <p className="mt-2 text-muted-foreground">
        Your site will be reachable at this address. You can also skip and attach one later.
      </p>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading your domains…</p>}

        {!loading && domains.length === 0 && (
          <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
            No .sol domains found in this wallet. Register one below or skip for now.
          </p>
        )}

        {domains.map((d) => (
          <button
            key={d.fqdn}
            onClick={() => setSelected(d.fqdn)}
            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
              selected === d.fqdn ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
          >
            <span className="font-mono text-sm">{d.fqdn}</span>
            {selected === d.fqdn && <span className="text-primary">✓</span>}
          </button>
        ))}

        {/* register new */}
        <div className="rounded-lg border border-dashed border-border p-4">
          <p className="mb-2 text-sm font-medium">Register a new domain</p>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center rounded-lg border border-input bg-background px-3">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="yourname"
                className="flex-1 bg-transparent py-2 text-sm outline-none"
              />
              <span className="font-mono text-sm text-muted-foreground">.sol</span>
            </div>
            <button
              onClick={registerNew}
              className="rounded-lg border border-primary px-4 text-sm font-medium text-primary hover:bg-primary/10"
            >
              Register
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to editing
        </button>
        <div className="flex gap-3">
          <button onClick={() => onAttached(undefined)} className="rounded-lg border border-border px-5 py-2.5 text-sm">
            Skip for now
          </button>
          <button
            disabled={!selected}
            onClick={() => selected && onAttached(selected)}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            Attach & continue
          </button>
        </div>
      </div>
    </div>
  );
}
