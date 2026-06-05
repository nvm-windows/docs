---
title: alias
sidebar_position: 6
---

# nvm alias

Manage named aliases for Node.js versions.

## Usage

```powershell
Usage: nvm alias <command>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| [`add`](./add) | — | Add or update an alias (default when args provided). |
| [`list`](./list) | `ls` | List aliases. |
| [`remove`](./remove) | `rm` | Remove one or more aliases. |

## Reserved names

| Name | Notes |
|------|-------|
| `default`, `current`, `latest`, `lts`, `last` | Built-in command semantics |
| `daily`, `alpha`, `beta`, `prerelease` | Reserved for future use |
| `link`, `shim` | Operating mode names |
| `lts/*` | Reserved LTS namespace (for example `lts/iron`) |

## Notes

- Alias targets are normalized to concrete versions at add time.
- Treat alias names as canonical lowercase for consistency.
