// lib/iqlabs.ts
//
// WRITE layer for IQLabs onchain storage. (Reads live in lib/gateway.ts.)
//
// Confirmed model (from the deployed gateway + iq-gateway repo):
//   • A published site is a set of files written on-chain, finalized by a
//     MANIFEST transaction. The manifest tx signature IS the on-chain path —
//     exactly the "tail of the linked list becomes the path" rule.
//   • The live gateway then serves it at  {gateway}/site/{manifestSig}.
//   • The .sol domain gets ONE URL record pointing at that manifest.
//
// ⚠️ The write itself is still stubbed: it requires the iqlabs-solana-sdk
// (github.com/IQCoreTeam/iqlabs-solana-sdk). Wiring real writes is a major
// step pending owner approval — see CHANGES.md. This file stays the single
// integration point; nothing else touches the SDK.

import type { Site, StorageRef } from "./types";

export interface PublishInput {
  site: Site;
  /** Connected wallet adapter (signs the storage txs). */
  wallet: unknown;
}

/** True for placeholder pointers created in demo mode. */
export function isMockPointer(pointer: string): boolean {
  return pointer.startsWith("iq:mock:");
}

/**
 * Serializes a site into the payload to be written on-chain.
 * NOTE: the real pipeline publishes FILES (index.html + assets) under a
 * manifest, not this JSON — pending the canonical-format decision, this JSON
 * remains the draft/publish payload and the size estimator's input.
 */
export function buildSitePayload(site: Site): string {
  return JSON.stringify({
    v: 1,
    templateId: site.templateId,
    title: site.title,
    theme: site.theme,
    content: site.content,
    publishedAt: Date.now(),
  });
}

/** Estimated on-chain byte size of the current site payload. */
export function estimatePayloadBytes(site: Site): number {
  return new TextEncoder().encode(buildSitePayload(site)).length;
}

/**
 * Writes the site on-chain and returns the manifest pointer.
 * Real implementation (once approved): generate static files via
 * lib/export-html.ts, write them + manifest with iqlabs-solana-sdk, return the
 * manifest tx signature as `pointer`.
 */
export async function publishToIQLabs(input: PublishInput): Promise<StorageRef> {
  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    await new Promise((r) => setTimeout(r, 800));
    return {
      provider: "iqlabs",
      pointer: `iq:mock:${input.site.id}`,
      txSignature: "MOCK_SIGNATURE",
    };
  }

  throw new Error(
    "IQLabs SDK not wired yet. Set NEXT_PUBLIC_IQ_MOCK=1 to demo the flow, " +
      "or implement publishToIQLabs() in lib/iqlabs.ts.",
  );
}
