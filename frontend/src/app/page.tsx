'use client';

import { Button, Logo, ThemeToggle } from '@keel/ui';
import { Blocks, Code2, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-border/40 bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="text-primary h-10 w-10" />
            <span>Keel</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/components">
              <Button variant="ghost" size="sm">
                Components
              </Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" size="sm">
                Demo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-14">
        <div className="from-primary/10 via-background to-background absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-2 sm:pb-32">
          <div className="mx-auto max-w-2xl text-center">
            <Logo className="animate-float mx-auto mb-1 h-96 w-96 object-contain" />
            <div className="border-border bg-muted/50 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Sparkles className="text-primary h-3.5 w-3.5" />
              AI App Template
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Skip the setup.
              <span className="text-primary block">Build the future.</span>
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              A production-ready template with Next.js, Go API, shared components, and type-safe API
              client. Clone and start building.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/users">
                <Button size="lg">View Demo</Button>
              </Link>
              <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-sm">
                <span className="text-muted-foreground">$</span>
                <code>bun run setup && bun run dev</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-border bg-muted/30 border-t">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Code2 className="h-5 w-5" />}
              title="Next.js 14"
              description="App Router, TypeScript, TailwindCSS"
            />
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Go Backend"
              description="Chi router, SQLite, OpenAPI"
            />
            <FeatureCard
              icon={<Blocks className="h-5 w-5" />}
              title="Shared UI"
              description="20+ components, forms, tables"
            />
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Type-Safe"
              description="Generated API client from spec"
            />
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="border-border border-t">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-8 text-center text-2xl font-semibold">Project Structure</h2>
          <div className="border-border bg-card mx-auto max-w-md overflow-hidden rounded-xl border">
            <div className="border-border bg-muted/50 border-b px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
            </div>
            <pre className="text-muted-foreground overflow-x-auto p-4 font-mono text-sm leading-relaxed">
              {`keel/
├── frontend/      → Next.js app
├── backend/       → Go API
└── packages/
    ├── ui/        → Components
    └── api-client → Generated types`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-border bg-muted/30 border-t">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">Ready to build?</h2>
          <p className="text-muted-foreground mt-2">
            Check out the demo to see the patterns in action.
          </p>
          <div className="mt-6">
            <Link href="/users">
              <Button size="lg">View Users Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>Keel Template</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-border bg-card hover:border-primary/50 hover:bg-muted/50 group rounded-xl border p-5 transition-colors">
      <div className="bg-primary/10 text-primary mb-3 inline-flex rounded-lg p-2">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}
