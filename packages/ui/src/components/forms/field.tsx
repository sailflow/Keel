'use client';

import * as React from 'react';
import { useFormContext, Controller, type FieldPath, type FieldValues } from 'react-hook-form';

import { cn } from '../../lib/utils';
import { Input } from '../primitives/input';
import { Label } from '../primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';

interface FieldBaseProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  description?: string;
  className?: string;
  required?: boolean;
}

interface TextFieldProps<T extends FieldValues> extends FieldBaseProps<T> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  autoComplete?: string;
}

interface TextareaFieldProps<T extends FieldValues> extends FieldBaseProps<T> {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps<T extends FieldValues> extends FieldBaseProps<T> {
  type: 'select';
  placeholder?: string;
  options: Array<{ label: string; value: string }>;
}

type FieldProps<T extends FieldValues> =
  | TextFieldProps<T>
  | TextareaFieldProps<T>
  | SelectFieldProps<T>;

export function Field<T extends FieldValues>(props: FieldProps<T>) {
  const {
    formState: { errors },
  } = useFormContext<T>();

  const { name, label, description, className, required } = props;

  // Get nested error message
  const error = name.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors);

  const errorMessage = error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <FieldInput {...props} />
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  );
}

function FieldInput<T extends FieldValues>(props: FieldProps<T>) {
  const { control } = useFormContext<T>();
  const { name } = props;

  if (props.type === 'select') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  }

  if (props.type === 'textarea') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            {...field}
            id={name}
            placeholder={props.placeholder}
            rows={props.rows ?? 4}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          id={name}
          type={props.type ?? 'text'}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
        />
      )}
    />
  );
}
