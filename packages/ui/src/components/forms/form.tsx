'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import {
  useForm,
  FormProvider,
} from 'react-hook-form';

import { cn } from '../../lib/utils';

import type {
  FieldValues,
  UseFormReturn,
  DefaultValues,
  SubmitHandler,
  Resolver,
} from 'react-hook-form';
import type { ZodSchema } from 'zod';

interface FormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  children: React.ReactNode | ((form: UseFormReturn<T>) => React.ReactNode);
  className?: string;
  id?: string;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  id,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema as any) as unknown as Resolver<T>,
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
        {typeof children === 'function' ? children(form) : children}
      </form>
    </FormProvider>
  );
}

// Re-export useful form utilities
export { useFormContext, useWatch, useFieldArray } from 'react-hook-form';
export type { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';
