---
title: cache
sidebar_position: 9
---

# nvm cache

View cached install assets. Default behavior when you run `nvm cache` with no subcommand.

**Alias for list:** `ls`

## Usage

```powershell
nvm cache [name ...] [flags]
nvm cache list [name ...] [flags]
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| *(default)* / [`list`](./list) | `ls` | List cache stores and files. |
| [`add`](./add) | — | Download and cache without installing. |
| [`remove`](./remove/) | `rm` | Remove cached artifacts. |

## Examples

```powershell
nvm cache
nvm cache list
nvm cache add 24
nvm cache remove version 24.1.0
nvm cache remove all
```

## Notes

- Removal can be blocked by policy (`allow_download_cache_removal=false`).

See [Download Cache](../../features/cache).
