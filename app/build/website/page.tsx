// app/build/website/page.tsx
//
// The Website path: a real visual drag-and-drop builder (Puck) wired into the
// SAME publish pipeline as templates. Flow: build → domain → publish. The Puck
// "Publish" button just hands the editor Data to us; nothing goes on-chain
// until the user finishes the domain + publish steps (reusing those components).

"use client";

import { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Data } from "@measured/puck";
import { DomainStep } from "@/components/publish/domain-step";
import { PublishStep } from "@/components/publish/publish-step";
import { initialPuckData } from "@/lib/puck-config";
import { getSite, newPuckSite, saveSite } from "@/lib/site-store";
import type { Site } from "@/lib/types";

// Puck is browser-only — never server-render it.
const WebsiteEditor = dynamic(
  () => import("@/components/website/website-editor").then((m) => m.WebsiteEditor),
  { ssr: false, loading: () => <EditorLoading /> },
);

type Step = "build" | "domain" | "publish";

export default function WebsiteBuildPage() {
  return (
    <Suspense fallback={<EditorLoading />}>
      <WebsiteFlow />
    </Suspense>
  );
}

function WebsiteFlow() {
  const editId = useSearchParams().get("site");
  const { publicKey } = useWallet();

  const existing = useMemo(() => (editId ? getSite(editId) : undefined), [editId]);
  const initialData = (existing?.builder === "puck" ? existing.puckData : undefined) as
    | Data
    | undefined;

  const [step, setStep] = useState<Step>("build");
  const [site, setSite] = useState<Site | null>(null);
  const [title, setTitle] = useState(existing?.title ?? "My Website");

  if (!publicKey) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Connect your wallet to start</h1>
        <p className="mt-2 text-muted-foreground">
          Use the Connect button at the top right. Your sites are tied to your wallet.
        </p>
      </div>
    );
  }

  const handlePublishFromEditor = (data: Data) => {
    try {
      const draft =
        existing && existing.builder === "puck"
          ? saveSite({ ...existing, title, puckData: data })
          : saveSite(newPuckSite(publicKey.toBase58(), title, data));
      setSite(draft);
      setStep("domain");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't save your draft.");
    }
  };

  if (step === "build") {
    return (
      <div>
        <div className="flex h-14 items-center gap-3 border-b border-border px-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            Website Builder
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Site title"
            className="flex-1 max-w-xs rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary/60"
          />
          <span className="ml-auto text-xs text-muted-foreground">
            Drag blocks, then hit <span className="text-primary">Publish</span> to continue →
          </span>
        </div>
        <WebsiteEditor data={initialData ?? initialPuckData} onPublish={handlePublishFromEditor} />
      </div>
    );
  }

  if (step === "domain" && site) {
    return (
      <DomainStep
        ownerWallet={site.ownerWallet}
        onBack={() => setStep("build")}
        onAttached={(domain) => {
          setSite(saveSite({ ...site, domain }));
          setStep("publish");
        }}
      />
    );
  }

  if (step === "publish" && site) {
    return (
      <PublishStep
        site={site}
        domain={site.domain}
        onBack={() => setStep("domain")}
        onPublished={(pointer, domainTx) =>
          saveSite({
            ...site,
            status: "published",
            storage: { provider: "iqlabs", pointer, txSignature: domainTx },
          })
        }
      />
    );
  }

  return null;
}

function EditorLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
      Loading builder…
    </div>
  );
}
