// lib/sns.ts
//
// SNS (Solana Name Service / Bonfida) integration.
//
// VERIFIED against the gateway's own resolver (iq-gateway/src/chain/solana/sns.ts):
// it reads the domain's V2 `Url` (then `TXT`) record and accepts either a bare
// manifest tx signature or any URL containing /site/{sig}. We write the BARE
// SIGNATURE — gateway-agnostic, so the site isn't tied to any one gateway host.

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  Record,
  getAllDomains,
  getRecordV2,
  reverseLookup,
  resolve,
  createRecordV2Instruction,
  updateRecordV2Instruction,
} from "@bonfida/spl-name-service";
import type { PublishWallet } from "./types";

export interface OwnedDomain {
  /** Bare name, e.g. "alice" (without ".sol"). */
  name: string;
  /** Full name with suffix, e.g. "alice.sol". */
  fqdn: string;
  /** Domain account address. */
  address: string;
}

const bare = (domain: string) => domain.replace(/\.sol$/i, "");

/** List every .sol domain owned by a wallet. */
export async function getOwnedDomains(
  connection: Connection,
  owner: PublicKey,
): Promise<OwnedDomain[]> {
  const keys = await getAllDomains(connection, owner);
  return Promise.all(
    keys.map(async (key) => {
      try {
        const name = await reverseLookup(connection, key);
        return { name, fqdn: `${name}.sol`, address: key.toBase58() };
      } catch {
        return { name: key.toBase58(), fqdn: `${key.toBase58()}.sol`, address: key.toBase58() };
      }
    }),
  );
}

/** Resolve a domain to the wallet that currently controls it. */
export async function resolveOwner(
  connection: Connection,
  domain: string,
): Promise<string | null> {
  try {
    const owner = await resolve(connection, bare(domain));
    return owner.toBase58();
  } catch {
    return null;
  }
}

/**
 * Point a .sol domain at a published site: writes the manifest signature into
 * the domain's V2 Url record (creating or updating as needed). After this,
 * any IQ gateway resolves the domain straight to the on-chain site.
 * Returns the tx signature.
 */
export async function attachContentRecord(
  connection: Connection,
  domain: string,
  manifestSig: string,
  wallet: PublishWallet,
): Promise<string> {
  if (!wallet.publicKey) throw new Error("Connect a wallet first.");
  const name = bare(domain);
  const owner = wallet.publicKey;

  let exists = false;
  try {
    const existing = await getRecordV2(connection, name, Record.Url);
    exists = !!existing?.retrievedRecord;
  } catch {
    exists = false; // no record yet
  }

  const ix = exists
    ? updateRecordV2Instruction(name, Record.Url, manifestSig, owner, owner)
    : createRecordV2Instruction(name, Record.Url, manifestSig, owner, owner);

  const tx = new Transaction().add(ix);
  tx.feePayer = owner;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const sig = await wallet.sendTransaction(tx, connection);
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

/**
 * Register a brand-new .sol domain.
 * Bonfida's registerDomainNameV2 exists, but requires a payment token account
 * (USDC/SOL ATA) and price handling — deliberately NOT wired yet to avoid
 * shipping an untested payment flow. Users can register at sns.id and the
 * domain appears here automatically.
 */
export async function registerDomain(): Promise<never> {
  throw new Error(
    "In-app registration isn't enabled yet — register at sns.id, then refresh this page and your domain will appear.",
  );
}
