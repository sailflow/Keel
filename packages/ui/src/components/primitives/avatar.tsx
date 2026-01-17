'use client';

import * as React from 'react';

import { cn } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    const initials = fallback || alt?.charAt(0)?.toUpperCase() || '?';

    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted text-muted-foreground relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
