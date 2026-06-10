// lib/iqlabs.ts
//
// WRITE layer for IQLabs onchain storage — REAL implementation against
// @iqlabs-official/solana-sdk. (Reads live in lib/gateway.ts.)
//
// Verified flow (from iq-gateway/scripts/deploy-site.ts, the canonical deploy):
//   1. Each file → iqlabs.writer.codeIn(ctx, base64, path, 0, mime) → tx sig.
//      codeIn writes the data as an on-chain path (linked list / session) and
//      indexes path + metadata to the wallet in one tx — the core IQ structure.
//   2. Manifest JSON { index: {path}, paths: {path: {id: sig}} } uploaded the
//      same way. The MANIFEST SIGNATURE is the site's pointer.
//   3. Gateways serve it at {gateway}/site/{manifestSig}.
//
// The SDK's SignerInput accepts a browser wallet adapter directly
// (publicKey + signTransaction + signAllTransactions) — verified in
// sdk/src/sdk/utils/wallet.ts — so publishing happens client-side with
// Phantom/Solflare. No keypair files, no server.

import type { Connection } from "@solana/web3.js";
import { codeIn } from "@iqlabs-official/solana-sdk/writer";
import { exportSiteHtml } from "./export-html";
import type { PublishWallet, Site, StorageRef } from "./types";

export interface PublishInput {
  site: Site;
  wallet: PublishWallet;
  connection: Connection;
  /** 0–100, across both uploads. */
  onProgress?: (percent: number) => void;
}

/** True for placeholder pointers created in demo mode. */
export function isMockPointer(pointer: string): boolean {
  return pointer.startsWith("iq:mock:");
}

/** Estimated on-chain byte size of the published site (the exported HTML). */
export async function estimatePayloadBytes(site: Site): Promise<number> {
  return new TextEncoder().encode(await exportSiteHtml(site)).length;
}

export async function publishToIQLabs(input: PublishInput): Promise<StorageRef> {
  const { site, wallet, connection, onProgress } = input;

  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    for (const p of [15, 40, 70, 100]) {
      await new Promise((r) => setTimeout(r, 250));
      onProgress?.(p);
    }
    return { provider: "iqlabs", pointer: `iq:mock:${site.id}`, txSignature: "MOCK_SIGNATURE" };
  }

  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error("Connect a wallet that supports transaction signing.");
  }
  const signer = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };
  const ctx = { connection, signer };

  // 1) index.html — the self-contained site. ~90% of the byte budget.
  const html = await exportSiteHtml(site);
  const indexSig = await codeIn(
    ctx,
    toBase64(new TextEncoder().encode(html)),
    "index.html",
    0,
    "text/html",
    (p) => onProgress?.(Math.round(p * 0.9)),
  );

  // 2) manifest — tiny; its signature becomes the site's permanent pointer.
  const manifest = JSON.stringify({
    index: { path: "index.html" },
    paths: { "index.html": { id: indexSig } },
  });
  const manifestSig = await codeIn(
    ctx,
    toBase64(new TextEncoder().encode(manifest)),
    "manifest.json",
    0,
    "application/json",
  );
  onProgress?.(100);

  return { provider: "iqlabs", pointer: manifestSig, txSignature: manifestSig };
}

/** Binary-safe base64 without relying on the Node Buffer global. */
function toBase64(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}
