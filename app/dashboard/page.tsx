// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { deleteSite, listSites } from "@/lib/site-store";
import { getTemplateMeta } from "@/lib/templates";
import { gatewaySiteUrl } from "@/lib/gateway";
import { isMockPointer } from "@/lib/iqlabs";
import type { PublishStatus, Site } from "@/lib/types";

const STATUS_STYLE: Record<PublishStatus, string> = {
  draft: "text-muted-foreground border-border",
  publishing: "text-yellow-400 border-yellow-400/40",
  published: "text-primary border-primary/40",
  failed: "text-destructive border-destructive/40",
};

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    if (publicKey) setSites(listSites(publicKey.toBase58()));
  }, [publicKey]);

  const remove = (id: string) => {
    deleteSite(id);
    if (publicKey) setSites(listSites(publicKey.toBase58()));
  };

  if (!publicKey) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Connect your wallet</h1>
        <p className="mt-2 text-muted-foreground">Connect to see the sites you&apos;ve built.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">My Sites</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Your sites</h1>
        </div>
        <Link
          href="/templates"
          className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          + Create New Site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="font-display text-xl">No sites yet</p>
          <p className="mt-2 text-muted-foreground">Pick a template and you&apos;ll be live in minutes.</p>
          <Link href="/templates" className="mt-6 inline-block font-medium text-primary">
            Browse templates →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => {
            const meta = getTemplateMeta(s.templateId);
            return (
              <div key={s.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase ${STATUS_STYLE[s.status]}`}>
                    {s.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{meta?.name ?? s.templateId}</p>
                {s.domain && <p className="mt-2 font-mono text-sm text-primary">{s.domain}</p>}

                <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4 text-sm">
                  <Link href={`/preview/${s.id}`} className="font-medium text-primary">
                    View
                  </Link>
                  <Link href={`/build/${s.templateId}?site=${s.id}`} className="font-medium text-primary">
                    Edit
                  </Link>
                  {s.storage && !isMockPointer(s.storage.pointer) && (
                    <a
                      href={gatewaySiteUrl(s.storage.pointer)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary"
                    >
                      Live ↗
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${s.title}"? This only removes the local copy.`)) remove(s.id);
                    }}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
