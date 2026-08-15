---
title: config
sidebar_position: 10
---

# nvm config

View and manage NVM for Windows configuration values.

**Alias:** `cfg`

## Usage

```powershell
Usage: nvm config (cfg) <command>
```

## Subcommands

| Subcommand | Aliases | Description |
|------------|---------|-------------|
| [`list`](./list) | `ls` | List all configuration values (default). |
| [`get`](./get) | — | Get one or more values. |
| [`set`](./set) | — | Set one or more values. |
| [`reset`](./reset) | `rm` | Reset a value to its default. |
| [`docs`](./docs) | — | Show setting explanations. |

## `config set` value formats {/* #config-set-value-formats */}

| Type | Accepted values | Examples |
|------|-----------------|----------|
| Boolean | `true`, `false`, `1`, `0` | `auto_install=true` |
| List | Comma-delimited | `auto_detect=.nvmrc,.node-version,package.json` |
| URL | Scheme and host required | `node_mirror=https://nodejs.org/dist` |
| Mode | `shim` or `link` only | `mode=shim` |

Some settings are policy-managed; writes are blocked when policy controls the value.

## Notes

- `config set mode=...` routes through the same path as `nvm use shim|link`.
- `config set disable_announcements=...` also updates scheduled task state.
- Secret values (like `access_token`) are masked in display output.
