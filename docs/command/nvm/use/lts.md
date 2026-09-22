---
title: lts
sidebar_position: 2
---

# nvm use lts

Use the most recent LTS release, or a named LTS line.

## Usage

```powershell
nvm use lts [alias]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[alias]` | No | LTS codename (for example `iron`). Resolves to `lts/<alias>`. Omit for latest LTS. |

## Examples

```powershell
nvm use lts
nvm use lts iron
```

Equivalent to `nvm use lts/iron` when a codename is provided.
