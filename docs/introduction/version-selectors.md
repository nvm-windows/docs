---
title: Version Selectors
sidebar_position: 6
---

# Version Selectors

Version **selectors** describe acceptable Node.js ranges in project pinning and auto-detect files. They are evaluated when NVM reads a project file (shim mode) or when you interpret engine constraints—not when you pass a bare version token to `install`, `use`, or `uninstall`.

For command-line version arguments, see [Version Specifiers](./version-specifiers).

## Where selectors apply

| Source | Typical content | Behavior |
|--------|-----------------|----------|
| `.nvmrc` | Exact version (`24.1.0`) or constraint | Auto-detect picks matching installed or installable version. |
| `.node-version` | Same as `.nvmrc` | Same resolution path as `.nvmrc`. |
| `package.json` `engines.node` | Semver constraint or exact | Constraint-aware resolution; `nvm rc` writes concrete `engines.node` and `engines.npm`. |

Configured detect files come from `auto_detect` (default: `.nvmrc`, `.node-version`, `package.json`).

## Constraint forms

| Constraint | Example | Meaning |
|------------|---------|---------|
| Caret | `^18` | Compatible with major 18. |
| Tilde | `~20.1` | Compatible with minor 20.1. |
| Minimum | `>=16` | At least version 16. |
| Wildcard minor | `18.x` | Any 18.x release. |
| Any | `*` | No constraint |
| Exact | `24.1.0` | Specific version (no range operator). |

## Pinning workflow

```powershell
# set active runtime, then pin project file
nvm use 24
nvm rc 24 --file=.nvmrc

# pin package.json engines (concrete versions after resolve)
nvm rc 24 --file=package.json
```

`nvm rc` accepts a [version specifier](./version-specifiers) on the CLI and writes the resolved result into the target file. Files you edit by hand can use selector constraints directly.

## Resolution order {/* #resolution-order */}

1. User alias mapping (from `nvm alias add`)
2. Reserved aliases (`latest`, `lts`, `lts/<codename>`)
3. Partial versions expanded to the best matching concrete release
4. Semver constraints resolved in constraint-aware flows (for example `engines.node` or caret/tilde ranges in detect files)
5. Read version string from the configured detect file in the current directory tree (auto-detect)
6. Apply `auto_use`, `auto_install`, and related config when switching or installing

## Examples

`.nvmrc` with a constraint:

```text
^20
```

`package.json` excerpt:

```json
{
  "engines": {
    "node": ">=18 <21"
  }
}
```

## Related docs

- [Version Specifiers](./version-specifiers) — operational CLI arguments
- [nvm rc](../command/rc)
- [Command workflows](./command-workflows)
- [Operating Modes](./modes)
