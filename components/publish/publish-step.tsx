// components/publish/publish-step.tsx
"use client";

import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { publishSite } from "@/lib/publish";
import { estimatePayloadBytes, isMockPointer } from "@/lib/iqlabs";
import { gatewaySiteUrl } from "@/lib/gateway";
import { downloadSiteHtml } from "@/lib/export-html";
import type { Site } from "@/lib/types";

type Phase = "ready" | "publishing" | "done" | "error";

export function PublishStep({
  site,
  domain,
  onPublished,
  onBack,
}: {
  site: Site;
  domain?: string;
  onPublished: (storagePointer: string, domainTx?: string) => void;
  onBack: () => void;
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [phase, setPhase] = useState<Phase>("ready");
  const [message, setMessage] = useState("");
  const [pointer, setPointer] = useState("");
  const [progress, setProgress] = useState(0);
  const [bytes, setBytes] = useState<number | null>(null);

  useEffect(() => {
    estimatePayloadBytes(site).then(setBytes).catch(() => setBytes(null));
  }, [site]);

  const run = async () => {
    setPhase("publishing");
    setProgress(0);
    setMessage("Writing your site onchain…");
    try {
      const result = await publishSite({
        site,
        wallet,
        connection,
        domain,
        onProgress: (p) => {
          setProgress(p);
          if (p >= 90 && domain) setMessage(`Pointing ${domain} at your site…`);
        },
      });
      setPointer(result.storage.pointer);
      setPhase("done");
      onPublished(result.storage.pointer, result.domainTx);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">Step 3 of 3</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Publish forever</h1>
      <p className="mt-2 text-muted-foreground">
        This writes your site permanently onchain via IQLabs
        {domain ? <> and points <span className="font-mono text-foreground">{domain}</span> at it</> : null}.
      </p>

      {/* summary */}
      <div className="mt-8 rounded-xl border border-border bg-card p-5 text-left text-sm">
        <Row label="Template" value={site.templateId} />
        <Row label="Title" value={site.title} />
        <Row label="Domain" value={domain ?? "— (none yet)"} />
        <Row label="Storage" value="IQLabs (onchain, permanent)" />
        <Row label="Onchain size" value={bytes === null ? "…" : formatBytes(bytes)} />
      </div>

      {phase === "publishing" && (
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 animate-pulse font-mono text-sm text-primary">
            {message} {progress > 0 && `${progress}%`}
          </p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-5">
          <p className="font-display text-lg font-bold text-primary">Published ✓</p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">manifest: {pointer}</p>
          {domain && (
            <p className="mt-2 text-sm">
              Live at <span className="font-mono text-primary">{domain}</span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            {!isMockPointer(pointer) && (
              <a href={gatewaySiteUrl(pointer)} target="_blank" rel="noreferrer" className="font-medium text-primary">
                View on gateway ↗
              </a>
            )}
            <a href={`/preview/${site.id}`} className="font-medium text-primary">
              Preview ↗
            </a>
            <button onClick={() => downloadSiteHtml(site)} className="text-muted-foreground hover:text-foreground">
              Download HTML backup
            </button>
          </div>
        </div>
      )}

      {phase === "error" && (
        <p className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {message}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={phase === "publishing"}
          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
        >
          ← Back
        </button>
        {phase === "done" ? (
          <a href="/dashboard" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">
            Go to My Sites
          </a>
        ) : (
          <button
            onClick={run}
            disabled={phase === "publishing"}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {phase === "error" ? "Try again" : "Publish onchain"}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/50 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium">{value}</span>
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
