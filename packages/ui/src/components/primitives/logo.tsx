import { Command } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

export function Logo({ className, ...props }: React.ComponentProps<typeof Command>) {
  return (
    <div className={cn('bg-primary/10 flex items-center justify-center rounded-md p-1', className)}>
      <Command className="text-primary h-full w-full" {...props} />
    </div>
  );
}
