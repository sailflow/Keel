'use client';

import { Button } from '@keel/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import { UserForm } from '../_components/user-form';

import type { User } from '@keel/api-client';

function EditUserContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) return;
        const { data, error: apiError } = await api.GET('/api/users/{id}', {
          params: { path: { id } },
        });

        if (apiError) {
          setError(new Error(apiError.message));
        } else {
          setUser(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="bg-primary/10 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-12 text-center">
        <h3 className="font-medium">User not found</h3>
        <Link href={`/users/view?id=${id}`}>
          <Button variant="outline" className="mt-4">
            Back to User
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link
        href={`/users/view?id=${user.id}`}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {user.name}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground mt-1 text-sm">Update {user.name}'s details</p>
      </div>

      {/* Form */}
      <div className="border-border bg-card max-w-lg rounded-xl border p-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="bg-primary/10 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <EditUserContent />
    </Suspense>
  );
}
