---
title: reset
sidebar_position: 4
---

# nvm config reset

Reset configuration option(s) to their defaults.

**Alias:** `rm`

## Usage

```powershell
nvm config reset <name> [flags]
nvm config reset all [flags]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| *(default)* | Reset one option by name. |
| [`all`](./reset#reset-all) | Reset all options except protected keys (see below). |

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<name>` | Yes (single reset) | Configuration option to reset. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--quiet` | `-q` | Suppress non-essential output (`reset all` only). |

## Reset all

`nvm config reset all` deletes HKCU overrides so defaults apply again.

**Preserved (not reset):**

- [`root`](../../cfg/core#mode-and-install-location) — install directory stays as configured
- `active_version` — current default version pointer
- `access_token`, `access_key` — licensing values (use `nvm license set` / `nvm license clear`)
- Policy-managed options — skipped with a summary line

## Examples

```powershell
nvm config reset cache_downloads
nvm config reset root --quiet
nvm config reset all
nvm cfg rm all
```

## Sample output

```powershell
Reset 18 configuration option(s) to default.
Skipped 1 policy-managed option(s): node_mirror
```

## Verified transcript (local run)

```powershell
PS> nvm config reset --help
Usage: nvm config reset (rm) <command> [flags]

Flags:
  -q, --quiet   Suppress non-essential output.

Commands:
  all      Reset all configuration options to defaults except root.
  option   Reset one configuration option to its default (e.g. nvm config reset cache_downloads).
```
