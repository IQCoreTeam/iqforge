import Link from "next/link";
import { ConnectButton } from "@/components/wallet/connect-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary font-mono text-primary-foreground">IQ</span>
          <span className="text-glow">Forge</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link href="/templates" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Templates
          </Link>
          <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            My sites
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
