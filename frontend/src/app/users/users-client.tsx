'use client';

import { useCreateUser, useDeleteUser, useListUsers } from '@keel/api-client';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
} from '@sailflow/planks';
import { useState } from 'react';

export default function UsersPage() {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch users with React Query
  const { data: usersData, isLoading, error, refetch } = useListUsers({ page: 1, limit: 10 });

  // Mutations
  const createUserMutation = useCreateUser({
    mutation: {
      onSuccess: () => {
        refetch();
        setNewUserName('');
        setNewUserEmail('');
      },
    },
  });

  const deleteUserMutation = useDeleteUser({
    mutation: {
      onSuccess: () => {
        refetch();
      },
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    createUserMutation.mutate({
      data: {
        name: newUserName,
        email: newUserEmail,
      },
    });
  };

  const handleDeleteUser = (id: string) => {
    deleteUserMutation.mutate({ id });
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-2 text-muted-foreground">
          Demo page showing API integration with React Query hooks.
        </p>
      </div>

      {/* Create User Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>Add a new user to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </form>
          {createUserMutation.isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to create user. Please try again.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>{usersData?.pagination?.total ?? 0} users total</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error Loading Users</AlertTitle>
              <AlertDescription>
                Failed to load users. Make sure the backend is running at http://localhost:8080
              </AlertDescription>
            </Alert>
          )}

          {/* Empty State */}
          {!isLoading && !error && usersData?.data?.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No users yet. Create one above!
            </div>
          )}

          {/* Data Display */}
          {!isLoading && !error && usersData?.data && usersData.data.length > 0 && (
            <div className="divide-y">
              {usersData.data.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {user.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteUserMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
