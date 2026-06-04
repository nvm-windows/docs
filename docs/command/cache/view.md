---
title: view
sidebar_position: 2
---

# nvm cache view

List cache stores and their files.

**Alias:** `ls`

## Usage

```powershell
nvm cache view [name ...] [flags]
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
nvm cache view
nvm cache view --json
```

## Sample output

```powershell
Versions : node-v24.1.0-win-x64.7z
Metadata : index.tab
```
