# Copilot instructions — documentation i18n sync

You are updating **translation mirrors** for the NVM for Windows Docusaurus docs site (`nvm-windows/docs`).

Read **`AGENTS.md`** at the repo root before editing. It is the authoritative translation playbook.

## Task

When assigned an issue labeled **`i18n-sync`**:

1. Read the issue body for the triggering commit and list of changed English files.
2. For each locale mentioned, patch the matching files under that locale's mirror path (see `.github/i18n-locales.json`).
3. **Patch incrementally** — translate only sections that changed in English; preserve existing good translation elsewhere.
4. Open **one pull request** per issue (or update the existing PR branch). **Never push to `main`.**
5. Run `npm ci && npm run build` and fix any link or MDX errors before finishing.
6. Add PR labels from the locale config (`i18n`, `translation`, locale code).

## Path mapping

| English (source) | Locale mirror |
|------------------|---------------|
| `docs/<path>` | `i18n/<locale>/docusaurus-plugin-content-docs/current/<path>` |
| `docs/_components/<file>` | `i18n/<locale>/docusaurus-plugin-content-docs/current/_components/<file>` |

If a mirror file does not exist, create it from the English source and translate fully.

## Rules (summary)

- Translate `title`, `sidebar_label`, body prose, table headers, admonition titles, diagram labels.
- **Keep in English:** CLI commands, env vars, registry keys, product edition names (`Governance`, `Audit`), code blocks showing real tool output, URLs, file paths.
- **Keep unchanged in frontmatter:** `slug`, `sidebar_position`, `certified`, edition values, `draft`.
- MDX heading anchors: use `\{#english-anchor-id}` (backslash required) on headings that other pages link to.
- Slug pitfall: from pages with custom `slug` (e.g. `/cfg/ad`), use one fewer `../` when linking out — see AGENTS.md.
- Images: translate `alt` text; do not duplicate files in `static/img/`.
- Theme-only string changes may require updates to `i18n/<locale>/code.json` or `current.json`.

## PR checklist

- [ ] All changed English files have corresponding locale updates
- [ ] `npm run build` passes (both `en` and locale builds)
- [ ] PR labels include locale code (e.g. `ru`)
- [ ] PR targets `main` from a feature branch
- [ ] Do not modify English source files in `docs/` unless the issue explicitly asks

Translators on `@nvm-windows/docs_ru` (and future locale teams) will review the PR. Make the diff easy to review: minimal, focused changes.
