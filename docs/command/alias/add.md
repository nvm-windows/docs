---
title: add
sidebar_position: 1
---

# nvm alias add

Add or update a named alias for a Node.js version.

## Usage

```powershell
nvm alias add <name> <version> [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<name>` | Yes | Alias name. Cannot contain spaces or use reserved names. |
| `<version>` | Yes | Target [version specifier](../../features/version-resolution) to resolve and store. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--silent` | `-s` | Suppress interactive override prompt when the alias already exists. |

## Examples

```powershell
nvm alias add legacy 18.20.8
nvm alias add legacy 20.19.1 --silent
nvm use legacy
```

## Sample output

```powershell
"legacy" now refers to v20.19.1
```
