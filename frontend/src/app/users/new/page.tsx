import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { UserForm } from '../_components/user-form';

export default function NewUserPage() {
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Add User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new user account
        </p>
      </div>

      {/* Form */}
      <div className="max-w-lg rounded-xl border border-border bg-card p-6">
        <UserForm />
      </div>
    </div>
  );
}
