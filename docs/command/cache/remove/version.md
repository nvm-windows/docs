---
title: version
sidebar_position: 1
---

# nvm cache remove version

Remove cached Node.js download archives. Default when you pass version arguments to `nvm cache remove`.

## Usage

```powershell
nvm cache remove version [version ...] [flags]
nvm cache remove [version ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[version ...]` | No* | [Version specifiers](../../../guide/version-resolution) to remove. With `--all`, each token is a major or major.minor prefix. *Required unless `--prompt` is used. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--all` | `-a` | Remove all cached versions matching each token as a prefix. |
| `--prompt` | `-p` | Interactive artifact selection (GUI). |

## Examples

```powershell
nvm cache remove version 24.1.0
nvm cache remove 20 22
nvm cache remove version 20.1 --all
nvm cache remove version --prompt
```
