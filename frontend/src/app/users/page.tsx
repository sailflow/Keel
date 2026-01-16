import { Button } from '@keel/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { UsersTable } from './_components/users-table';

export default function UsersPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your application users
          </p>
        </div>
        <Link href="/users/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Suspense fallback={<TableSkeleton />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
