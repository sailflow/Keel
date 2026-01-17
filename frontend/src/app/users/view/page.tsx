'use client';

import { Button } from '@keel/ui';
import { Calendar, ChevronLeft, Edit2, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { api } from '@/lib/api';

import type { User } from '@keel/api-client';

function UserDetailContent() {
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
          if (apiError.code === 'NOT_FOUND') {
            // notFound(); // Client-side 404
            setError(new Error('User not found')); // safer for SPA
          } else {
            throw new Error(apiError.message);
          }
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
        <Link href="/users">
          <Button variant="outline" className="mt-4">
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link
        href="/users"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
        </div>
        <Link href={`/users/edit?id=${user.id}`}>
          <Button variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Details */}
      <div className="border-border bg-card max-w-lg space-y-6 rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Mail className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Shield className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Calendar className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Created</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* ID */}
      <div className="mt-6 max-w-lg">
        <p className="text-muted-foreground text-xs">
          ID: <code className="bg-muted rounded px-1 py-0.5">{user.id}</code>
        </p>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="bg-primary/10 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <UserDetailContent />
    </Suspense>
  );
}
