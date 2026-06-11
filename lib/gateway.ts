// lib/gateway.ts
//
// REAL integration with the IQ Gateway (the read-only cache layer for IQLabs
// on-chain data). This is live today — no SDK or wallet needed for reads.
// Docs: https://gateway.iqlabs.dev/docs  ·  Code: github.com/IQCoreTeam/iq-gateway
//
// Responsibility split (per project rules): this file owns ALL reads of
// published content. lib/iqlabs.ts owns writes. No duplicated functions.

const GATEWAY = process.env.NEXT_PUBLIC_IQ_GATEWAY ?? "https://gateway.iqlabs.dev";

/** Public URL where a published site is served (index.html). */
export function gatewaySiteUrl(manifestSig: string, path?: string): string {
  return path ? `${GATEWAY}/site/${manifestSig}/${path}` : `${GATEWAY}/site/${manifestSig}`;
}

/** Normalized manifest for a published site: which files exist, which is the index. */
export async function fetchSiteManifest(
  manifestSig: string,
): Promise<{ manifestSig: string; indexPath: string; files: Record<string, string> }> {
  const res = await fetch(`${GATEWAY}/site/${manifestSig}/manifest`);
  if (!res.ok) throw new Error(`Gateway manifest fetch failed (${res.status})`);
  return res.json();
}

/** Gateway health + cache stats (handy for a status indicator later). */
export async function gatewayHealth(): Promise<unknown> {
  const res = await fetch(`${GATEWAY}/health`);
  if (!res.ok) throw new Error(`Gateway health check failed (${res.status})`);
  return res.json();
}

/** Raw data payload of a codeIn tx via the gateway's /data route (used by the
 *  profile system to resolve txId-stored JSON). Soft-misses return null. */
export async function fetchTxData(txId: string): Promise<string | null> {
  try {
    const res = await fetch(`${GATEWAY}/data/${txId}`);
    if (!res.ok) return null;
    const env = (await res.json()) as { data?: string | null };
    const data = env?.data;
    if (!data || data.startsWith("[unable")) return null;
    return data;
  } catch {
    return null;
  }
}
