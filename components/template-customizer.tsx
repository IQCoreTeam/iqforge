// components/template-customizer.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { TEMPLATE_COMPONENTS } from "@/components/templates";
import { fileToCompressedDataUrl } from "@/lib/image";
import type {
  SiteContent,
  TemplateDefinition,
  TemplateField,
  ThemeTokens,
} from "@/lib/types";

interface CustomizerProps {
  template: TemplateDefinition;
  /** Called when the user advances to the SNS / publish step. */
  onContinue?: (content: SiteContent, theme: ThemeTokens) => void;
}

export function TemplateCustomizer({ template, onContinue }: CustomizerProps) {
  const [content, setContent] = useState<SiteContent>(() => structuredClone(template.defaultContent));
  const [theme, setTheme] = useState<ThemeTokens>(() => ({ ...template.defaultTheme }));
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const Render = TEMPLATE_COMPONENTS[template.id];

  // group fields for the sidebar
  const groups = useMemo(() => {
    const map = new Map<string, TemplateField[]>();
    for (const f of template.fields) {
      const g = f.group ?? "Content";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return [...map.entries()];
  }, [template.fields]);

  const setField = useCallback((key: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[380px_1fr]">
      {/* ---------- FORM ---------- */}
      <aside className="overflow-y-auto border-r border-border bg-card/40 p-6">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Customizing</p>
          <h2 className="mt-1 font-display text-2xl font-bold">{template.name}</h2>
        </div>

        {/* theme */}
        <Section title="Theme">
          <ColorRow label="Accent" value={theme.primary} onChange={(v) => setTheme((t) => ({ ...t, primary: v }))} />
          <ColorRow label="Background" value={theme.background} onChange={(v) => setTheme((t) => ({ ...t, background: v }))} />
          <ColorRow label="Text" value={theme.foreground} onChange={(v) => setTheme((t) => ({ ...t, foreground: v }))} />
        </Section>

        {groups.map(([group, fields]) => (
          <Section key={group} title={group}>
            {fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={content[field.key]}
                onChange={(v) => setField(field.key, v)}
              />
            ))}
          </Section>
        ))}

        <button
          onClick={() => onContinue?.(content, theme)}
          className="mt-4 w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Continue → Attach .sol domain
        </button>
      </aside>

      {/* ---------- LIVE PREVIEW ---------- */}
      <section className="relative flex flex-col overflow-hidden bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Live preview
          </span>
          <div className="flex gap-1 rounded-lg border border-border p-1">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`rounded px-3 py-1 text-xs capitalize transition-colors ${
                  device === d ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-auto p-6">
          <div
            className="overflow-hidden rounded-xl border border-border shadow-2xl transition-all"
            style={{ width: device === "mobile" ? 390 : "100%", maxWidth: device === "mobile" ? 390 : 1100 }}
          >
            <div style={{ minHeight: 600 }}>
              {Render ? (
                <Render content={content} theme={theme} preview />
              ) : (
                <div className="p-10 text-center text-muted-foreground">
                  No renderer registered for “{template.id}”.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- field renderers ---------------------------------------------------------

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <Labeled field={field}>
          <textarea
            value={(value as string) ?? ""}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Labeled>
      );
    case "color":
      return (
        <ColorRow label={field.label} value={(value as string) ?? "#000000"} onChange={onChange} />
      );
    case "image":
      return (
        <Labeled field={field}>
          <ImageUpload value={(value as string) ?? ""} onChange={onChange} />
        </Labeled>
      );
    case "list":
      return <ListField field={field} value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} />;
    case "url":
    case "text":
    default:
      return (
        <Labeled field={field}>
          <input
            type={field.type === "url" ? "url" : "text"}
            value={(value as string) ?? ""}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </Labeled>
      );
  }
}

function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Uploads are downscaled/compressed (lib/image.ts) — on-chain storage is
  // priced per byte, so we never store a raw 4MB phone photo.
  const [busy, setBusy] = useState(false);
  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch {
      alert("Couldn't read that image — try a different file.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex items-center gap-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">↑</div>
        )}
      </div>
      <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground hover:border-primary hover:text-primary">
        {busy ? "Optimizing…" : value ? "Replace image" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {value && (
        <button onClick={() => onChange("")} className="text-xs text-muted-foreground hover:text-destructive">
          Clear
        </button>
      )}
    </div>
  );
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: TemplateField;
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const update = (i: number, key: string, v: unknown) => {
    const next = value.slice();
    next[i] = { ...next[i], [key]: v };
    onChange(next);
  };
  return (
    <Labeled field={field}>
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-muted-foreground">Item {i + 1}</span>
              <button
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2">
              {field.itemFields?.map((sub) => (
                <input
                  key={sub.key}
                  value={(item[sub.key] as string) ?? ""}
                  placeholder={sub.placeholder ?? sub.label}
                  onChange={(e) => update(i, sub.key, e.target.value)}
                  className="w-full rounded-md border border-input bg-card px-2.5 py-1.5 text-sm outline-none focus:border-primary"
                />
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => onChange([...value, { ...(field.defaultItem ?? {}) }])}
          className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          + Add {field.label.toLowerCase().replace(/s$/, "")}
        </button>
      </div>
    </Labeled>
  );
}

// --- small ui primitives -----------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Labeled({ field, children }: { field: TemplateField; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{field.label}</span>
      {children}
      {field.helpText && <span className="mt-1 block text-xs text-muted-foreground">{field.helpText}</span>}
    </label>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs outline-none focus:border-primary"
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent"
        />
      </span>
    </label>
  );
}
