// lib/iqlabs.ts
//
// WRITE layer for IQLabs onchain storage. (Reads live in lib/gateway.ts.)
// Single integration point for @iqlabs-official/git-sdk/browser — nothing else
// in the codebase imports the SDK directly.
//
// Publish flow:
//   exportSiteHtml() → commit(index.html + iqpages.json) → deployPages()
//   deployPages() sig = the on-chain pointer stored in the SNS Url record.

import type { Connection } from "@solana/web3.js";
import { GitClient, deployPages, readOwnerRepos } from "@iqlabs-official/git-sdk/browser";
import { exportSiteHtml } from "./export-html";
import type { Site, StorageRef } from "./types";

/** Wallet-adapter shape the git-sdk accepts as a SignerInput. */
export interface PublishWallet {
  publicKey: { toBase58(): string };
  signTransaction: (tx: unknown) => Promise<unknown>;
  signAllTransactions?: (txs: unknown[]) => Promise<unknown[]>;
}

export interface PublishInput {
  site: Site;
  wallet: PublishWallet;
  connection: Connection;
  onProgress?: (step: string, percent: number) => void;
}

/** True for placeholder pointers created in demo / mock mode. */
export function isMockPointer(pointer: string): boolean {
  return pointer.startsWith("iq:mock:");
}

/**
 * Fast sync estimate of the published HTML size for the pre-publish summary.
 * The actual HTML is ~10× larger than the raw content JSON due to markup and
 * embedded styles, so we use that as a rough upper bound.
 */
export function estimatePayloadBytes(site: Site): number {
  const payload = site.builder === "puck" ? site.puckData : site.content;
  const contentBytes = new TextEncoder().encode(JSON.stringify(payload ?? {})).length;
  return contentBytes * 10;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 32) || "my-site";
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/**
 * Publishes a site on-chain via git-sdk and returns the deploy pointer.
 * Mock mode (NEXT_PUBLIC_IQ_MOCK=1) skips all chain calls so the flow is
 * demoable without a funded wallet.
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

  const { site, wallet, connection, onProgress } = input;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signer = wallet as any;

  onProgress?.("Exporting site HTML…", 10);
  const html = await exportSiteHtml(site);

  const repoName = slugify(site.title);

  const iqpagesConfig: Record<string, string> = {
    name: site.title,
    version: "1.0.0",
    description: `IQForge site — template ${site.templateId}`,
    entry: "index.html",
  };

  const client = new GitClient({ connection, signer });

  onProgress?.("Checking on-chain repo…", 20);
  const ownerRepos = await readOwnerRepos(wallet.publicKey.toBase58());
  const repoExists = ownerRepos.some((r) => r.name === repoName);

  if (!repoExists) {
    onProgress?.("Creating on-chain repo…", 30);
    await client.createRepo({
      name: repoName,
      description: `IQForge: ${site.title}`,
      isPublic: true,
      timestamp: Date.now(),
    });
  }

  const files: Record<string, string> = {
    "index.html": utf8ToBase64(html),
    "iqpages.json": utf8ToBase64(JSON.stringify(iqpagesConfig, null, 2)),
  };
  // Persist the Puck source so a published visual-builder site can be
  // re-opened and edited later straight from chain.
  if (site.builder === "puck" && site.puckData !== undefined) {
    files["puck.json"] = utf8ToBase64(JSON.stringify(site.puckData));
  }

  onProgress?.("Committing files on-chain…", 45);
  const commit = await client.commit(repoName, "publish", files);

  onProgress?.("Deploying to IQ Pages…", 80);
  const { sig } = await deployPages(signer, repoName);

  onProgress?.("Done!", 100);

  return {
    provider: "iqlabs",
    pointer: sig,
    txSignature: commit.id,
  };
}
