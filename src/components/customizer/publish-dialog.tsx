"use client";

import * as React from "react";
import { Rocket, Loader2, CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import type { Site, PublishInfo } from "@/lib/types";
import { renderSiteHtml } from "@/lib/render-html";
import { publishSiteBundle, gatewaySnsUrl, type PublishStage } from "@/lib/iqlabs";
import { setSiteRecord } from "@/lib/sns";
import { useWalletSigner } from "@/lib/use-wallet-signer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DomainStep } from "./domain-step";

type Phase = "setup" | "uploading" | "record" | "done";

export function PublishDialog({ site, onPublished }: { site: Site; onPublished: (info: PublishInfo, domain: string) => void }) {
  const { connection, signer } = useWalletSigner();
  const [open, setOpen] = React.useState(false);
  const [domain, setDomain] = React.useState<string | undefined>(site.domain);
  const [phase, setPhase] = React.useState<Phase>("setup");
  const [status, setStatus] = React.useState("");
  const [result, setResult] = React.useState<{ info: PublishInfo; domain: string } | null>(null);

  function describe(s: PublishStage): string {
    return s.kind === "file" ? `Storing ${s.path} on-chain… ${s.pct}%` : `Storing manifest… ${s.pct}%`;
  }

  async function publish() {
    if (!signer) {
      toast.error("Connect your wallet first.");
      return;
    }
    if (!domain) {
      toast.error("Pick a .sol domain to publish to.");
      return;
    }
    try {
      setPhase("uploading");
      const html = renderSiteHtml({ ...site, domain });
      const bundle = await publishSiteBundle(
        connection,
        signer,
        [{ path: "index.html", data: html, mime: "text/html" }],
        (s) => setStatus(describe(s)),
      );

      setPhase("record");
      setStatus(`Pointing ${domain} at your site…`);
      await setSiteRecord(connection, signer, domain, bundle.recordValue);

      const info: PublishInfo = { ...bundle, publishedAt: Date.now() };
      setResult({ info, domain });
      setPhase("done");
      onPublished(info, domain);
      toast.success("Published on-chain.");
    } catch (e) {
      setPhase("setup");
      toast.error(e instanceof Error ? e.message : "Publish failed.");
    }
  }

  const busy = phase === "uploading" || phase === "record";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o && phase === "done") setPhase("setup");
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Rocket className="h-4 w-4" /> Publish
        </Button>
      </DialogTrigger>
      <DialogContent>
        {phase === "done" && result ? (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" /> Live on-chain
              </DialogTitle>
              <DialogDescription>Your site is stored permanently on Solana and served at your .sol domain.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 rounded-lg border border-border bg-background/40 p-3 text-sm">
              <Row label="Domain" value={result.domain} href={`https://${result.domain}.site`} />
              <Row label="Gateway" value={gatewaySnsUrl(result.domain)} href={gatewaySnsUrl(result.domain)} />
              <Row label="Manifest" value={result.info.manifestSig} copy />
            </div>
            <Button className="w-full" asChild>
              <a href={result.info.viewerUrl} target="_blank" rel="noopener">
                Open site <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle>Publish onchain</DialogTitle>
              <DialogDescription>
                Your page is stored with IQLabs and addressed by a .sol domain. Two wallet signatures: one to store, one to point the domain.
              </DialogDescription>
            </DialogHeader>

            <DomainStep selected={domain} onSelect={setDomain} />

            {busy && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> {status}
              </div>
            )}

            <Button className="w-full" disabled={busy || !domain || !signer} onClick={publish}>
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Publishing…
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" /> Publish to {domain ?? "…"}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, href, copy }: { label: string; value: string; href?: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate font-mono text-xs">{value}</span>
        {copy && (
          <button onClick={() => navigator.clipboard.writeText(value)} aria-label="Copy" className="text-muted-foreground hover:text-foreground">
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
        {href && (
          <a href={href} target="_blank" rel="noopener" className="text-primary">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </span>
    </div>
  );
}
