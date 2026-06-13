"use client";

import * as React from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Downscale an uploaded image to <= maxDim and re-encode as a compact data-URI.
 *  Keeps the published index.html small since images are inlined into it. */
async function fileToDataUri(file: File, maxDim = 768, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  // PNG keeps transparency (logos/avatars); everything else -> JPEG for size.
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(type, quality);
}

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToDataUri(file));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-12 w-12 rounded-md border border-border object-cover" />
      ) : (
        <div className="grid h-12 w-12 place-items-center rounded-md border border-dashed border-border text-muted-foreground">
          <ImagePlus className="h-5 w-5" />
        </div>
      )}
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        {busy ? "Processing…" : value ? "Replace" : "Upload"}
      </Button>
      {value && (
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")} aria-label="Remove image">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
