'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '../../lib/utils';
import { Button } from '../primitives/button';

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  align?: 'left' | 'right' | 'center' | 'between';
}

export function FormActions({
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  className,
  align = 'right',
}: FormActionsProps) {
  const { formState } = useFormContext();
  const { isSubmitting } = formState;

  const alignmentClasses = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  };

  return (
    <div className={cn('flex items-center gap-3 pt-4', alignmentClasses[align], className)}>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </div>
  );
}
