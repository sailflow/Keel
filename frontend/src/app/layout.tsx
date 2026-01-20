import { ThemeProvider, Toaster } from '@sailflow/planks';
import '@sailflow/planks/styles.css';
import { GeistMono } from 'geist/font/mono'; // eslint-disable-line import/no-unresolved
import { GeistSans } from 'geist/font/sans'; // eslint-disable-line import/no-unresolved

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { env } from '@/env';

import { Providers } from './providers';

import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'AI App Template',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
