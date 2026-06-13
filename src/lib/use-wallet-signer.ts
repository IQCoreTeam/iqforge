"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import type { WalletSigner } from "./types-sdk";

/**
 * The connected wallet as a signer the IQLabs SDK and bonfida accept directly,
 * plus the shared Connection. `signer` is null until a wallet is connected.
 */
export function useWalletSigner(): { connection: Connection; signer: WalletSigner | null; address: string | null } {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const signer =
    publicKey && signTransaction && signAllTransactions
      ? ({ publicKey, signTransaction, signAllTransactions } as WalletSigner)
      : null;

  return { connection, signer, address: publicKey ? publicKey.toBase58() : null };
}
