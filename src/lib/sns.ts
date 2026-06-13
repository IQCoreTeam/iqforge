// SNS layer. Reads/writes the records the iq-gateway resolver consumes.
//
// Publish writes Record.Url = "<gateway>/site/<manifestSig>/index.html".
// The gateway's resolveDomainToSig() reads Url (+ TXT fallback) and extracts the
// sig — so this is the record that lights up Brave-native .sol, *.sol.site, and
// gateway.iqlabs.dev/sns/<name> simultaneously (see iq-gateway/HOW-IT-WORKS.md).
//
// We read the URL record by slicing header.contentLength bytes from raw account
// data — the SDK's deserializedContent truncates URLs (documented bug the gateway
// works around the same way).

import { Connection, PublicKey, Transaction, type TransactionInstruction } from "@solana/web3.js";
import {
  Record,
  getAllDomains,
  reverseLookupBatch,
  getRecordV2,
  getDomainKeySync,
  createRecordV2Instruction,
  updateRecordV2Instruction,
} from "@bonfida/spl-name-service";
import type { WalletSigner } from "./types-sdk";

/** Bare label (no ".sol"); bonfida helpers want the label without the TLD. */
function label(domain: string): string {
  return domain.replace(/\.sol$/i, "");
}

/** All .sol domains owned by a wallet, as "name.sol" strings. */
export async function listDomains(connection: Connection, owner: PublicKey): Promise<string[]> {
  const keys = await getAllDomains(connection, owner);
  if (keys.length === 0) return [];
  const names = await reverseLookupBatch(connection, keys);
  return names.filter((n): n is string => Boolean(n)).map((n) => `${n}.sol`);
}

/** Read the current URL record (raw-slice to avoid the SDK URL-truncation bug). */
export async function readSiteRecord(connection: Connection, domain: string): Promise<string | null> {
  try {
    const res = await getRecordV2(connection, label(domain), Record.Url);
    const data = res?.retrievedRecord?.data;
    const cl = res?.retrievedRecord?.header?.contentLength;
    if (!data || typeof cl !== "number" || cl <= 0 || cl > data.length) return null;
    return new TextDecoder().decode(data.subarray(data.length - cl)).trim() || null;
  } catch {
    return null; // record/domain missing -> treat as unset
  }
}

/** True if the URL record exists at all (decides create vs update). */
async function urlRecordExists(connection: Connection, domain: string): Promise<boolean> {
  try {
    const res = await getRecordV2(connection, label(domain), Record.Url);
    return Boolean(res?.retrievedRecord?.data);
  } catch {
    return false;
  }
}

/** Sign + send a set of instructions with the connected wallet. Reused by writes. */
async function sendTx(
  connection: Connection,
  signer: WalletSigner,
  ixs: TransactionInstruction[],
): Promise<string> {
  const tx = new Transaction().add(...ixs);
  tx.feePayer = signer.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
  const signed = await signer.signTransaction(tx);
  const sig = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

/**
 * Point a .sol domain at a published manifest by writing the URL record.
 * Creates the record on first publish, updates it on re-publish. owner == payer
 * == the connected wallet (which must own the domain).
 */
export async function setSiteRecord(
  connection: Connection,
  signer: WalletSigner,
  domain: string,
  value: string,
): Promise<string> {
  const exists = await urlRecordExists(connection, domain);
  const build = exists ? updateRecordV2Instruction : createRecordV2Instruction;
  const ix = build(label(domain), Record.Url, value, signer.publicKey, signer.publicKey);
  return sendTx(connection, signer, [ix]);
}

/** Whether a .sol label is unregistered (free to claim). */
export async function domainAvailable(connection: Connection, domain: string): Promise<boolean> {
  try {
    const { pubkey } = getDomainKeySync(label(domain));
    const info = await connection.getAccountInfo(pubkey);
    return info === null;
  } catch {
    return false;
  }
}

/** sns.id deep link for registering / managing a domain (matches the tutorial flow). */
export function snsManageUrl(domain: string): string {
  return `https://sns.id/domain/${label(domain)}`;
}
export function snsSearchUrl(query: string): string {
  return `https://sns.id/search?search=${encodeURIComponent(label(query))}`;
}
