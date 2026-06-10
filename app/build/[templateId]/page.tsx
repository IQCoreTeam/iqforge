// app/build/[templateId]/page.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { TemplateCustomizer } from "@/components/template-customizer";
import { DomainStep } from "@/components/publish/domain-step";
import { PublishStep } from "@/components/publish/publish-step";
import { getTemplateDefinition } from "@/lib/templates";
import { getSite, newSiteFromTemplate, saveSite } from "@/lib/site-store";
import type { Site, SiteContent, ThemeTokens } from "@/lib/types";

type Step = "customize" | "domain" | "publish";

export default function BuildPage() {
  return (
    <Suspense fallback={null}>
      <BuildFlow />
    </Suspense>
  );
}

function BuildFlow() {
  const { templateId } = useParams<{ templateId: string }>();
  const editId = useSearchParams().get("site");
  const { publicKey } = useWallet();

  const template = getTemplateDefinition(templateId);
  if (!template) notFound();

  // If editing an existing draft, seed the customizer with its saved content by
  // cloning the template def's defaults — keeps the Customizer itself untouched.
  const seeded = useMemo(() => {
    const draft = editId ? getSite(editId) : undefined;
    if (!draft) return template;
    return { ...template, defaultContent: draft.content, defaultTheme: draft.theme };
  }, [template, editId]);

  const [step, setStep] = useState<Step>("customize");
  const [site, setSite] = useState<Site | null>(null);

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

  const startDomainStep = (content: SiteContent, theme: ThemeTokens) => {
    try {
      const draft =
        editId && getSite(editId)
          ? saveSite({ ...(getSite(editId) as Site), content, theme })
          : saveSite(newSiteFromTemplate(template, publicKey.toBase58(), content, theme));
      setSite(draft);
      setStep("domain");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Couldn't save your draft.");
    }
  };

  if (step === "customize") {
    return <TemplateCustomizer template={seeded} onContinue={startDomainStep} />;
  }

  if (step === "domain" && site) {
    return (
      <DomainStep
        ownerWallet={site.ownerWallet}
        onBack={() => setStep("customize")}
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
