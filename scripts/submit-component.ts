import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');
const LOCAL_COMPONENTS_DIR = join(ROOT, 'frontend/src/components/local');
const REPO = 'sailflow/planks';

const componentName = process.argv[2];

if (!componentName) {
    console.error('Usage: bun run submit-component <ComponentName>');
    process.exit(1);
}

// 1. Locate Component
const componentPath = join(LOCAL_COMPONENTS_DIR, `${componentName}.tsx`);
if (!existsSync(componentPath)) {
    console.error(`Error: Component not found at ${componentPath}`);
    console.error(`Make sure you've created it in frontend/src/components/local/`);
    process.exit(1);
}

// 2. Read Content
const code = readFileSync(componentPath, 'utf8');

// 3. Construct Issue
const title = `[New Component] ${componentName}`;
const body = `
### Component Name
${componentName}

### Description
This component was created in a Keel project and is proposed for addition to the library.

### Code
\`\`\`tsx
${code}
\`\`\`

### Screenshot
<!-- Please drag and drop a screenshot here after submission -->
(Please attach a screenshot of the component in action)
`;

console.log(`Preparing to submit issue to ${REPO}...`);

// 4. Submit via gh CLI
try {
    // Check if gh is installed
    try {
        execSync('gh --version', { stdio: 'ignore' });
    } catch (e) {
        throw new Error('GitHub CLI (gh) is not installed. Please install it to automate submission.');
    }

    // Create issue
    // We use a temporary file for the body to avoid escaping issues
    const bodyPath = join(ROOT, 'tmp_issue_body.md');
    const { writeFileSync, unlinkSync } = require('fs');
    writeFileSync(bodyPath, body);

    const cmd = `gh issue create --repo ${REPO} --title "${title}" --body-file "${bodyPath}"`;
    console.log(`Running: ${cmd}`);

    const output = execSync(cmd, { encoding: 'utf8' });
    console.log('✅ Issue created successfully!');
    console.log(output);

    unlinkSync(bodyPath);

    console.log('\n👉 IMPORTANT: Open the link above and attach a screenshot!');

} catch (error: any) {
    console.error('❌ Failed to submit issue automatically.');
    console.error(error.message);
    console.log('\nYou can submit it manually here:');
    console.log(`https://github.com/${REPO}/issues/new`);
}
