---
title: list
sidebar_position: 2
---

# nvm cache list

List cache stores and their files.

**Alias:** `ls`

## Usage

```powershell
nvm cache list [name ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[name ...]` | No | Filter by cache name (for example `versions`, `metadata`). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Cache roots, file counts, and file lists as JSON. |

## Examples

```powershell
nvm cache list
nvm cache list --json
```

## Sample output

```powershell
Versions : node-v24.1.0-win-x64.7z
Metadata : index.tab
```
