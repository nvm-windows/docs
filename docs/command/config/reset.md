---
title: reset
sidebar_position: 4
---

# nvm config reset

Reset a configuration option to its default.

**Alias:** `rm`

## Usage

```powershell
nvm config reset <name> [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<name>` | Yes | Configuration option to reset. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--quiet` | `-q` | Suppress prompts where applicable. |

## Examples

```powershell
nvm config reset cache_downloads
nvm config reset root --quiet
```
