// lib/profile.ts
//
// Profile system — distinct from the website builder.
// A profile is wallet-keyed identity. We write it exactly the way iq-wide-web
// does: the ProfileMeta JSON (name/bio/profilePicture/socials) goes through
// codeIn, and the resulting txId is linked onto the caller's user PDA under the
// shared "iqprofile-root" DbRoot. iq-wide-web resolves the same wallet → this
// metadata, so the profile renders identically everywhere — one source of truth.
//
// We additionally tuck a react95 `theme` onto the JSON. iq-wide-web ignores
// unknown keys (it applies its own global theme), so the field round-trips
// harmlessly while any react95-aware renderer can pick it up.

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  type VersionedTransaction,
} from "@solana/web3.js";
import iqlabs from "@iqlabs-official/solana-sdk";

// IQDB root that holds the user-metadata table iq-wide-web reads from, and the
// IQLabs program id. Both copied verbatim from iq-wide-web/src/lib/constants.ts
// so IQForge writes into the exact same profile system. Override via env if a
// future deployment moves them.
export const PROFILE_ROOT_ID = process.env.NEXT_PUBLIC_IQ_ROOT_ID || "iqprofile-root";
export const IQ_PROGRAM_ID =
  process.env.NEXT_PUBLIC_IQ_PROGRAM_ID || "9KLLchQVJpGkw4jPuUmnvqESdR7mtNCYr3qS4iQLabs";

// --- Types ---

/** Social platforms iq-wide-web renders. Keys must match its SocialKey union
 *  (iq-wide-web/src/lib/profile/socials.ts) or the values won't render there. */
export type SocialKey =
  | "twitter"
  | "github"
  | "website"
  | "linkedin"
  | "telegram"
  | "discord"
  | "email";

export const SOCIAL_PLATFORMS: { key: SocialKey; label: string; placeholder: string }[] = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/you" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you" },
  { key: "website", label: "Website", placeholder: "https://example.com" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/you" },
  { key: "discord", label: "Discord", placeholder: "you#1234" },
  { key: "email", label: "Email", placeholder: "you@example.com" },
];

/** Editable profile fields. Shape mirrors iq-wide-web's ProfileMeta so what we
 *  write is exactly what every IQ surface reads — `name`, not `displayName`;
 *  `socials` keyed by platform, not free-form links. */
export interface ProfileData {
  name: string;
  bio: string;
  profilePicture?: string; // URL or on-chain txId
  socials: Partial<Record<SocialKey, string>>;
}

/** Flat color-token object — matches react95's Theme shape exactly. */
export interface ProfileTheme {
  name: string;
  anchor: string;
  anchorVisited: string;
  borderDark: string;
  borderDarkest: string;
  borderLight: string;
  borderLightest: string;
  canvas: string;
  canvasText: string;
  canvasTextDisabled: string;
  canvasTextInvert: string;
  checkmark: string;
  desktopBackground: string;
  flatDark: string;
  flatLight: string;
  focusSecondary: string;
  headerBackground: string;
  headerText: string;
  hoverBackground: string;
  material: string;
  materialDark: string;
  materialText: string;
  progress: string;
  tooltip: string;
}

/** What actually gets serialized to chain and linked onto the user PDA.
 *  The base fields (name/bio/profilePicture/socials) are iq-wide-web's
 *  ProfileMeta and render identically there. `theme` is an additive field —
 *  iq-wide-web's JSON.parse ignores unknown keys, so it round-trips harmlessly
 *  while any react95-aware renderer (IQForge, future IQ surfaces) can apply it. */
export interface ProfileMeta extends ProfileData {
  theme?: ProfileTheme;
}

// --- Built-in themes ---

export const PROFILE_THEMES: ProfileTheme[] = [
  {
    name: "IQ Dark",
    anchor: "#3DFE7E",
    anchorVisited: "#2CC060",
    borderDark: "#1A2B1E",
    borderDarkest: "#08090A",
    borderLight: "#2A3B2E",
    borderLightest: "#3A4B3E",
    canvas: "#08090A",
    canvasText: "#F4FFF7",
    canvasTextDisabled: "#8A938C",
    canvasTextInvert: "#08090A",
    checkmark: "#3DFE7E",
    desktopBackground: "#0D1117",
    flatDark: "#1A2B1E",
    flatLight: "#2A3B2E",
    focusSecondary: "#3DFE7E",
    headerBackground: "#3DFE7E",
    headerText: "#08090A",
    hoverBackground: "#3DFE7E",
    material: "#111827",
    materialDark: "#0D1117",
    materialText: "#F4FFF7",
    progress: "#3DFE7E",
    tooltip: "#1A2B1E",
  },
  {
    name: "Windows 95",
    anchor: "#1034a6",
    anchorVisited: "#440381",
    borderDark: "#848584",
    borderDarkest: "#0a0a0a",
    borderLight: "#dfdfdf",
    borderLightest: "#fefefe",
    canvas: "#ffffff",
    canvasText: "#0a0a0a",
    canvasTextDisabled: "#848584",
    canvasTextInvert: "#fefefe",
    checkmark: "#0a0a0a",
    desktopBackground: "#008080",
    flatDark: "#9e9e9e",
    flatLight: "#d8d8d8",
    focusSecondary: "#fefe03",
    headerBackground: "#060084",
    headerText: "#fefefe",
    hoverBackground: "#060084",
    material: "#c6c6c6",
    materialDark: "#9a9e9c",
    materialText: "#0a0a0a",
    progress: "#060084",
    tooltip: "#fefbcc",
  },
  {
    name: "Midnight",
    anchor: "#818CF8",
    anchorVisited: "#6366F1",
    borderDark: "#1E1B4B",
    borderDarkest: "#0F0E2C",
    borderLight: "#312E81",
    borderLightest: "#4338CA",
    canvas: "#0F0E2C",
    canvasText: "#E0E7FF",
    canvasTextDisabled: "#6366F1",
    canvasTextInvert: "#0F0E2C",
    checkmark: "#818CF8",
    desktopBackground: "#1E1B4B",
    flatDark: "#1E1B4B",
    flatLight: "#312E81",
    focusSecondary: "#FBBF24",
    headerBackground: "#4338CA",
    headerText: "#E0E7FF",
    hoverBackground: "#4338CA",
    material: "#1E1B4B",
    materialDark: "#0F0E2C",
    materialText: "#E0E7FF",
    progress: "#818CF8",
    tooltip: "#1E1B4B",
  },
  {
    name: "Sakura",
    anchor: "#BE185D",
    anchorVisited: "#9D174D",
    borderDark: "#F9A8D4",
    borderDarkest: "#FBCFE8",
    borderLight: "#FCE7F3",
    borderLightest: "#FDF2F8",
    canvas: "#FFF1F2",
    canvasText: "#1F2937",
    canvasTextDisabled: "#9CA3AF",
    canvasTextInvert: "#FFF1F2",
    checkmark: "#BE185D",
    desktopBackground: "#FCE7F3",
    flatDark: "#F9A8D4",
    flatLight: "#FCE7F3",
    focusSecondary: "#F472B6",
    headerBackground: "#BE185D",
    headerText: "#FFF1F2",
    hoverBackground: "#9D174D",
    material: "#FEF2F2",
    materialDark: "#FCE7F3",
    materialText: "#1F2937",
    progress: "#F472B6",
    tooltip: "#FCE7F3",
  },
  {
    name: "Hacker",
    anchor: "#00FF41",
    anchorVisited: "#008F11",
    borderDark: "#003B00",
    borderDarkest: "#000800",
    borderLight: "#005500",
    borderLightest: "#007700",
    canvas: "#000800",
    canvasText: "#00FF41",
    canvasTextDisabled: "#008F11",
    canvasTextInvert: "#000800",
    checkmark: "#00FF41",
    desktopBackground: "#001400",
    flatDark: "#001E00",
    flatLight: "#003B00",
    focusSecondary: "#00FF41",
    headerBackground: "#003B00",
    headerText: "#00FF41",
    hoverBackground: "#005500",
    material: "#001400",
    materialDark: "#000800",
    materialText: "#00FF41",
    progress: "#00FF41",
    tooltip: "#001400",
  },
];

export const DEFAULT_PROFILE_DATA: ProfileData = {
  name: "Your Name",
  bio: "Builder. Creator. Permanently onchain.",
  profilePicture: "",
  socials: {},
};

// --- Publish ---

export interface ProfilePublishInput {
  profile: ProfileMeta;
  // Wallet-adapter's useWallet() shape — generic signers the SDK accepts directly.
  wallet: {
    publicKey: PublicKey | null;
    signTransaction?: <T extends Transaction | VersionedTransaction>(tx: T) => Promise<T>;
    signAllTransactions?: <T extends Transaction | VersionedTransaction>(txs: T[]) => Promise<T[]>;
  };
  connection: Connection;
  onProgress?: (step: string, percent: number) => void;
}

export interface ProfilePublishResult {
  /** The codeIn txId now linked on the user PDA. */
  txId: string;
  pointer: string;
}

/**
 * Writes the profile to chain exactly the way iq-wide-web does
 * (src/lib/profile/use-profile-editor.ts):
 *   1. ensure the iqprofile-root DbRoot exists,
 *   2. codeIn(JSON) → txId holding the profile JSON,
 *   3. updateUserMetadata(txId) → link it onto the caller's user PDA.
 * iq-wide-web's useProfile then resolves the same wallet → this metadata, so the
 * profile renders identically on every IQ surface. One source of truth.
 */
export async function publishProfile(input: ProfilePublishInput): Promise<ProfilePublishResult> {
  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    await new Promise((r) => setTimeout(r, 600));
    return { txId: "MOCK_TXID", pointer: `iq:mock:profile:${input.profile.name}` };
  }

  const { profile, wallet, connection, onProgress } = input;
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    throw new Error("Wallet not connected");
  }
  const signer = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  const programId = new PublicKey(IQ_PROGRAM_ID);
  const dbRootSeed = iqlabs.utils.toSeedBytes(PROFILE_ROOT_ID);
  const dbRoot = iqlabs.contract.getDbRootPda(dbRootSeed, programId);

  // Lazily initialize the profile DbRoot on first-ever write. The "already in
  // use" race (another client created it concurrently) is treated as success.
  onProgress?.("Preparing profile root…", 20);
  if (!(await connection.getAccountInfo(dbRoot))) {
    try {
      const builder = iqlabs.contract.createInstructionBuilder();
      const ix = iqlabs.contract.initializeDbRootInstruction(
        builder,
        { db_root: dbRoot, signer: wallet.publicKey, system_program: SystemProgram.programId },
        { db_root_id: dbRootSeed },
      );
      const tx = new Transaction().add(ix);
      tx.feePayer = wallet.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const signed = await signer.signTransaction(tx);
      await connection.sendRawTransaction(signed.serialize());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/already in use|AlreadyInUse/i.test(msg)) throw e;
    }
  }

  onProgress?.("Writing profile on-chain…", 55);
  const txId = await iqlabs.writer.codeIn(
    { connection, signer },
    [JSON.stringify(profile)],
    "profile-metadata",
    0,
  );
  if (!txId) throw new Error("codeIn returned no txId");

  onProgress?.("Linking to your wallet…", 85);
  await iqlabs.writer.updateUserMetadata(connection, signer, dbRootSeed, txId);

  onProgress?.("Done!", 100);
  return { txId, pointer: txId };
}
