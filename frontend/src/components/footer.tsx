export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Keel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
