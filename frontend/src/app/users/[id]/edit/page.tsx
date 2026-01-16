import type { User } from '@keel/api-client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { api } from '@/lib/api';
import { UserForm } from '../../_components/user-form';

interface EditUserPageProps {
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

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <Link 
        href={`/users/${user.id}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {user.name}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update {user.name}'s details
        </p>
      </div>

      {/* Form */}
      <div className="max-w-lg rounded-xl border border-border bg-card p-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}
