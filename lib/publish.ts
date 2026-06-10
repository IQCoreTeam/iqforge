// lib/publish.ts
//
// One function coordinates the two subsystems so the UI never has to:
//   1. write the site onchain via IQLabs  (lib/iqlabs.ts)
//   2. point the .sol domain at it via SNS (lib/sns.ts)
// Mock mode (NEXT_PUBLIC_IQ_MOCK=1) lets the whole flow complete without the
// real SDKs so the experience is demoable today.

import type { Connection } from "@solana/web3.js";
import { publishToIQLabs } from "./iqlabs";
import { attachContentRecord } from "./sns";
import type { Site, StorageRef } from "./types";

const MOCK = process.env.NEXT_PUBLIC_IQ_MOCK === "1";

export interface PublishResult {
  storage: StorageRef;
  /** Tx that updated the SNS record, when a domain was attached. */
  domainTx?: string;
}

export async function publishSite(args: {
  site: Site;
  wallet: unknown;
  connection: Connection;
  /** e.g. "alice.sol". Omit to publish onchain without attaching a domain yet. */
  domain?: string;
}): Promise<PublishResult> {
  const storage = await publishToIQLabs({ site: args.site, wallet: args.wallet });

  let domainTx: string | undefined;
  if (args.domain) {
    domainTx = MOCK
      ? "MOCK_RECORD_TX"
      : await attachContentRecord(args.connection, args.domain, storage.pointer, args.wallet);
  }

  return { storage, domainTx };
}
