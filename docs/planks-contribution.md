# Contributing to @sailflow/planks

This project uses the **Component Farm** workflow. If you build a generic UI component that isn't in `@sailflow/planks`, you should build it here and contribute it back!

## The Workflow

1.  **Check Planks**: Ensure `@sailflow/planks` doesn't already have what you need.
2.  **Build Local**: Create your component in `frontend/src/components/local/<ComponentName>.tsx`.
3.  **Style Guide**: Follow the patterns below.
4.  **Submit**: Run the submission script to create an issue on the planks repo.

```bash
bun run submit-component <ComponentName>
```

---

## Style Guide

Your component will be used by many projects. Keep it clean.

### 1. Naming & Structure

- **File**: `PascalCase.tsx` (e.g., `StatusBadge.tsx`)
- **Exports**: Named export matching the filename.
- **Props**: Export an interface `[ComponentName]Props`.

### 2. Technologies

- **Styling**: Tailwind CSS + `cn` utility (Class Variance Authority if variants are needed).
- **Primitives**: Use `@radix-ui` primitives if accessible interaction is required (Dialogs, Popovers, etc.).
- **Icons**: Use `lucide-react`.

### 3. Pattern Example

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@sailflow/planks/lib/utils'; // Use utils from planks if available, or local

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

---

## Submission Checklist

Before running `submit-component`:

- [ ] Does it rely on _app-specific_ logic? (It shouldn't).
- [ ] Is it responsive?
- [ ] Do all props have appropriate types?
