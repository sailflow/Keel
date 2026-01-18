import { Button } from '@keel/ui';
import Link from 'next/link';

import { Navbar } from '@/components/navbar';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-32 sm:py-48">
          {/* Background Gradient */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              Build with <span className="text-primary">speed</span>.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground">
              A clean, production-ready template designed for modern applications. Focus on your
              product, not the boilerplate.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="#">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start Building
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Keel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
