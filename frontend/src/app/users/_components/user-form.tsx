'use client';

import { Button, Input, Label, useToast } from '@keel/ui';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '@/lib/api';

import type { User } from '@keel/api-client';

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as 'admin' | 'user',
    };

    try {
      if (isEditing) {
        const { error } = await api.PUT('/api/users/{id}', {
          params: { path: { id: user.id } },
          body: data,
        });
        if (error) throw new Error(error.message);
        toast({ title: 'Updated', description: 'User has been updated.' });
      } else {
        const { error } = await api.POST('/api/users', { body: data });
        if (error) throw new Error(error.message);
        toast({ title: 'Created', description: 'User has been created.' });
      }
      router.push('/users');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="John Doe" defaultValue={user?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          defaultValue={user?.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <select
          id="role"
          name="role"
          defaultValue={user?.role ?? 'user'}
          className="border-input bg-background focus-visible:ring-ring flex h-11 w-full rounded-lg border px-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
