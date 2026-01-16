import type { User } from '@keel/api-client';
import { Button } from '@keel/ui';
import { ChevronLeft, Edit2, Mail, Shield, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api } from '@/lib/api';

interface UserDetailPageProps {
  params: { id: string };
}

async function getUser(id: string): Promise<User | null> {
  const { data, error } = await api.GET('/api/users/{id}', {
    params: { path: { id } },
  });

  if (error) {
    if (error.code === 'NOT_FOUND') return null;
    throw new Error(error.message);
  }

  return data;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link 
        href="/users"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Link href={`/users/${user.id}/edit`}>
          <Button variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Details */}
      <div className="max-w-lg space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
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
        <p className="text-xs text-muted-foreground">
          ID: <code className="rounded bg-muted px-1 py-0.5">{user.id}</code>
        </p>
      </div>
    </div>
  );
}
