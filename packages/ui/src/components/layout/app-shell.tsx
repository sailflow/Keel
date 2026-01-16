'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function AppShell({ children, sidebar, header, className }: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      {header && <header className="sticky top-0 z-40 border-b bg-background">{header}</header>}
      <div className="flex flex-1">
        {sidebar && (
          <aside className="hidden w-64 shrink-0 border-r bg-background md:block">{sidebar}</aside>
        )}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
