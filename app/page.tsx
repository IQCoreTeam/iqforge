// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative mx-auto max-w-3xl px-6 py-28 text-center">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--iq-green) / 0.12), transparent 60%)" }}
      />
      <p className="font-mono text-xs uppercase tracking-widest text-primary">SNS × IQLabs</p>
      <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
        Build a website that
        <br />
        <span className="text-primary text-glow">lives forever</span>.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        Pick a template, make it yours, attach a .sol domain, and publish permanently
        onchain. No code, no servers, no link rot.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/templates"
          className="rounded-xl bg-primary px-7 py-3.5 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Browse templates
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-border px-7 py-3.5 font-medium transition-colors hover:border-primary"
        >
          My Sites
        </Link>
      </div>
    </main>
  );
}
