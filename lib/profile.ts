// lib/profile.ts
//
// Profile system — distinct from the website builder.
// A profile is wallet-keyed identity: { data, theme } committed on-chain via
// git-sdk to a fixed "iq-profile" repo. iq-wide-web and every IQ surface read
// it from there — one source of truth, renders identically everywhere.
//
// Theme format: react95's flat color-token shape. Any react95-compatible
// renderer can apply it without knowing anything about IQForge.

import type { Connection } from "@solana/web3.js";
import { GitClient, readOwnerRepos } from "@iqlabs-official/git-sdk/browser";

// --- Types ---

export interface ProfileLink {
  label: string;
  url: string;
}

export interface ProfileData {
  displayName: string;
  handle: string;
  bio: string;
  avatar?: string;
  links: ProfileLink[];
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

/** The full profile stored on-chain as iqprofile.json. */
export interface IQProfile {
  version: 1;
  format: "react95";
  data: ProfileData;
  theme: ProfileTheme;
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
  displayName: "Your Name",
  handle: "@yourhandle",
  bio: "Builder. Creator. Permanently onchain.",
  avatar: "",
  links: [
    { label: "Twitter / X", url: "https://x.com/" },
    { label: "GitHub", url: "https://github.com/" },
  ],
};

// --- Publish ---

export interface ProfilePublishInput {
  profile: IQProfile;
  wallet: {
    publicKey: { toBase58(): string };
    signTransaction: (tx: unknown) => Promise<unknown>;
    signAllTransactions?: (txs: unknown[]) => Promise<unknown[]>;
  };
  connection: Connection;
  onProgress?: (step: string, percent: number) => void;
}

export interface ProfilePublishResult {
  commitId: string;
  pointer: string;
}

const PROFILE_REPO_NAME = "iq-profile";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/**
 * Writes the profile on-chain via git-sdk.
 * Commits iqprofile.json to the wallet owner's "iq-profile" repo.
 * iq-wide-web reads it from there via readPagesProfile().
 */
export async function publishProfile(input: ProfilePublishInput): Promise<ProfilePublishResult> {
  if (process.env.NEXT_PUBLIC_IQ_MOCK === "1") {
    await new Promise((r) => setTimeout(r, 600));
    return {
      commitId: "MOCK_COMMIT",
      pointer: `iq:mock:profile:${input.profile.data.handle}`,
    };
  }

  const { profile, wallet, connection, onProgress } = input;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signer = wallet as any;
  const client = new GitClient({ connection, signer });

  onProgress?.("Checking profile repo…", 20);
  const ownerRepos = await readOwnerRepos(wallet.publicKey.toBase58());
  const repoExists = ownerRepos.some((r) => r.name === PROFILE_REPO_NAME);

  if (!repoExists) {
    onProgress?.("Creating profile repo…", 35);
    await client.createRepo({
      name: PROFILE_REPO_NAME,
      description: "IQ on-chain profile",
      isPublic: true,
      timestamp: Date.now(),
    });
  }

  onProgress?.("Writing profile on-chain…", 60);
  const commit = await client.commit(PROFILE_REPO_NAME, "update profile", {
    "iqprofile.json": utf8ToBase64(JSON.stringify(profile, null, 2)),
  });

  onProgress?.("Done!", 100);

  return { commitId: commit.id, pointer: commit.id };
}
