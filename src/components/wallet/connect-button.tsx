"use client";

import dynamic from "next/dynamic";

// The adapter's button must be client-only (it touches window on mount).
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false },
);

export function ConnectButton() {
  return <WalletMultiButton style={{ height: 40, borderRadius: 8, background: "hsl(142 92% 52%)", color: "#04130a", fontWeight: 600 }} />;
}
