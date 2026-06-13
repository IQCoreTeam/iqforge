"use client";

import * as React from "react";
import { PublicKey } from "@solana/web3.js";
import { Globe, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { listDomains, domainAvailable, snsSearchUrl } from "@/lib/sns";
import { useWalletSigner } from "@/lib/use-wallet-signer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function DomainStep({ selected, onSelect }: { selected?: string; onSelect: (domain: string) => void }) {
  const { connection, address } = useWalletSigner();
  const [domains, setDomains] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [check, setCheck] = React.useState<{ status: "idle" | "checking" | "free" | "taken"; name: string }>({
    status: "idle",
    name: "",
  });

  const load = React.useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      setDomains(await listDomains(connection, new PublicKey(address)));
    } catch {
      setDomains([]);
    } finally {
      setLoading(false);
    }
  }, [address, connection]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function runCheck() {
    const name = query.trim().replace(/\.sol$/i, "");
    if (!name) return;
    setCheck({ status: "checking", name });
    const free = await domainAvailable(connection, name);
    setCheck({ status: free ? "free" : "taken", name });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-foreground">Your .sol domains</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        {domains.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No domains found on this wallet. Register one below.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelect(d)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                selected === d ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/50",
              )}
            >
              <Globe className="h-3.5 w-3.5" /> {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-background/40 p-4">
        <Label className="text-foreground">Need a domain?</Label>
        <div className="flex gap-2">
          <Input value={query} placeholder="yourname" onChange={(e) => setQuery(e.target.value)} />
          <Button type="button" variant="outline" onClick={runCheck} disabled={!query.trim() || check.status === "checking"}>
            {check.status === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
          </Button>
        </div>
        {check.status === "free" && (
          <a className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline" href={snsSearchUrl(check.name)} target="_blank" rel="noopener">
            {check.name}.sol is available — register on sns.id <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        {check.status === "taken" && <p className="text-sm text-muted-foreground">{check.name}.sol is already registered.</p>}
        <p className="text-xs text-muted-foreground">
          Registration happens on sns.id. Once you own it, refresh above and it&apos;ll appear here.
        </p>
      </div>
    </div>
  );
}
