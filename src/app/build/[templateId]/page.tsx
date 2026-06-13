"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { Site } from "@/lib/types";
import { getSite, newSiteFromTemplate } from "@/lib/site-store";
import { getTemplate } from "@/lib/templates";
import { useWalletSigner } from "@/lib/use-wallet-signer";
import { Customizer } from "@/components/customizer/customizer";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Button } from "@/components/ui/button";

export default function BuildPage() {
  // useSearchParams needs a Suspense boundary above it during prerender (Next 15).
  return (
    <React.Suspense fallback={<Centered><Loader2 className="h-6 w-6 animate-spin text-primary" /></Centered>}>
      <BuildInner />
    </React.Suspense>
  );
}

function BuildInner() {
  const params = useParams<{ templateId: string }>();
  const search = useSearchParams();
  const { address } = useWalletSigner();
  const [site, setSite] = React.useState<Site | null>(null);
  const [missing, setMissing] = React.useState(false);
  const resolved = React.useRef(false);

  React.useEffect(() => {
    if (resolved.current) return;

    // Editing an existing local site — no wallet needed to load it.
    const existingId = search.get("site");
    if (existingId) {
      const found = getSite(existingId);
      if (found) {
        setSite(found);
        resolved.current = true;
      } else {
        setMissing(true);
      }
      return;
    }

    // New site from a template — needs a connected wallet as the owner.
    if (!address) return;
    if (!getTemplate(params.templateId)) {
      setMissing(true);
      return;
    }
    setSite(newSiteFromTemplate(params.templateId, address));
    resolved.current = true;
  }, [address, params.templateId, search]);

  if (missing) {
    return (
      <Centered>
        <h1 className="text-xl font-semibold">Template not found</h1>
        <Button asChild className="mt-4">
          <Link href="/templates">Back to templates</Link>
        </Button>
      </Centered>
    );
  }

  if (!site) {
    // Either waiting on a wallet (new site) or briefly loading.
    if (!address && !search.get("site")) {
      return (
        <Centered>
          <h1 className="text-xl font-semibold">Connect your wallet to start</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your wallet owns the site and signs the publish transactions. Nothing is stored on-chain until you publish.
          </p>
          <div className="mt-5">
            <ConnectButton />
          </div>
        </Centered>
      );
    }
    return (
      <Centered>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Centered>
    );
  }

  return <Customizer initial={site} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid h-dvh place-items-center px-6 text-center"><div>{children}</div></div>;
}
