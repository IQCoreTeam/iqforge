"use client";

import Link from "next/link";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Site } from "@/lib/types";
import { getTemplate } from "@/lib/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteCard({ site, onDelete }: { site: Site; onDelete: (id: string) => void }) {
  const tpl = getTemplate(site.templateId);
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{site.name}</h3>
            <p className="text-xs text-muted-foreground">{tpl?.name ?? site.templateId}</p>
          </div>
          <Badge variant={site.status === "published" ? "default" : "secondary"}>{site.status}</Badge>
        </div>
        {site.domain && <p className="truncate text-sm text-primary">{site.domain}</p>}
        <p className="text-xs text-muted-foreground">Edited {new Date(site.updatedAt).toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/build/${site.templateId}?site=${site.id}`}>
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </Button>
          {site.publish && (
            <Button asChild size="sm" variant="ghost">
              <a href={site.publish.viewerUrl} target="_blank" rel="noopener" aria-label="Open site">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => onDelete(site.id)} aria-label="Delete site">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
