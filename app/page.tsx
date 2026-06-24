import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative mx-auto max-w-4xl px-6 py-24">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--iq-green) / 0.12), transparent 60%)" }}
      />

      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">SNS × IQLabs</p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
          Build things that
          <br />
          <span className="text-primary text-glow">live forever</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Publish your identity and your sites permanently onchain. No code, no servers,
          no link rot. Attach a .sol domain and you&apos;re done.
        </p>
      </div>

      {/* Two paths */}
      <div className="mt-16 grid gap-5 sm:grid-cols-2">
        <PathCard
          href="/profile"
          badge="Identity"
          title="Build a Profile"
          description="Your permanent on-chain identity. Pick a theme, fill in your details, and publish once — renders identically on every IQ surface."
          cta="Create profile →"
          accent="#3DFE7E"
        />
        <PathCard
          href="/templates"
          badge="Website"
          title="Build a Website"
          description="Pick a template, make it yours, and publish a full page on-chain via IQ Pages. Attach a .sol domain and it lives forever."
          cta="Browse templates →"
          accent="#818CF8"
        />
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Already published something?{" "}
        <Link href="/dashboard" className="font-medium text-primary hover:underline">
          View My Sites →
        </Link>
      </p>
    </main>
  );
}

function PathCard({
  href,
  badge,
  title,
  description,
  cta,
  accent,
}: {
  href: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/60 hover:glow"
    >
      <span
        className="mb-4 inline-block self-start rounded-full px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
        style={{ background: `${accent}26`, color: accent }}
      >
        {badge}
      </span>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-6 font-medium" style={{ color: accent }}>
        {cta}
      </span>
    </Link>
  );
}
