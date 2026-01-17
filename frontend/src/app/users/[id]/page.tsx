import { Button } from '@keel/ui';
import { Calendar, ChevronLeft, Edit2, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api } from '@/lib/api';

import type { User } from '@keel/api-client';

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
        <Link href={`/users/${user.id}/edit`}>
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
