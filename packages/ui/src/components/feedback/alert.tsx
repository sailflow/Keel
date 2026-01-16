'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const alertVariants = cva(
  'relative w-full rounded-xl border-2 p-4 flex items-start gap-3',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted/50 text-foreground [&>svg]:text-muted-foreground',
        info: 'border-sky-200 bg-sky-50 text-sky-900 [&>svg]:text-sky-500 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-500 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
        warning: 'border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-500 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100',
        destructive: 'border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-500 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = 'default', children, ...props }, ref) => {
  const Icon = {
    default: Info,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    destructive: AlertCircle,
  }[variant ?? 'default'];

  return (
    <div 
      ref={ref} 
      role="alert" 
      className={cn(alertVariants({ variant }), className)} 
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-1 text-sm opacity-90 [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription, AlertTitle };
