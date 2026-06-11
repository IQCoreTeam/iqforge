// lib/iqlabs.ts
//
// WRITE layer for website publishing — now backed by @iqlabs-official/git-sdk
// per Zo's direction (ZO_PLAN §0). The by-hand codeIn/manifest dance is gone:
// a published site is an ON-CHAIN GIT REPO, and every publish is a commit.
//
// Verified pipeline (from git-sdk 0.1.18 d.ts + iq-gateway/src/routes/site.ts):
//   1. GitClient.commit(repo, msg, { "index.html": base64, ... }) → Commit
//   2. Commit.treeTxId is the tree.json pointer. The gateway's manifest
//      normalizer accepts BOTH the legacy {index,paths} manifest AND the git
//      tree format {path: {txId, hash}} — so /site/{treeTxId} just works.
//   3. The .sol Url record gets the bare treeTxId (lib/sns.ts, unchanged).
//
// Bonus over the old flow: re-publishing commits to the SAME repo → full
// version history onchain, blob dedup (unchanged files aren't re-uploaded),
// and the repo is one deployPages() call away from the public IQ Pages
// gallery (one-time 0.2 SOL fee — intentionally NOT auto-charged here).

import type { Connection } from "@solana/web3.js";
import {
  GitClient,
  readOwnerRepos,
  setNetwork,
  IQPAGES_CONFIG_FILENAME,
} from "@iqlabs-official/git-sdk/browser";
import { exportSiteHtml } from "./export-html";
import type { PublishWallet, Site, StorageRef } from "./types";

export interface PublishInput {
  site: Site;
  wallet: PublishWallet;
  connection: Connection;
  /** Coarse 0–100 milestones (repo ready / committing / done). */
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

/** Stable repo name per site, so every publish is a commit to the same repo. */
export function siteRepoName(site: Site): string {
  return `iqforge-${site.id.slice(0, 8)}`;
}

export async function publishToIQLabs(input: PublishInput): Promise<StorageRef> {
  const { site, wallet, connection, onProgress } = input;

  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    for (const p of [15, 40, 70, 100]) {
      await new Promise((r) => setTimeout(r, 250));
      onProgress?.(p);
    }
    return {
      provider: "iqlabs",
      pointer: `iq:mock:${site.id}`,
      txSignature: "MOCK_SIGNATURE",
      repo: siteRepoName(site),
    };
  }

  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error("Connect a wallet that supports transaction signing.");
  }

  setNetwork(process.env.NEXT_PUBLIC_IQ_NETWORK === "devnet" ? "devnet" : "mainnet");

  const signer = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };
  const client = new GitClient({ connection, signer });
  const owner = wallet.publicKey.toBase58();
  const repoName = siteRepoName(site);

  // Ensure the repo exists (first publish only).
  const repos = await readOwnerRepos(owner);
  if (!repos.some((r) => r.name === repoName)) {
    await client.createRepo({
      name: repoName,
      description: site.title,
      isPublic: true,
      timestamp: Date.now(),
    });
  }
  onProgress?.(15);

  // Snapshot: the self-contained site + an iqpages.json so the repo is
  // gallery-deployable later without another commit.
  const html = await exportSiteHtml(site);
  const pagesConfig = JSON.stringify({
    name: site.title,
    version: new Date().toISOString(),
    description: `Published with IQForge (${site.templateId})`,
    entry: "index.html",
  });
  const scan: Record<string, string> = {
    "index.html": toBase64(new TextEncoder().encode(html)),
    [IQPAGES_CONFIG_FILENAME]: toBase64(new TextEncoder().encode(pagesConfig)),
  };
  onProgress?.(30);

  const commit = await client.commit(repoName, `publish ${new Date().toISOString()}`, scan);
  onProgress?.(100);

  return {
    provider: "iqlabs",
    pointer: commit.treeTxId, // servable at {gateway}/site/{treeTxId}
    txSignature: commit.id,
    repo: repoName,
  };
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
