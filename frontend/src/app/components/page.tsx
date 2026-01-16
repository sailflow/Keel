'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Skeleton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
  Logo,
} from '@keel/ui';
import { Info, Mail, Search, Settings, Bell, User, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ComponentsPage() {
  const { toast } = useToast();
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-10 w-10 text-primary" />
              <span className="text-lg">Keel</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <Link href="/users">
                <Button variant="outline" size="sm">Demo</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Component Library</h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              All UI components from <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-800">@keel/ui</code>
            </p>
          </div>

          <div className="space-y-20">
            {/* Buttons */}
            <ComponentSection title="Buttons" description="Interactive button components with variants and sizes">
              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-500">Variants</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-500">Sizes</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Search className="h-5 w-5" /></Button>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-slate-500">States</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading</Button>
                  </div>
                </div>
              </div>
            </ComponentSection>

            {/* Inputs */}
            <ComponentSection title="Form Inputs" description="Text inputs, textareas, and form controls">
              <div className="grid max-w-lg gap-6">
                <div className="space-y-2">
                  <Label htmlFor="input-default">Default Input</Label>
                  <Input id="input-default" placeholder="Enter your name..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="input-icon">With Icon</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <Input id="input-icon" className="pl-12" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textarea">Textarea</Label>
                  <Textarea id="textarea" placeholder="Write your message here..." />
                </div>
              </div>
            </ComponentSection>

            {/* Toggles */}
            <ComponentSection title="Toggles & Checkboxes" description="Boolean input controls for forms">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
                  <div>
                    <Label className="text-base">Enable notifications</Label>
                    <p className="text-sm text-slate-500">Receive alerts when something happens</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={checkboxValue}
                    onCheckedChange={(checked) => setCheckboxValue(checked === true)}
                  />
                  <div>
                    <Label className="text-base">Accept terms and conditions</Label>
                    <p className="text-sm text-slate-500">You agree to our Terms of Service</p>
                  </div>
                </div>
              </div>
            </ComponentSection>

            {/* Cards */}
            <ComponentSection title="Cards" description="Container components for grouping content">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>A simple card with title and description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Cards are used to group related content and actions.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Highlighted Card</CardTitle>
                    <CardDescription>With accent styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Take Action</Button>
                  </CardContent>
                </Card>
              </div>
            </ComponentSection>

            {/* Badges */}
            <ComponentSection title="Badges" description="Small status indicators and labels">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </ComponentSection>

            {/* Avatars */}
            <ComponentSection title="Avatars" description="User profile images with fallback initials">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <Avatar fallback="JD" size="sm" />
                  <p className="mt-2 text-xs text-slate-500">Small</p>
                </div>
                <div className="text-center">
                  <Avatar fallback="AB" size="md" />
                  <p className="mt-2 text-xs text-slate-500">Medium</p>
                </div>
                <div className="text-center">
                  <Avatar fallback="XY" size="lg" />
                  <p className="mt-2 text-xs text-slate-500">Large</p>
                </div>
                <div className="text-center">
                  <Avatar src="https://github.com/shadcn.png" alt="User" size="lg" />
                  <p className="mt-2 text-xs text-slate-500">With Image</p>
                </div>
              </div>
            </ComponentSection>

            {/* Alerts */}
            <ComponentSection title="Alerts" description="Contextual feedback messages for users">
              <div className="max-w-xl space-y-4">
                <Alert variant="info">
                  <AlertTitle>Did you know?</AlertTitle>
                  <AlertDescription>
                    You can customize these alerts with different variants.
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Your session will expire in 5 minutes.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              </div>
            </ComponentSection>

            {/* Tabs */}
            <ComponentSection title="Tabs" description="Tabbed navigation for organizing content">
              <Tabs defaultValue="account" className="max-w-lg">
                <TabsList>
                  <TabsTrigger value="account">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="password">
                    <Lock className="mr-2 h-4 w-4" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">Update your personal details here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">Update your password to keep your account secure.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Configure notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">Choose what notifications you want to receive.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ComponentSection>

            {/* Tooltips */}
            <ComponentSection title="Tooltips" description="Contextual information on hover">
              <div className="flex items-center gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Info className="mr-2 h-4 w-4" />
                      Hover for info
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is helpful information!</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </ComponentSection>

            {/* Skeleton */}
            <ComponentSection title="Skeleton" description="Loading placeholder content">
              <div className="max-w-sm space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </ComponentSection>

            {/* Separator */}
            <ComponentSection title="Separator" description="Visual divider between content sections">
              <div className="max-w-sm rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <Avatar fallback="JD" size="md" />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-slate-500">Software Engineer</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Building great products with modern technologies.
                </p>
                <Separator className="my-4" />
                <div className="flex gap-4 text-sm text-slate-500">
                  <span>150 followers</span>
                  <span>42 following</span>
                </div>
              </div>
            </ComponentSection>

            {/* Toast */}
            <ComponentSection title="Toast" description="Notification popups for user feedback">
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => toast({
                    title: 'Changes saved',
                    description: 'Your preferences have been updated successfully.',
                  })}
                >
                  Default Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({
                    title: 'Success!',
                    description: 'Your file has been uploaded.',
                    variant: 'success'
                  })}
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({
                    title: 'Error',
                    description: 'Something went wrong. Please try again.',
                    variant: 'destructive'
                  })}
                >
                  Error Toast
                </Button>
              </div>
            </ComponentSection>
          </div>

          {/* Footer */}
          <div className="mt-20 border-t border-slate-200 pt-8 text-center dark:border-slate-800">
            <p className="text-slate-500">
              Import components from <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-800">@keel/ui</code>
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}

function ComponentSection({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}
