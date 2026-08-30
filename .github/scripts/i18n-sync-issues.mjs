#!/usr/bin/env node
/**
 * Builds a Copilot CLI prompt from changed English doc paths.
 * Reads .github/i18n-locales.json and changed files from the environment.
 */

import fs from 'node:fs';

const configPath = `${process.cwd()}/.github/i18n-locales.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const commitSha = process.env.I18N_COMMIT_SHA ?? '';
const commitMessage = buildCommitMessage();
const repository = process.env.GITHUB_REPOSITORY ?? '';
const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const changedFilesRaw = process.env.I18N_CHANGED_FILES ?? '';
const outputPath = process.env.GITHUB_OUTPUT;

const changedFiles = changedFilesRaw
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

function buildCommitMessage() {
  if (process.env.I18N_EVENT_NAME === 'workflow_dispatch') {
    const actor = process.env.GITHUB_ACTOR ?? 'unknown';
    const note = (process.env.I18N_DISPATCH_NOTE ?? '').trim();
    return note ? `Manual dispatch by ${actor}: ${note}` : `Manual dispatch by ${actor}`;
  }
  return process.env.I18N_PUSH_COMMIT_MESSAGE ?? '';
}

function exitWithoutWork(message) {
  console.log(message);
  if (outputPath) {
    fs.appendFileSync(outputPath, 'has_work=false\n');
  }
  process.exit(0);
}

if (changedFiles.length === 0) {
  exitWithoutWork('No changed English source files; nothing to sync.');
}

/** @param {string} file */
function isRelevantSourceFile(file) {
  const prefixes = [
    `${config.sourcePath}/`,
    `${config.sourceComponentsPath}/`,
    ...config.themePaths.map((p) => `${p}/`),
  ];
  return prefixes.some((prefix) => file.startsWith(prefix));
}

const relevantChanges = changedFiles.filter(isRelevantSourceFile);
if (relevantChanges.length === 0) {
  exitWithoutWork('Changed files do not affect translatable English source.');
}

/** @param {object} locale */
function mirrorPathForLocale(locale, enFile) {
  if (enFile.startsWith(`${config.sourceComponentsPath}/`)) {
    const rel = enFile.slice(`${config.sourceComponentsPath}/`.length);
    return `${locale.componentsPath}/${rel}`;
  }
  if (enFile.startsWith(`${config.sourcePath}/`)) {
    const rel = enFile.slice(`${config.sourcePath}/`.length);
    return `${locale.docsPath}/${rel}`;
  }
  return null;
}

/** @param {object} locale */
function buildLocaleSection(locale) {
  const fileLines = relevantChanges
    .map((enFile) => {
      const mirror = mirrorPathForLocale(locale, enFile);
      if (mirror) {
        return `- \`${enFile}\` → \`${mirror}\``;
      }
      if (config.themePaths.some((p) => enFile.startsWith(`${p}/`))) {
        return `- \`${enFile}\` (theme — may need \`${locale.codeJsonPath}\` or \`${locale.currentJsonPath}\`)`;
      }
      return `- \`${enFile}\``;
    })
    .join('\n');

  return `## Locale: ${locale.name} (\`${locale.code}\`)

Patch the **${locale.name}** mirror paths below.

### Changed English files

${fileLines}

### Locale paths

| Resource | Path |
|----------|------|
| Doc mirror | \`${locale.docsPath}/\` |
| Components | \`${locale.componentsPath}/\` |
| Theme strings | \`${locale.codeJsonPath}\` |
| Sidebar labels | \`${locale.currentJsonPath}\` |

PR labels for this locale: ${locale.prLabels.map((l) => `\`${l}\``).join(', ')}
Review team: \`@${repository.split('/')[0]}/${locale.reviewTeam}\``;
}

function buildCopilotPrompt() {
  const commitUrl = `${serverUrl}/${repository}/commit/${commitSha}`;
  const localeSections = config.locales.map(buildLocaleSection).join('\n\n');

  return `# i18n translation sync

English docs changed on \`main\`. Patch translation mirrors and open pull request(s).

## Trigger commit

- SHA: \`${commitSha}\`
- Link: ${commitUrl}
- Message: ${commitMessage}

## Required reading

1. \`AGENTS.md\` (authoritative translation playbook)
2. \`.github/copilot-instructions.md\`
3. \`.github/i18n-locales.json\`

${localeSections}

## Task rules

1. Translate **only changed sections** where a mirror already exists; full-translate new files.
2. Run \`npm ci && npm run build\` — every configured locale must pass.
3. Open pull request(s) to \`main\` using \`gh pr create\`. Use labels \`i18n\`, \`translation\`, and each locale code.
4. **Never push to \`main\`.**
5. Create a feature branch, commit mirror updates, then open the PR.`;
}

const prompt = buildCopilotPrompt();
const promptFile = process.env.I18N_PROMPT_FILE;

if (promptFile) {
  fs.writeFileSync(promptFile, prompt, 'utf8');
}

if (!outputPath) {
  console.log(prompt);
  process.exit(0);
}

fs.appendFileSync(outputPath, 'has_work=true\n');
fs.appendFileSync(outputPath, `copilot_prompt<<EOF\n${prompt}\nEOF\n`);
