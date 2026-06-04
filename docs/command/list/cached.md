---
title: cached
sidebar_position: 3
---

# nvm list cached

List Node.js versions present in the download cache.

## Usage

```powershell
nvm list cached [majors ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[majors ...]` | No | Numeric major filters (`18`, `20`). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Structured JSON output. |

## Examples

```powershell
nvm list cached
nvm list cached 20
nvm list cached --json
```
