# docs

This is the source of [docs.nvm-windows.com](https://docs.nvm-windows.com) (Docusaurus).

## Local development

```bash
npm ci
npm start
```

## Search

The site uses [Algolia DocSearch](https://docsearch.algolia.com/). Search is
enabled at build time when all three of these environment variables are set:

- `ALGOLIA_APP_ID`
- `ALGOLIA_SEARCH_API_KEY`
- `ALGOLIA_INDEX_NAME`

The API key must be Algolia's public, search-only key. Never use an Admin API
key in the documentation site. Contextual search is enabled, so results are
filtered to the language and documentation version currently being viewed.

For local development, export the variables before starting the site:

```bash
export ALGOLIA_APP_ID="your-app-id"
export ALGOLIA_SEARCH_API_KEY="your-search-only-api-key"
export ALGOLIA_INDEX_NAME="your-index-name"
npm start
```

For production, add the same names as GitHub repository **Actions variables**
under **Settings → Secrets and variables → Actions → Variables**. These values
are embedded in the public client bundle and are not secrets. If none are set,
the site builds without search; if only some are set, the build fails with a
configuration error.

## Translations

Work should be limited `i18n\<language>`.

When the English documentation is updated, Copilot attempts to auto-translate the updates. These changes require review from the translation team. If you are contributing a new translation, please open an issue requesting a team be created for your language.
