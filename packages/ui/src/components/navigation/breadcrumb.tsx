'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const allItems = showHome ? [{ label: 'Home', href: '/' }, ...items] : items;

  return (
    <nav aria-label="Breadcrumb" className={cn('mb-4', className)}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li key={item.href ?? item.label} className="flex items-center">
              {index > 0 && <ChevronRight className="mr-2 h-4 w-4" />}
              {isLast ? (
                <span className="font-medium text-foreground">{item.label}</span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  {isHome && <Home className="mr-1 h-4 w-4" />}
                  {!isHome && item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
