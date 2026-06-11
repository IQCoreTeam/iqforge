// lib/profile.ts
//
// PROFILE half of IQForge (ZO_PLAN §1). A profile is NETWORK IDENTITY — it
// does not go through the website/template pipeline at all. It's written into
// the same shared profile system iq-wide-web reads (one source of truth,
// renders identically on every IQ surface).
//
// Verified from iq-wide-web/src/lib/profile/* :
//   • Profile JSON lives on the user PDA's metadata segment under the global
//     "iqprofile-root" DbRoot. Small JSON inline; larger JSON via
//     codeIn → txId, with the PDA holding the txId.
//   • Write = codeIn(json, "profile-metadata") → updateUserMetadata(txId).
//   • Read  = user PDA account → metadata string → JSON, or txId resolved
//     through the gateway /data/{txId} route.
//
// The contract EXTENDS iww's ProfileMeta with Zo's theme field:
//     profile = { ...profileData, theme: { format, tokens } }
// `format` names the theme library; react95 is the first-class one. Unknown
// keys are ignored by existing readers, so this is backward-compatible.

import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { codeIn, updateUserMetadata } from "@iqlabs-official/solana-sdk/writer";
import {
  createInstructionBuilder,
  getDbRootPda,
  getUserPda,
  initializeDbRootInstruction,
  PROGRAM_ID,
} from "@iqlabs-official/solana-sdk/contract";
import { toSeedBytes } from "@iqlabs-official/solana-sdk/utils";
import { fetchTxData } from "./gateway";
import type { PublishWallet } from "./types";

/** Same global profile root iq-wide-web uses. */
export const PROFILE_ROOT_ID = "iqprofile-root";

export type SocialKey =
  | "twitter" | "github" | "website" | "linkedin" | "telegram" | "discord" | "email";

export const SOCIAL_KEYS: { key: SocialKey; label: string; placeholder: string }[] = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/you" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "website", label: "Website", placeholder: "https://you.xyz" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/you" },
  { key: "discord", label: "Discord", placeholder: "you#0000 or invite link" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
];

/** react95-format theme: a flat record of named color tokens (original.ts shape). */
export interface React95Tokens {
  name: string;
  anchor: string; anchorVisited: string;
  borderDark: string; borderDarkest: string; borderLight: string; borderLightest: string;
  canvas: string; canvasText: string; canvasTextDisabled: string; canvasTextInvert: string;
  checkmark: string; desktopBackground: string;
  flatDark: string; flatLight: string; focusSecondary: string;
  headerBackground: string; headerText: string; hoverBackground: string;
  material: string; materialDark: string; materialText: string;
  progress: string; tooltip: string;
}

/** Zo's pluggable contract: format names the library, tokens are its native shape. */
export interface ProfileTheme {
  format: "react95"; // future: other theme-object libraries
  tokens: React95Tokens;
}

/** iww's ProfileMeta + theme. Existing readers ignore the extra key. */
export interface IQProfile {
  name: string;
  bio?: string;
  profilePicture?: string; // URL, data URL, or on-chain txId
  socials?: Partial<Record<SocialKey, string>>;
  theme?: ProfileTheme;
}

// ── First-class IQ themes (react95 token shape) ──────────────────────────────
const base = {
  anchorVisited: "#440381", checkmark: "#0a0a0a",
  flatDark: "#9e9e9e", flatLight: "#d8d8d8", focusSecondary: "#fefe03",
  canvasTextDisabled: "#848584", canvasTextInvert: "#fefefe",
};

export const IQ_THEMES: React95Tokens[] = [
  {
    ...base, name: "iq-terminal",
    anchor: "#3DFE7E", anchorVisited: "#2bb95c",
    borderDark: "#1d2b22", borderDarkest: "#000000", borderLight: "#2f4a39", borderLightest: "#3DFE7E",
    canvas: "#08090A", canvasText: "#d8ffe6", canvasTextInvert: "#08090A",
    desktopBackground: "#03100a", checkmark: "#3DFE7E",
    headerBackground: "#0f3d22", headerText: "#3DFE7E", hoverBackground: "#0f3d22",
    material: "#0e1410", materialDark: "#090d0a", materialText: "#d8ffe6",
    progress: "#3DFE7E", tooltip: "#0f3d22",
  },
  {
    ...base, name: "original",
    anchor: "#1034a6",
    borderDark: "#848584", borderDarkest: "#0a0a0a", borderLight: "#dfdfdf", borderLightest: "#fefefe",
    canvas: "#ffffff", canvasText: "#0a0a0a",
    desktopBackground: "#008080",
    headerBackground: "#060084", headerText: "#fefefe", hoverBackground: "#060084",
    material: "#c6c6c6", materialDark: "#9a9e9c", materialText: "#0a0a0a",
    progress: "#060084", tooltip: "#fefbcc",
  },
  {
    ...base, name: "vapor",
    anchor: "#ff71ce", anchorVisited: "#b967ff",
    borderDark: "#5d3a6e", borderDarkest: "#1a0b22", borderLight: "#c79df2", borderLightest: "#fdf3ff",
    canvas: "#1d1030", canvasText: "#fdf3ff", canvasTextInvert: "#1d1030",
    desktopBackground: "#0e0618", checkmark: "#01cdfe",
    headerBackground: "#b967ff", headerText: "#1a0b22", hoverBackground: "#3a1f57",
    material: "#2a1745", materialDark: "#1d1030", materialText: "#fdf3ff",
    progress: "#01cdfe", tooltip: "#3a1f57",
  },
  {
    ...base, name: "paper",
    anchor: "#8a5a00",
    borderDark: "#b9ad95", borderDarkest: "#3d3527", borderLight: "#efe7d6", borderLightest: "#fffdf6",
    canvas: "#fffdf6", canvasText: "#2c261a",
    desktopBackground: "#d8c9a8",
    headerBackground: "#3d3527", headerText: "#fffdf6", hoverBackground: "#3d3527",
    material: "#efe7d6", materialDark: "#d8cdb4", materialText: "#2c261a",
    progress: "#8a5a00", tooltip: "#fff7da",
  },
];

export const DEFAULT_PROFILE: IQProfile = {
  name: "",
  bio: "",
  profilePicture: "",
  socials: {},
  theme: { format: "react95", tokens: IQ_THEMES[0] },
};

// ── Read ─────────────────────────────────────────────────────────────────────

/** User PDA layout: [8 disc][32 owner][u32 dataLen][data][u32 metaLen][meta].
 *  Parser ported from iq-wide-web's extractUserMetadata (Buffer-free). */
function extractUserMetadata(data: Uint8Array): string {
  try {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    let offset = 8 + 32;
    if (offset + 4 > data.length) return "";
    const dataLen = view.getUint32(offset, true);
    offset += 4 + dataLen;
    if (offset + 4 > data.length) return "";
    const metaLen = view.getUint32(offset, true);
    offset += 4;
    if (metaLen <= 0 || offset + metaLen > data.length) return "";
    return new TextDecoder().decode(data.subarray(offset, offset + metaLen)).trim();
  } catch {
    return "";
  }
}

const TXID_RE = /^[1-9A-HJ-NP-Za-km-z]{80,100}$/;

/** Load a wallet's profile from the shared system, or null if none yet. */
export async function readProfile(
  connection: Connection,
  owner: PublicKey,
): Promise<IQProfile | null> {
  const userPda = getUserPda(owner, PROGRAM_ID);
  const info = await connection.getAccountInfo(userPda);
  if (!info?.data) return null;
  const meta = extractUserMetadata(new Uint8Array(info.data));
  if (!meta) return null;
  const json = TXID_RE.test(meta) ? await fetchTxData(meta) : meta;
  if (!json) return null;
  try {
    const parsed = JSON.parse(json) as IQProfile;
    return parsed && typeof parsed.name === "string" ? parsed : null;
  } catch {
    return null;
  }
}

// ── Write ────────────────────────────────────────────────────────────────────

/**
 * Save a profile through the shared system (same flow as iq-wide-web):
 * ensure the global profile DbRoot exists → codeIn(profile JSON) →
 * updateUserMetadata(txId). Returns the profile JSON's txId.
 */
export async function writeProfile(
  connection: Connection,
  wallet: PublishWallet,
  profile: IQProfile,
): Promise<string> {
  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    await new Promise((r) => setTimeout(r, 700));
    return "MOCK_PROFILE_TX";
  }
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error("Connect a wallet that supports transaction signing.");
  }
  const signer = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  // One-time global root bootstrap — tolerated if it already exists (it does
  // on mainnet; this guard mirrors iq-wide-web exactly).
  const dbRootSeed = toSeedBytes(PROFILE_ROOT_ID);
  const dbRoot = getDbRootPda(dbRootSeed, PROGRAM_ID);
  if (!(await connection.getAccountInfo(dbRoot))) {
    try {
      const builder = createInstructionBuilder();
      const ix = initializeDbRootInstruction(
        builder,
        { db_root: dbRoot, signer: wallet.publicKey, system_program: SystemProgram.programId },
        { db_root_id: dbRootSeed },
      );
      const tx = new Transaction().add(ix);
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signed = await wallet.signTransaction(tx);
      await connection.sendRawTransaction(signed.serialize());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/already in use|AlreadyInUse/i.test(msg)) throw e;
    }
  }

  const txId = await codeIn(
    { connection, signer },
    [JSON.stringify(profile)],
    "profile-metadata",
    0,
  );
  if (!txId) throw new Error("Profile upload returned no transaction id.");
  await updateUserMetadata(connection, signer, dbRootSeed, txId);
  return txId;
}
