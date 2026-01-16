import { Button } from '@keel/ui';
import { UserX } from 'lucide-react';
import Link from 'next/link';

export default function UserNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <UserX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">User not found</h1>
        <p className="mt-2 text-muted-foreground">
          This user doesn't exist or has been deleted.
        </p>
        <Link href="/users">
          <Button className="mt-6">Back to Users</Button>
        </Link>
      </div>
    </div>
  );
}
