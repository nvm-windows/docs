---
title: rc
sidebar_position: 4
---

# nvm rc

Create or update a run-command file (for example, `.nvmrc`).

## Usage

```powershell
Usage: nvm rc [<version>] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[<version>]` | No | [Version specifier](../features/version-resolution) to resolve and write. If omitted, uses the current active version. Pinning file formats: [Version Selectors](../features/version-resolution). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--file` | `-f` | Target file to write. Must be in configured `auto_detect` list. |
| `--install` | `-i` | Install target version when missing. |
| `--no-install` | `-n` | Do not auto-install missing version for this command. |

## Examples

```powershell
# write current active version to default detect file
nvm rc

# write explicit version to .nvmrc
nvm rc 24

# write to .node-version
nvm rc 22.14.0 --file=.node-version

# write package.json engines.node/npm
nvm rc 24 --file=package.json

# install if missing before writing
nvm rc 24 --install

# force no-install behavior for this command
nvm rc 24 --no-install
```

## Sample output

```powershell
Successfully set .nvmrc Node.js version to v24.1.0
```

## Verified transcript (local run)

```powershell
PS> nvm rc --help
Usage: nvm rc [<version>] [flags]

Flags:
	-f, --file=.nvmrc
	-i, --install
	-n, --no-install
```

## Behavior notes

- For `package.json`, command updates `engines.node` and `engines.npm`.
- For text detect files, command writes normalized Node.js version content.
- If `package.json` does not exist in the current directory, the command fails.

This command pins project runtime intent for shim-mode auto-detection.
