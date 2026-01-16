'use client';

import type { User, UserListResponse } from '@keel/api-client';
import { Button, useToast } from '@keel/ui';
import { cn } from '@keel/ui';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  Plus,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export function UsersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [data, setData] = useState<UserListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: err } = await api.GET('/api/users', {
        params: { query: { page, limit } },
      });

      if (err) {
        setError(new Error(err.message));
        setIsLoading(false);
        return;
      }

      setData(result);
    } catch (e) {
      setError(new Error('Unable to connect to the server'));
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.name}?`)) return;

    const { error } = await api.DELETE('/api/users/{id}', {
      params: { path: { id: user.id } },
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Deleted', description: `${user.name} has been removed.` });
    fetchUsers();
  };

  const goToPage = (newPage: number) => {
    router.push(`/users?page=${newPage}`);
  };

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <span className="text-xl">!</span>
        </div>
        <h3 className="font-medium">Failed to load users</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={fetchUsers}>
          Try again
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data?.data.length) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <UserIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium">No users yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first user to get started.
        </p>
        <Link href="/users/new">
          <Button className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>
    );
  }

  const { data: users, pagination } = data;

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr 
                key={user.id} 
                className={cn(
                  "border-b border-border transition-colors hover:bg-muted/50",
                  i === users.length - 1 && "border-b-0"
                )}
              >
                <td className="px-6 py-4">
                  <Link 
                    href={`/users/${user.id}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    user.role === 'admin' 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/users/${user.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
