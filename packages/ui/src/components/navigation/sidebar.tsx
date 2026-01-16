'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { cn } from '../../lib/utils';

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Sidebar({ items, header, footer, className }: SidebarProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      {header && <div className="border-b p-4">{header}</div>}
      <nav className="flex-1 overflow-auto p-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </ul>
      </nav>
      {footer && <div className="border-t p-4">{footer}</div>}
    </div>
  );
}

interface SidebarNavItemProps {
  item: SidebarItem;
  depth?: number;
}

function SidebarNavItem({ item, depth = 0 }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const [isExpanded, setIsExpanded] = React.useState(isActive);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.href}
          className={cn(
            'flex flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            depth > 0 && 'ml-4'
          )}
        >
          {item.icon && <span className="h-4 w-4">{item.icon}</span>}
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-md p-1 hover:bg-muted"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarNavItem key={child.href} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
