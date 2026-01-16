'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../primitives/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | { message: string } | string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const errorMessage = React.useMemo(() => {
    if (message) return message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) return error.message;
    return 'An unexpected error occurred. Please try again.';
  }, [message, error]);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 text-center',
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{errorMessage}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
