// lib/publish.ts
//
// One function coordinates the two subsystems so the UI never has to:
//   1. write the site on-chain via IQLabs  (lib/iqlabs.ts)
//   2. point the .sol domain at it via SNS (lib/sns.ts)
// Demo mode (NEXT_PUBLIC_IQ_MOCK=1) completes the flow without transactions.

import type { Connection } from "@solana/web3.js";
import { publishToIQLabs } from "./iqlabs";
import { attachContentRecord } from "./sns";
import type { PublishWallet, Site, StorageRef } from "./types";

const MOCK = process.env.NEXT_PUBLIC_IQ_MOCK === "1";

export interface PublishResult {
  storage: StorageRef;
  /** Tx that updated the SNS record, when a domain was attached. */
  domainTx?: string;
}

export async function publishSite(args: {
  site: Site;
  wallet: PublishWallet;
  connection: Connection;
  /** e.g. "alice.sol". Omit to publish without attaching a domain yet. */
  domain?: string;
  onProgress?: (percent: number) => void;
}): Promise<PublishResult> {
  const storage = await publishToIQLabs(args);

  let domainTx: string | undefined;
  if (args.domain) {
    domainTx = MOCK
      ? "MOCK_RECORD_TX"
      : await attachContentRecord(args.connection, args.domain, storage.pointer, args.wallet);
  }

  return { storage, domainTx };
}
