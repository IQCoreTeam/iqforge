import Link from "next/link";
import { ArrowRight, Database, Globe, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { TemplateCard } from "@/components/template-card";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";

const STEPS = [
  { icon: Zap, title: "Pick a template", body: "18 starting points — link-in-bio, token launch, NFT mint, portfolio, blog." },
  { icon: Database, title: "Store it on-chain", body: "Your page is written to Solana with IQLabs. No servers, no hosting bill, no takedowns." },
  { icon: Globe, title: "Point a .sol domain", body: "Attach a Solana name and you're live at name.sol, name.sol.site, and the gateway." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="py-20 text-center sm:py-28">
          <span className="mb-6 inline-block rounded-full border border-primary/40 px-4 py-1.5 text-xs uppercase tracking-[0.16em] text-primary">
            fully onchain websites
          </span>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Build a website that <span className="text-primary text-glow">lives forever</span> on Solana.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            No code, no servers. Pick a template, make it yours, and publish it on-chain under your own .sol domain.
          </p>
          <div className="mt-9 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/templates">
                Browse templates <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">My sites</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </section>

        <section className="pb-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Start from a template</h2>
            <Link href="/templates" className="text-sm text-primary hover:underline">
              See all 18 →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.slice(0, 4).map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
