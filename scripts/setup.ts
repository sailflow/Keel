import { intro, outro, text, isCancel, cancel } from '@clack/prompts';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

async function main() {
  intro('Keel Setup Wizard');

  const configState = {
    appName: 'Keel',
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

  // Helper to update env vars
  const updateEnvVar = (content: string, key: string, value: string) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
      return content.replace(regex, `${key}=${value}`);
    } else {
      return content + `\n${key}=${value}`;
    }
  };

  // Update backend/.env
  const backendEnvPath = join(process.cwd(), 'backend', '.env');
  let backendEnvContent = '';
  if (existsSync(backendEnvPath)) {
    backendEnvContent = readFileSync(backendEnvPath, 'utf-8');
  }

  backendEnvContent = updateEnvVar(backendEnvContent, 'APP_NAME', configState.appName);
  writeFileSync(backendEnvPath, backendEnvContent.trim() + '\n');
  console.log('Updated backend/.env');

  // Update frontend/.env.local
  const frontendEnvPath = join(process.cwd(), 'frontend', '.env.local');
  let frontendEnvContent = '';
  if (existsSync(frontendEnvPath)) {
    frontendEnvContent = readFileSync(frontendEnvPath, 'utf-8');
  }

  frontendEnvContent = updateEnvVar(
    frontendEnvContent,
    'NEXT_PUBLIC_APP_NAME',
    configState.appName
  );
  writeFileSync(frontendEnvPath, frontendEnvContent.trim() + '\n');
  console.log('Updated frontend/.env.local');

  outro('Setup complete! You can run this wizard again with `bun run configure`.');
}

main().catch(console.error);
