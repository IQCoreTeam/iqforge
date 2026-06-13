import type { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

/**
 * The signer shape the IQLabs SDK and bonfida accept. Structurally identical to
 * the IQLabs SDK's `WalletSigner` and to a connected `@solana/wallet-adapter`
 * wallet — so a connected wallet is passed straight through, no adapter needed.
 */
export interface WalletSigner {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
}
