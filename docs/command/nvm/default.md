---
title: default
sidebar_position: 7
---

# nvm default

Show the current default Node.js version.

## Usage

```powershell
Usage: nvm default [flags]
```

## Arguments

This command takes no arguments.

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Output `default` and optional `last` as JSON. |

## Output

| Format | Fields |
|--------|--------|
| Text | `Default` (current active version or `none`), `Last` (previous default when available) |
| JSON | `default`, optional `last` |

## Examples

```powershell
nvm default
nvm default --json
```

## Sample output

```powershell
Default : v24.1.0
Last    : v22.14.0
```

## Verified transcript (local run)

```powershell
PS> nvm default --help
Usage: nvm default [flags]

Flags:
	--json    Output in JSON format.
```
