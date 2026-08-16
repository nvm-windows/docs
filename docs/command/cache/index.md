---
title: cache
sidebar_position: 9
---

# nvm cache

View and manage cached install assets.

## Usage

```powershell
Usage: nvm cache <command>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| [`add`](./add) | — | Download and cache without installing. |
| [`view`](./view) | `ls` | List cache stores and files. |
| [`remove`](./remove/) | `rm` | Remove cached artifacts. |

## Examples

```powershell
nvm cache view
nvm cache add 24
nvm cache remove version 24.1.0
nvm cache remove all
```

## Notes

- Removal can be blocked by policy (`allow_download_cache_removal=false`).

See [Download Cache](../../features/cache).
