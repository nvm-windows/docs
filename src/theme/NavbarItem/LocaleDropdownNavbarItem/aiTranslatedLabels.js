/**
 * Pill copy for the language being offered, not the active site locale.
 * Pulls `locale.aiTranslated` from each `i18n/<locale>/code.json`.
 */
const labels = {};

const ctx = require.context('@site/i18n', true, /^\.\/[^/]+\/code\.json$/);

for (const key of ctx.keys()) {
  const match = key.match(/^\.\/([^/]+)\/code\.json$/);
  if (!match) {
    continue;
  }

  const message = ctx(key)['locale.aiTranslated']?.message;
  if (typeof message === 'string' && message.trim()) {
    labels[match[1]] = message.trim();
  }
}

export default labels;
