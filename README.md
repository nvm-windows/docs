# docs

Documentation site for [NVM for Windows](https://github.com/nvm-windows/docs) (Docusaurus).

## Local development

```bash
npm ci
npm start
```

## Build

```bash
npm run build
```

Static output is written to `build/`.

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

## Deploy to Cloudflare Pages

Production deploys use **Direct Upload** (not Cloudflare Git integration).

### One-time setup

1. Create a Cloudflare API token with **Account → Cloudflare Pages → Edit**.
2. Create the Pages project (once):

   ```bash
   npx wrangler pages project create nvm-windows-docs --production-branch=main
   ```

   Or deploy once with Wrangler logged in; the project is created on first upload.
3. In GitHub repo settings → **Secrets and variables → Actions**, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. In the Cloudflare dashboard, attach custom domain `docs.nvm-windows.com` to project `nvm-windows-docs`.

Direct Upload projects cannot later switch to Pages Git integration; create a new project if you need that.

### Local deploy

Requires Wrangler auth (`npx wrangler login`) or `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in the environment:

```bash
npm run deploy
```

This runs `npm run build`, then:

```bash
wrangler pages deploy ./build --project-name=nvm-windows-docs --branch=main
```

### Automated deploy (releases)

Publishing a GitHub Release triggers [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which checks out the release tag and deploys `build/` to Cloudflare Pages production (`--branch=main`).

You can also run the workflow manually via **Actions → Deploy Cloudflare Pages → Run workflow**.
