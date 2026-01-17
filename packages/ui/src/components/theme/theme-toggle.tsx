'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { cn } from '../../lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'bg-muted inline-flex h-10 items-center justify-center rounded-full p-1',
          className
        )}
      >
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
        <div className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-muted inline-flex h-10 items-center justify-center rounded-full p-1',
        className
      )}
    >
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all',
          theme === 'light'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all',
          theme === 'dark'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center rounded-full transition-all',
          theme === 'system'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
