import { ThemeProvider, Toaster } from '@keel/ui';
import '@keel/ui/globals.css';
import { GeistMono } from 'geist/font/mono'; // eslint-disable-line import/no-unresolved
import { GeistSans } from 'geist/font/sans'; // eslint-disable-line import/no-unresolved

import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Keel',
  description: 'AI App Template',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
