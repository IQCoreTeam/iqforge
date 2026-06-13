// IQLabs publish pipeline.
//
// Mirrors the canonical iq-gateway/scripts/deploy-site.ts flow exactly so the
// production gateway serves our output unchanged:
//   1. codeIn each file (base64) -> txId
//   2. manifest = { index:{path}, paths:{ file: { id: txId } } }
//   3. codeIn(manifest, base64) -> manifestSig   (== the on-chain path)
//   4. URL record value = <gateway>/site/<manifestSig>/<indexPath>
//
// The gateway decoder (decodeAssetData) reads base64; deploy-site.ts writes
// base64 — we do the same, no other convention is compatible.

import type { Connection } from "@solana/web3.js";
import iqlabs from "@iqlabs-official/solana-sdk";
import type { WalletSigner } from "./types-sdk";
import type { PublishInfo } from "./types";

const GATEWAY = (process.env.NEXT_PUBLIC_IQ_GATEWAY || "https://gateway.iqlabs.dev").replace(/\/+$/, "");
const INDEX_PATH = "index.html";

/** Browser-safe base64 of a UTF-8 string (matches Buffer.from(str).toString("base64")). */
export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

/** One file in the site bundle. data is the *decoded* string (we base64 it here). */
export interface SiteFile {
  path: string; // e.g. "index.html"
  data: string; // utf-8 contents (data-URIs are kept inline inside the html)
  mime: string;
}

export type PublishStage =
  | { kind: "file"; path: string; index: number; total: number; pct: number }
  | { kind: "manifest"; pct: number };

/**
 * Upload a site bundle on-chain and return the publish receipt (no SNS write —
 * that's setSiteRecord in sns.ts, kept separate so a re-publish to an existing
 * domain doesn't always re-sign a record tx).
 *
 * `signer` is the wallet-adapter wallet (WalletSigner). The SDK accepts it directly.
 */
export async function publishSiteBundle(
  connection: Connection,
  signer: WalletSigner,
  files: SiteFile[],
  onStage?: (s: PublishStage) => void,
): Promise<Omit<PublishInfo, "publishedAt">> {
  const paths: Record<string, { id: string }> = {};
  let indexSig = "";

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const sig = await iqlabs.writer.codeIn(
      { connection, signer },
      utf8ToBase64(f.data),
      f.path,
      0,
      f.mime,
      (pct) => onStage?.({ kind: "file", path: f.path, index: i, total: files.length, pct }),
    );
    paths[f.path] = { id: sig };
    if (f.path === INDEX_PATH) indexSig = sig;
  }

  const manifest = { index: { path: INDEX_PATH }, paths };
  const manifestSig = await iqlabs.writer.codeIn(
    { connection, signer },
    utf8ToBase64(JSON.stringify(manifest)),
    "manifest.json",
    0,
    "application/json",
    (pct) => onStage?.({ kind: "manifest", pct }),
  );

  const viewerUrl = `${GATEWAY}/site/${manifestSig}/${INDEX_PATH}`;
  return { indexSig: indexSig || manifestSig, manifestSig, recordValue: viewerUrl, viewerUrl };
}

/** The value to write into the SNS URL record for a published manifest. */
export function buildRecordValue(manifestSig: string): string {
  return `${GATEWAY}/site/${manifestSig}/${INDEX_PATH}`;
}

/** Path-based viewer URL that works in any browser with no DNS step. */
export function gatewaySnsUrl(domain: string): string {
  return `${GATEWAY}/sns/${domain.replace(/\.sol$/i, "")}`;
}
