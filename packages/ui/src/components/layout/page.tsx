'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn('container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
