---
title: pin
sidebar_position: 4
---

# nvm pin

Create or update a run-command file (for example, `.nvmrc`).

## Usage

```powershell
Usage: nvm pin [<version>] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[<version>]` | No | [Version specifier](../guide/version-resolution) to resolve and write. If omitted, uses the current active version. Pinning file formats: [Version Selectors](../guide/version-resolution). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--file` | `-f` | Target file to write. Must be in configured `auto_detect` list. |
| `--install` | `-i` | Install target version when missing. |
| `--no-install` | `-n` | Do not auto-install missing version for this command. |

## Examples

```powershell
# write current active version to default detect file
nvm pin

# write explicit version to .nvmrc
nvm pin 24

# write to .node-version
nvm pin 22.14.0 --file=.node-version

# write package.json engines.node/npm
nvm pin 24 --file=package.json

# install if missing before writing
nvm pin 24 --install

# force no-install behavior for this command
nvm pin 24 --no-install
```

## Sample output

```powershell
Successfully pinned .nvmrc Node.js version to v24.1.0
```

## Verified transcript (local run)

```powershell
PS> nvm pin --help
Usage: nvm pin [<version>] [flags]

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
