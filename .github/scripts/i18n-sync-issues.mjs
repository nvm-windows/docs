#!/usr/bin/env node
/**
 * Creates or updates i18n-sync issues for Copilot cloud agent (Option A).
 * Reads .github/i18n-locales.json and changed files from the environment.
 */

import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), '.github/i18n-locales.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const commitSha = process.env.I18N_COMMIT_SHA ?? '';
const commitMessage = process.env.I18N_COMMIT_MESSAGE ?? '';
const repository = process.env.GITHUB_REPOSITORY ?? '';
const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
const changedFilesRaw = process.env.I18N_CHANGED_FILES ?? '';

const changedFiles = changedFilesRaw
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (changedFiles.length === 0) {
  console.log('No changed English source files; nothing to sync.');
  process.exit(0);
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
  console.log('Changed files do not affect translatable English source.');
  process.exit(0);
}

/** @param {import('node:fs').PathLike} p */
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
function buildIssueBody(locale) {
  const commitUrl = `${serverUrl}/${repository}/commit/${commitSha}`;
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

  return `## i18n sync request (${locale.name} / \`${locale.code}\`)

English docs changed on \`main\`. Please patch the **${locale.name}** translation mirror and open a pull request.

### Trigger commit

- SHA: \`${commitSha}\`
- Link: ${commitUrl}
- Message: ${commitMessage}

### Changed English files

${fileLines}

### Instructions

1. Read \`AGENTS.md\` and \`.github/copilot-instructions.md\`.
2. Patch files under \`${locale.docsPath}/\` (and \`${locale.componentsPath}/\` if needed).
3. Translate **only changed sections** where a mirror already exists; full-translate new files.
4. Run \`npm ci && npm run build\` — both locales must pass.
5. Open a PR to \`main\` with labels: ${locale.prLabels.map((l) => `\`${l}\``).join(', ')}.
6. **Do not push to \`main\`.**

### Locale paths

| Resource | Path |
|----------|------|
| Doc mirror | \`${locale.docsPath}/\` |
| Components | \`${locale.componentsPath}/\` |
| Theme strings | \`${locale.codeJsonPath}\` |
| Sidebar labels | \`${locale.currentJsonPath}\` |

Review team: \`@${repository.split('/')[0]}/${locale.reviewTeam}\`
`;
}

const outputs = [];

for (const locale of config.locales) {
  const title = `i18n(${locale.code}): sync English docs @ ${commitSha.slice(0, 7)}`;
  const body = buildIssueBody(locale);
  const labels = [config.issueLabel, locale.code, ...locale.prLabels.filter((l) => l !== locale.code)];

  outputs.push({
    locale: locale.code,
    title,
    body,
    labels: [...new Set(labels)],
  });
}

const outputPath = process.env.GITHUB_OUTPUT;
if (!outputPath) {
  console.log(JSON.stringify(outputs, null, 2));
  process.exit(0);
}

// GitHub Actions multiline output: one JSON blob for the workflow to parse.
fs.appendFileSync(outputPath, `issues<<EOF\n${JSON.stringify(outputs)}\nEOF\n`);
