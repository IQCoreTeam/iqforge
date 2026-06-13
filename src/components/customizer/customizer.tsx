"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye } from "lucide-react";
import type { Site, PublishInfo } from "@/lib/types";
import { saveSite } from "@/lib/site-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@/components/wallet/connect-button";
import { ContentForm } from "./content-form";
import { ThemeControls } from "./theme-controls";
import { LivePreview } from "./live-preview";
import { PublishDialog } from "./publish-dialog";

export function Customizer({ initial }: { initial: Site }) {
  const [site, setSite] = React.useState<Site>(initial);
  const [saved, setSaved] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(false); // mobile toggle

  // Debounced autosave to the local store.
  React.useEffect(() => {
    setSaved(false);
    const id = setTimeout(() => {
      saveSite(site);
      setSaved(true);
    }, 600);
    return () => clearTimeout(id);
  }, [site]);

  const onPublished = (info: PublishInfo, domain: string) =>
    setSite((s) => ({ ...s, publish: info, domain, status: "published" }));

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground" aria-label="Back to dashboard">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Input
          value={site.name}
          onChange={(e) => setSite({ ...site, name: e.target.value })}
          className="h-9 max-w-[240px] border-transparent bg-transparent px-2 text-base font-semibold focus-visible:border-input"
        />
        <Badge variant={site.status === "published" ? "default" : "secondary"}>{site.status}</Badge>
        <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Check className={`h-3.5 w-3.5 ${saved ? "text-primary" : "opacity-30"}`} /> {saved ? "Saved" : "Saving…"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Toggle preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
          <PublishDialog site={site} onPublished={onPublished} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[420px_1fr]">
        <div className={`min-h-0 overflow-y-auto border-r border-border ${showPreview ? "hidden lg:block" : "block"}`}>
          <Tabs defaultValue="content" className="p-4">
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1">
                Content
              </TabsTrigger>
              <TabsTrigger value="style" className="flex-1">
                Style
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ContentForm archetype={site.archetype} content={site.content} onChange={(content) => setSite({ ...site, content })} />
            </TabsContent>
            <TabsContent value="style">
              <ThemeControls theme={site.theme} onChange={(theme) => setSite({ ...site, theme })} />
            </TabsContent>
          </Tabs>
        </div>

        <div className={`min-h-0 bg-background/40 p-4 ${showPreview ? "block" : "hidden lg:block"}`}>
          <LivePreview site={site} />
        </div>
      </div>
    </div>
  );
}
