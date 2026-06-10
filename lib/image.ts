// lib/image.ts
//
// Every uploaded image becomes bytes that are stored permanently on-chain —
// and on-chain storage is priced per byte. A 4MB phone photo would be ~50x
// more expensive than it needs to be for a web page. So all uploads pass
// through this downscale/compress step before entering site content.

const MAX_DIMENSION = 1600; // px, longest side — plenty for full-bleed backgrounds
const JPEG_QUALITY = 0.85;
const SKIP_BELOW_BYTES = 120_000; // already small → keep original (preserves PNG transparency)

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  const original = await readAsDataUrl(file);
  if (file.size <= SKIP_BELOW_BYTES) return original;

  const img = await loadImage(original);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original; // very old browser — fall back to original

  ctx.drawImage(img, 0, 0, w, h);
  const compressed = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

  // JPEG re-encode can occasionally be larger (e.g. flat-color PNGs) — keep the smaller.
  return compressed.length < original.length ? compressed : original;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}
