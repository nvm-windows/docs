---
title: releases
sidebar_position: 2
---

# nvm list releases

List downloadable Node.js releases from configured mirrors.

## Usage

```powershell
nvm list releases [majors ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[majors ...]` | No | Numeric major filters (`18`, `20`). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--limit` | `-l` | Maximum rows (default: `20`). |
| `--no-limit` | | List all matching releases. |
| `--json` | | Structured JSON output. |

## Examples

```powershell
nvm list releases
nvm list releases --no-limit
nvm list releases --limit 50
nvm list releases 22 --json
```

**Note:** `list-remote` / `ls-remote` redirect here.
