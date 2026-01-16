# UI System

Shared components in `packages/ui/`. Import via `@keel/ui`.

**Live Demo:** Run `make dev` and visit `http://localhost:3000/components`

## Design Principles

1. **Accessibility First** - All interactive elements meet WCAG 2.1 AA standards
2. **Touch-Friendly** - Minimum 44px touch targets for mobile
3. **Consistent Spacing** - 4px base unit (4, 8, 12, 16, 24, 32, 48)
4. **Clear Hierarchy** - Visual weight guides attention
5. **Instant Feedback** - Every action has visible response

---

## Component Inventory

### Primitives

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Button` | Interactive buttons | `variant`, `size`, `loading`, `disabled` |
| `Input` | Text input field | `placeholder`, `type`, `disabled` |
| `Textarea` | Multi-line text input | `placeholder`, `rows` |
| `Select` | Dropdown selection | `options`, `placeholder` |
| `Checkbox` | Boolean toggle (square) | `checked`, `onCheckedChange` |
| `Switch` | Boolean toggle (pill) | `checked`, `onCheckedChange` |
| `Label` | Form field labels | `htmlFor` |
| `Card` | Content container | `CardHeader`, `CardContent`, `CardFooter` |
| `Dialog` | Modal dialogs | `open`, `onOpenChange` |
| `Avatar` | User profile image | `src`, `fallback`, `size` |
| `Separator` | Visual divider | `orientation` |
| `Tooltip` | Hover hints | `TooltipTrigger`, `TooltipContent` |

### Layout

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `AppShell` | Root layout with sidebar | `sidebar` |
| `Page` | Content container | `children` |
| `PageHeader` | Title + description + actions | `title`, `description`, `actions` |
| `Section` | Content grouping | `title`, `children` |

### Forms

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Form` | Form wrapper with validation | `schema`, `onSubmit`, `defaultValues` |
| `Field` | Universal form field | `name`, `label`, `type`, `required` |
| `FormActions` | Submit/cancel buttons | `submitLabel`, `onCancel`, `loading` |

### Data Display

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `DataTable` | Table with pagination | `columns`, `data`, `pagination` |
| `LoadingState` | Loading spinner | `text` |
| `ErrorState` | Error with retry | `error`, `onRetry` |
| `EmptyState` | Empty + CTA | `title`, `description`, `action` |

### Feedback

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Toast` | Notification popup | via `useToast()` hook |
| `Alert` | Inline message | `variant`, `children` |
| `Badge` | Status label | `variant` |
| `Skeleton` | Loading placeholder | `className` (for sizing) |

### Navigation

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Sidebar` | Navigation sidebar | `items`, `header` |
| `Breadcrumb` | Path navigation | `items` |
| `Tabs` | Tabbed content | `TabsList`, `TabsTrigger`, `TabsContent` |

---

## Button Guidelines

### Variants
| Variant | Use For |
|---------|---------|
| `default` | Primary actions (Submit, Save, Create) |
| `secondary` | Secondary actions (Cancel, Back) |
| `outline` | Tertiary actions, toggles |
| `ghost` | Icon buttons, subtle actions |
| `destructive` | Delete, remove, dangerous actions |
| `link` | Inline text links |

### Sizes
| Size | Height | Use For |
|------|--------|---------|
| `sm` | 40px | Compact UI, tables |
| `default` | 44px | Most buttons |
| `lg` | 48px | Hero sections, CTAs |
| `icon` | 44px | Icon-only buttons |

### Usage
```tsx
// Primary action
<Button>Save Changes</Button>

// With loading state
<Button loading={isSubmitting}>Save Changes</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Settings className="h-5 w-5" />
</Button>

// Destructive action
<Button variant="destructive">Delete Account</Button>
```

---

## Form Guidelines

### Field Types
```tsx
<Field name="email" label="Email" type="email" required />
<Field name="bio" label="Bio" type="textarea" rows={4} />
<Field name="role" label="Role" type="select" options={roleOptions} />
```

### Validation Pattern
```tsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name too short'),
});

<Form schema={schema} onSubmit={handleSubmit}>
  <Field name="email" label="Email" type="email" required />
  <Field name="name" label="Name" required />
  <FormActions submitLabel="Create" />
</Form>
```

---

## Layout Patterns

### Standard Page
```tsx
<AppShell sidebar={<Sidebar items={navItems} />}>
  <Page>
    <Breadcrumb items={[{ label: 'Users' }]} />
    <PageHeader
      title="Users"
      description="Manage application users"
      actions={<Button>Add User</Button>}
    />
    <Section>
      {/* Content */}
    </Section>
  </Page>
</AppShell>
```

### Detail Page
```tsx
<Page>
  <Breadcrumb items={[
    { label: 'Users', href: '/users' },
    { label: user.name }
  ]} />
  <PageHeader title={user.name} actions={<Button variant="outline">Edit</Button>} />
  <Section>
    <Card>
      <CardContent>{/* Details */}</CardContent>
    </Card>
  </Section>
</Page>
```

---

## Data Display Patterns

### Async Data Template
```tsx
function UsersList() {
  const { data, isLoading, error, refetch } = useUsers();

  if (isLoading) return <LoadingState text="Loading users..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!data?.length) {
    return (
      <EmptyState
        title="No users yet"
        description="Create your first user to get started"
        action={<Button>Add User</Button>}
      />
    );
  }

  return <DataTable columns={columns} data={data} />;
}
```

---

## Feedback Patterns

### Toast Notifications
```tsx
const { toast } = useToast();

// Success
toast({ title: 'Saved', description: 'Changes saved successfully' });

// Error
toast({ 
  title: 'Error', 
  description: 'Something went wrong',
  variant: 'destructive'
});
```

### Inline Alerts
```tsx
<Alert>
  <Info className="h-4 w-4" />
  <div className="ml-3">
    <p className="font-medium">Note</p>
    <p className="text-sm text-muted-foreground">Additional information here.</p>
  </div>
</Alert>
```

---

## Accessibility Checklist

- [ ] All buttons have accessible names
- [ ] Form fields have associated labels
- [ ] Color is not the only indicator of state
- [ ] Focus states are visible
- [ ] Touch targets are minimum 44px
- [ ] Error messages are announced to screen readers
- [ ] Modals trap focus appropriately
- [ ] Loading states have aria-busy

---

## Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | Purple 600 | Purple 500 | Brand, CTAs |
| `--secondary` | Gray 100 | Gray 800 | Secondary buttons |
| `--destructive` | Red 500 | Red 600 | Errors, delete |
| `--muted` | Gray 100 | Gray 800 | Backgrounds |
| `--border` | Gray 200 | Gray 700 | Borders |

---

## Spacing Scale

| Class | Value | Usage |
|-------|-------|-------|
| `p-1` | 4px | Tight padding |
| `p-2` | 8px | Icon padding |
| `p-3` | 12px | Card padding |
| `p-4` | 16px | Section padding |
| `p-6` | 24px | Page padding |
| `p-8` | 32px | Large sections |

---

## Typography Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | Body text |
| `text-base` | 16px | Default |
| `text-lg` | 18px | Subheadings |
| `text-xl` | 20px | Section titles |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | Hero titles |
