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
| [`reset`](./reset) | `rm` | Reset one value or `reset all` to restore defaults (preserves [`root`](../../../cfg/core#mode-and-install-location)). |
| [`docs`](./docs) | — | Show setting explanations. |

## `config set` value formats {/* #config-set-value-formats */}

| Type | Accepted values | Examples |
|------|-----------------|----------|
| Boolean | `true`, `false`, `1`, `0` | [`auto_install=true`](../../../cfg/core#project-detection-and-auto-behavior) |
| List | Comma-delimited | [`auto_detect=.nvmrc,.node-version,package.json`](../../../cfg/core#project-detection-and-auto-behavior) |
| URL | Scheme and host required | [`node_mirror=https://nodejs.org/dist`](../../../cfg/core#downloads-and-mirrors) |
| Mode | `shim` or `link` only | [`mode=shim`](../../../cfg/core#mode-and-install-location) |

:::tip[Certified Builds]
Some settings are policy-managed on Certified Builds; writes are blocked when Governance/machine policy controls the value. Community installs are not subject to HKLM policy locks.
:::

## Notes

- `config set mode=...` routes through the same path as `nvm use shim|link`.
- `config set disable_announcements=...` also updates scheduled task state.
- Secret values (like `access_token`) are masked in display output. `access_token` is for Certified Builds commercial licensing, not Community.
