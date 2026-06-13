"use client";

import Link from "next/link";
import type { TemplateDef } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TemplateCard({ template }: { template: TemplateDef }) {
  return (
    <Card className="group overflow-hidden transition hover:border-primary/50">
      <div className="relative aspect-[16/10] w-full" style={{ background: template.swatch }}>
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="text-lg font-bold tracking-tight text-white/90"
            style={{ fontFamily: template.defaultTheme.font === "mono" ? "var(--font-mono)" : "var(--font-sans)" }}
          >
            {template.name}
          </span>
        </div>
        <Badge className="absolute left-3 top-3" variant="secondary">
          {template.category}
        </Badge>
      </div>
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted-foreground">{template.blurb}</p>
        <Button asChild className="w-full" size="sm">
          <Link href={`/build/${template.id}`}>Use template</Link>
        </Button>
      </div>
    </Card>
  );
}
