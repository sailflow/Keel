import { intro, outro, text, confirm, isCancel, cancel, multiselect } from '@clack/prompts';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

async function main() {
  intro('Keel Setup Wizard');

  const configState = {
    appName: 'Keel',
    authProviders: [] as string[],
  };

  // 1. App Name Configuration
  const appName = await text({
    message: 'What is the name of your application?',
    placeholder: 'My Awesome App',
    defaultValue: 'Keel',
    validate(value) {
      if (value.length === 0) return 'Value is required!';
    },
  });

  if (isCancel(appName)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  configState.appName = appName as string;

  // 2. Auth Configuration
  const enableAuth = await confirm({
    message: 'Does your application require authentication?',
    initialValue: true,
  });

  if (isCancel(enableAuth)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Helper to update env vars
  const updateEnvVar = (content: string, key: string, value: string) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
      return content.replace(regex, `${key}=${value}`);
    } else {
      return content + `\n${key}=${value}`;
    }
  };

  // Load frontend env content early
  const frontendEnvPath = join(process.cwd(), 'frontend', '.env.local');
  let frontendEnvContent = '';
  if (existsSync(frontendEnvPath)) {
    frontendEnvContent = readFileSync(frontendEnvPath, 'utf-8');
  }

  // Helper to remove env vars
  const removeEnvVar = (content: string, key: string) => {
    const regex = new RegExp(`^${key}=.*\n?`, 'm');
    return content.replace(regex, '');
  };

  if (enableAuth) {
    const providers = await multiselect({
      message: 'Select authentication providers:',
      options: [
        { value: 'google', label: 'Google' },
        { value: 'github', label: 'GitHub' },
        { value: 'microsoft', label: 'Microsoft' },
      ],
      required: false,
    });

    if (isCancel(providers)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }
    configState.authProviders = providers as string[];

    // Cleanup unselected providers
    const allProviders = ['google', 'github', 'microsoft'];
    for (const provider of allProviders) {
      if (!configState.authProviders.includes(provider)) {
        if (provider === 'google') {
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GOOGLE_ID');
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GOOGLE_SECRET');
        }
        if (provider === 'github') {
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GITHUB_ID');
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GITHUB_SECRET');
        }
        if (provider === 'microsoft') {
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_MICROSOFT_ENTRA_ID_ID');
          frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_MICROSOFT_ENTRA_ID_SECRET');
        }
      }
    }

    // Prompt for secrets
    for (const provider of configState.authProviders) {
      if (provider === 'google') {
        const clientId = await text({ message: 'Enter Google Client ID:', placeholder: '...' });
        if (isCancel(clientId)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(frontendEnvContent, 'AUTH_GOOGLE_ID', clientId as string);

        const clientSecret = await text({
          message: 'Enter Google Client Secret:',
          placeholder: '...',
        });
        if (isCancel(clientSecret)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(
          frontendEnvContent,
          'AUTH_GOOGLE_SECRET',
          clientSecret as string
        );
      }
      if (provider === 'github') {
        const clientId = await text({ message: 'Enter GitHub Client ID:', placeholder: '...' });
        if (isCancel(clientId)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(frontendEnvContent, 'AUTH_GITHUB_ID', clientId as string);

        const clientSecret = await text({
          message: 'Enter GitHub Client Secret:',
          placeholder: '...',
        });
        if (isCancel(clientSecret)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(
          frontendEnvContent,
          'AUTH_GITHUB_SECRET',
          clientSecret as string
        );
      }
      if (provider === 'microsoft') {
        const clientId = await text({ message: 'Enter Microsoft Client ID:', placeholder: '...' });
        if (isCancel(clientId)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(
          frontendEnvContent,
          'AUTH_MICROSOFT_ENTRA_ID_ID',
          clientId as string
        );

        const clientSecret = await text({
          message: 'Enter Microsoft Client Secret:',
          placeholder: '...',
        });
        if (isCancel(clientSecret)) {
          cancel('Operation cancelled.');
          process.exit(0);
        }
        frontendEnvContent = updateEnvVar(
          frontendEnvContent,
          'AUTH_MICROSOFT_ENTRA_ID_SECRET',
          clientSecret as string
        );
      }
    }

    // Generate AUTH_SECRET if strictly needed or missing (preserve existing if possible)
    if (!frontendEnvContent.includes('AUTH_SECRET=')) {
      const authSecret = crypto.randomUUID();
      frontendEnvContent = updateEnvVar(frontendEnvContent, 'AUTH_SECRET', authSecret);
    }
  } else {
    // If auth is disabled, remove all auth vars
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GOOGLE_ID');
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GOOGLE_SECRET');
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GITHUB_ID');
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_GITHUB_SECRET');
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_MICROSOFT_ENTRA_ID_ID');
    frontendEnvContent = removeEnvVar(frontendEnvContent, 'AUTH_MICROSOFT_ENTRA_ID_SECRET');

    // Ensure AUTH_SECRET is present even if auth is disabled, as NextAuth/other libs might warn or crash without it
    if (!frontendEnvContent.includes('AUTH_SECRET=')) {
      const authSecret = crypto.randomUUID();
      frontendEnvContent = updateEnvVar(frontendEnvContent, 'AUTH_SECRET', authSecret);
    }
  }

  // Update backend/.env
  const backendEnvPath = join(process.cwd(), 'backend', '.env');
  let backendEnvContent = '';
  if (existsSync(backendEnvPath)) {
    backendEnvContent = readFileSync(backendEnvPath, 'utf-8');
  }

  backendEnvContent = updateEnvVar(backendEnvContent, 'APP_NAME', configState.appName);
  writeFileSync(backendEnvPath, backendEnvContent.trim() + '\n');
  console.log('Updated backend/.env');

  // Update frontend/.env.local - Write accumulated changes
  frontendEnvContent = updateEnvVar(
    frontendEnvContent,
    'NEXT_PUBLIC_APP_NAME',
    configState.appName
  );
  frontendEnvContent = updateEnvVar(
    frontendEnvContent,
    'NEXT_PUBLIC_ENABLE_AUTH',
    String(enableAuth)
  );
  frontendEnvContent = updateEnvVar(
    frontendEnvContent,
    'NEXT_PUBLIC_AUTH_PROVIDERS',
    configState.authProviders.join(',')
  );
  writeFileSync(frontendEnvPath, frontendEnvContent.trim() + '\n');
  console.log('Updated frontend/.env.local');

  outro('Setup complete! You can run this wizard again with `bun run configure`.');
}

main().catch(console.error);
