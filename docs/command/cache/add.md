---
title: add
sidebar_position: 1
---

# nvm cache add

Download and cache Node.js archives without installing.

## Usage

```powershell
nvm cache add <version> [<version> ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<version> ...` | Yes | One or more [version specifiers](../../guide/version-specifiers). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--insecure` | | Accept invalid SSL certificates for download sources. |

## Examples

```powershell
nvm cache add 24
nvm cache add lts
nvm cache add 24 --insecure
```
