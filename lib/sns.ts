// lib/sns.ts
//
// SNS = Solana Name Service (Bonfida). The owned-domain lookup below uses the
// real `@bonfida/spl-name-service` API. Registration and writing the content
// record are sketched with TODOs — confirm against the current SDK version
// before shipping, the registration flow in particular changes between versions.
//
//   npm i @bonfida/spl-name-service @solana/web3.js

import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAllDomains,
  reverseLookup,
  resolve,
} from "@bonfida/spl-name-service";

export interface OwnedDomain {
  /** Bare name, e.g. "alice" (without ".sol"). */
  name: string;
  /** Full name with suffix, e.g. "alice.sol". */
  fqdn: string;
  /** Domain account address. */
  address: string;
}

/** List every .sol domain owned by a wallet. */
export async function getOwnedDomains(
  connection: Connection,
  owner: PublicKey,
): Promise<OwnedDomain[]> {
  const keys = await getAllDomains(connection, owner);
  const names = await Promise.all(
    keys.map(async (key) => {
      try {
        const name = await reverseLookup(connection, key);
        return { name, fqdn: `${name}.sol`, address: key.toBase58() };
      } catch {
        return { name: key.toBase58(), fqdn: `${key.toBase58()}.sol`, address: key.toBase58() };
      }
    }),
  );
  return names;
}

/** Resolve a domain to the wallet that currently controls it. */
export async function resolveOwner(
  connection: Connection,
  domain: string,
): Promise<string | null> {
  try {
    const owner = await resolve(connection, domain.replace(/\.sol$/i, ""));
    return owner.toBase58();
  } catch {
    return null;
  }
}

/**
 * Point a domain at a published site.
 * CONFIRMED MODEL (from iq-gateway): the .sol domain carries ONE URL record;
 * the gateway resolves domains to on-chain IQ manifests at request time. So
 * this writes a URL record containing the manifest pointer (or the gateway
 * /site/{manifestSig} URL — confirm exact record value with the IQ team).
 */
export async function attachContentRecord(
  connection: Connection,
  domain: string,
  pointer: string,
  wallet: unknown,
): Promise<string> {
  // TODO(sns): use the Records v2 API to write a custom/URL record holding the
  // IQLabs pointer, then send+sign with the wallet. Pseudocode:
  //
  //   const ix = await createRecordV2Instruction(...);
  //   const tx = new Transaction().add(ix);
  //   return await wallet.sendTransaction(tx, connection);

  void connection; void domain; void pointer; void wallet;
  throw new Error("attachContentRecord not implemented — see lib/sns.ts TODO.");
}

/** Kick off registration for a brand-new domain (no domains yet path). */
export async function registerDomain(
  connection: Connection,
  name: string,
  buyer: PublicKey,
  wallet: unknown,
): Promise<string> {
  // TODO(sns): registration requires a registrar instruction + payment in SOL/USDC.
  // Confirm the current `registerDomainNameV2` signature before wiring.
  void connection; void name; void buyer; void wallet;
  throw new Error("registerDomain not implemented — see lib/sns.ts TODO.");
}
