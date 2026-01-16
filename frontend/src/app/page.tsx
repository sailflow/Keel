'use client';

import { Button, Logo, ThemeToggle } from '@keel/ui';
import { Blocks, Code2, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo className="h-10 w-10 text-primary" />
            <span>Keel</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/components">
              <Button variant="ghost" size="sm">Components</Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" size="sm">Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="mx-auto max-w-5xl px-6 pt-2 pb-24 sm:pb-32">
          <div className="mx-auto max-w-2xl text-center">
            <Logo className="mx-auto mb-1 h-96 w-96 animate-float object-contain" />
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI App Template
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Skip the setup.
              <span className="block text-primary">Build the future.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              A production-ready template with Next.js, Go API, shared components,
              and type-safe API client. Clone and start building.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/users">
                <Button size="lg">View Demo</Button>
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 font-mono text-sm">
                <span className="text-muted-foreground">$</span>
                <code>make setup && make dev</code>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="border-t border-border bg-muted/30">
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
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-8 text-center text-2xl font-semibold">Project Structure</h2>
          <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-muted-foreground">
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
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">Ready to build?</h2>
          <p className="mt-2 text-muted-foreground">
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
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Keel Template</span>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/50">
      <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
