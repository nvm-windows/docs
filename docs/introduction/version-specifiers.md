---
title: Version Specifiers
sidebar_position: 5
---

# Version Specifiers

Version **specifiers** are the tokens you pass on the command line when running operational commands. NVM resolves each specifier to a concrete Node.js release (or set of releases) before install, uninstall, switch, or cache work runs.

For constraint syntax used in project pinning files, see [Version Selectors](./version-selectors).

## Specifier forms

| Form | Example | Description |
|------|---------|-------------|
| Latest release | `latest` | Newest available release from the mirror index. |
| Latest LTS | `lts` | Most recent LTS release. |
| Named LTS line | `lts/iron` | Specific LTS codename. |
| User alias | `legacy` | Custom alias from [`nvm alias add`](../command/alias/add). |
| Major only | `24` | Latest matching `24.x.x`. |
| Major.minor | `24.1` | Latest matching `24.1.x`. |
| Exact semver | `24.1.0`, `v24.1.0` | Specific version (optional `v` prefix). |

## Commands that accept specifiers

| Command | Notes |
|---------|-------|
| [`nvm install`](../command/install) | One or more specifiers per invocation. |
| [`nvm uninstall`](../command/uninstall) | Each specifier is resolved before removal. |
| [`nvm use`](../command/use) | Sets default; may install when missing (unless `--local`). |
| [`nvm rc`](../command/rc) | CLI argument is a specifier; resolved version is written to the target file. |
| [`nvm alias add`](../command/alias/add) | Target argument is resolved to a concrete version at add time. |
| [`nvm cache add`](../command/cache/add) | Downloads archives without installing. |
| [`nvm cache remove version`](../command/cache/remove/version) | With `--all`, each token is a major or major.minor prefix. |

Resolution order is documented in [Version Selectors](./version-selectors#resolution-order).

## Examples

```powershell
# reserved aliases
nvm install lts
nvm use latest

# LTS codename
nvm install lts/iron

# partials
nvm install 24
nvm use 24.1

# user alias
nvm alias add stable 24.1.0
nvm use stable

# exact version
nvm uninstall 20.19.1
nvm cache add 22.14.0

# write resolved version to a project file
nvm rc 24.1.0
```

## Related docs

- [Version Selectors](./version-selectors) — pinning and project-file constraints
- [nvm install](../command/install)
- [nvm use](../command/use)
- [Command workflows](./command-workflows)
