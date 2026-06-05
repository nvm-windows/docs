---
title: list
sidebar_position: 2
---

# nvm alias list

List configured version aliases.

**Alias:** `ls`

## Usage

```powershell
nvm alias list [alias ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[alias ...]` | No | Filter output to specific alias names. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Output alias map as JSON. |

## Examples

```powershell
nvm alias list
nvm alias list legacy stable
nvm alias list --json
```

## Sample output

```powershell
legacy -> v20.19.1
```
