// components/site-header.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

// Wallet button is client-only; load without SSR to avoid hydration mismatch.
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false },
);

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight">
            IQ<span className="text-primary">Forge</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
            onchain sites
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/profile" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Profile
          </Link>
          <Link href="/templates" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Templates
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            My Sites
          </Link>
          <WalletMultiButton />
        </nav>
      </div>
    </header>
  );
}
