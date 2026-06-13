"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteContent, Archetype, FieldSpec } from "@/lib/types";
import { scalarFields, listSections } from "@/lib/templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageField } from "./image-field";

// A list row is a flat record of string fields (label/url/value/title/...).
type Row = Record<string, string>;

function ScalarField({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={spec.key}>{spec.label}</Label>
      {spec.kind === "image" ? (
        <ImageField value={value} onChange={onChange} />
      ) : spec.kind === "textarea" ? (
        <Textarea id={spec.key} value={value} placeholder={spec.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input
          id={spec.key}
          type={spec.kind === "color" ? "color" : "text"}
          value={value}
          placeholder={spec.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {spec.help && <p className="text-xs text-muted-foreground">{spec.help}</p>}
    </div>
  );
}

export function ContentForm({
  archetype,
  content,
  onChange,
}: {
  archetype: Archetype;
  content: SiteContent;
  onChange: (next: SiteContent) => void;
}) {
  const scalars = scalarFields(archetype);
  const lists = listSections(archetype);

  const setField = (key: keyof SiteContent, v: string) => onChange({ ...content, [key]: v });

  const setRow = (listKey: keyof SiteContent, i: number, field: string, v: string) => {
    const rows = [...(content[listKey] as unknown as Row[])];
    rows[i] = { ...rows[i], [field]: v };
    onChange({ ...content, [listKey]: rows });
  };
  const addRow = (listKey: keyof SiteContent, fields: { key: string }[]) => {
    const blank: Row = Object.fromEntries(fields.map((f) => [f.key, ""]));
    onChange({ ...content, [listKey]: [...(content[listKey] as unknown as Row[]), blank] });
  };
  const removeRow = (listKey: keyof SiteContent, i: number) => {
    onChange({ ...content, [listKey]: (content[listKey] as unknown as Row[]).filter((_, j) => j !== i) });
  };

  return (
    <div className="space-y-5">
      {scalars.map((spec) => (
        <ScalarField key={spec.key} spec={spec} value={(content[spec.key] as string) ?? ""} onChange={(v) => setField(spec.key, v)} />
      ))}

      {lists.map((list) => {
        const rows = content[list.key] as unknown as Row[];
        return (
          <div key={list.key} className="space-y-3">
            <Separator />
            <div className="flex items-center justify-between">
              <Label className="text-foreground">{list.label}</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => addRow(list.key, list.fields)}>
                <Plus className="h-4 w-4" /> {list.addLabel}
              </Button>
            </div>
            {rows.length === 0 && <p className="text-xs text-muted-foreground">None yet.</p>}
            {rows.map((row, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(list.key, i)} aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {list.fields.map((f) =>
                  f.kind === "image" ? (
                    <ImageField key={f.key} value={row[f.key] ?? ""} onChange={(v) => setRow(list.key, i, f.key, v)} />
                  ) : f.kind === "textarea" ? (
                    <Textarea
                      key={f.key}
                      placeholder={f.label}
                      value={row[f.key] ?? ""}
                      onChange={(e) => setRow(list.key, i, f.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      key={f.key}
                      placeholder={f.label}
                      value={row[f.key] ?? ""}
                      onChange={(e) => setRow(list.key, i, f.key, e.target.value)}
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
