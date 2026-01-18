'use client';

import {
  Button,
  Logo,
  ThemeToggle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
} from '@keel/ui';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Keel';
  const enableAuth = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="flex h-16 w-full items-center px-6 md:px-12">
          {/* Grid Layout for Perfect Centering */}
          <div className="grid w-full grid-cols-2 items-center md:grid-cols-3">
            {/* Left: Logo */}
            <div className="flex items-center justify-start">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Logo className="h-8 w-8 text-primary" />
                <span>{appName}</span>
              </Link>
            </div>

            {/* Center: Desktop Nav Links */}
            <div className="hidden justify-center gap-8 md:flex">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Product
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Resources
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Company
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-4">
              <ThemeToggle />

              {/* Auth UI */}
              {enableAuth ? (
                <div className="hidden items-center gap-4 md:flex">
                  {isLoggedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar
                            className="h-8 w-8"
                            src={
                              session?.user?.image ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(appName)}`
                            }
                            fallback={session?.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {session?.user?.name || 'User'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {session?.user?.email || 'user@example.com'}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => signIn()}>
                        Log in
                      </Button>
                      <Button size="sm" onClick={() => signIn()}>
                        Sign up
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden md:block">
                  <Button size="sm">Get Started</Button>
                </div>
              )}

              {/* Mobile Menu Button (Visible only on mobile) */}
              <button
                className="justify-self-end md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-full border-b border-border bg-background p-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-6">
              <Link href="#" className="text-lg font-medium">
                Product
              </Link>
              <Link href="#" className="text-lg font-medium">
                Resources
              </Link>
              <Link href="#" className="text-lg font-medium">
                Company
              </Link>
              <hr className="border-border" />
              {enableAuth ? (
                <>
                  {isLoggedIn ? (
                    <div className="flex items-center gap-4 px-2">
                      <Avatar
                        className="h-10 w-10"
                        src={
                          session?.user?.image ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(appName)}`
                        }
                        fallback={session?.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{session?.user?.name || 'User'}</span>
                        <span className="text-sm text-muted-foreground">
                          {session?.user?.email || 'user@example.com'}
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-muted-foreground"
                          onClick={() => signOut()}
                        >
                          Log out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => signIn()}
                      >
                        Log in
                      </Button>
                      <Button className="w-full justify-center" onClick={() => signIn()}>
                        Sign up
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Button className="w-full">Get Started</Button>
              )}
            </div>
          </div>
        )}
      </nav>

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
            &copy; {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
