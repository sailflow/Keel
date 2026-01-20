'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component with SSR disabled
// This prevents prerendering errors from React Query hooks
const UsersClient = dynamic(() => import('./users-client'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-muted" />
      </div>
    </div>
  ),
});

export default function UsersPage() {
  return <UsersClient />;
}
