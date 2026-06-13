"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteCard } from "@/components/site-card";
import { Button } from "@/components/ui/button";
import { useWalletSigner } from "@/lib/use-wallet-signer";
import { listSites, deleteSite } from "@/lib/site-store";
import type { Site } from "@/lib/types";

export default function DashboardPage() {
  const { address } = useWalletSigner();
  const [sites, setSites] = React.useState<Site[]>([]);

  const refresh = React.useCallback(() => {
    setSites(address ? listSites(address) : []);
  }, [address]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  function remove(id: string) {
    deleteSite(id);
    refresh();
  }

  return (
    <>
      <SiteHeader />
      <main className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My sites</h1>
            <p className="mt-1 text-muted-foreground">Your drafts and published onchain pages.</p>
          </div>
          <Button asChild>
            <Link href="/templates">
              <Plus className="h-4 w-4" /> New site
            </Link>
          </Button>
        </div>

        {!address ? (
          <Empty title="Connect your wallet" body="Connect a Solana wallet to see the sites you've built." />
        ) : sites.length === 0 ? (
          <Empty
            title="No sites yet"
            body="Start from a template — you can customize everything before anything touches the chain."
            cta
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((s) => (
              <SiteCard key={s.id} site={s} onDelete={remove} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function Empty({ title, body, cta }: { title: string; body: string; cta?: boolean }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border py-20 text-center">
      <FolderOpen className="mb-4 h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {cta && (
        <Button asChild className="mt-5">
          <Link href="/templates">Browse templates</Link>
        </Button>
      )}
    </div>
  );
}
