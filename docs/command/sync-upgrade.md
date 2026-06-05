---
title: upgrade
sidebar_position: 14
tags: [sync]
---

# nvm upgrade

Upgrade NVM for Windows.

## Usage

```powershell
Usage: nvm upgrade [flags]
```

## Arguments

This command takes no arguments.

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--check` | | Check for updates without performing the upgrade. |

## Behavior

| Detail | Description |
|--------|-------------|
| Backend | Delegates to `sync.exe upgrade` |
| `--check` | Runs sync upgrade in check-only mode |
| Policy | Upgrade execution blocked when `disable_upgrade=true`; check-only still allowed |

## Examples

```powershell
# check only
nvm upgrade --check

# perform upgrade flow
nvm upgrade
```

## Sample output

```powershell
Checking for updates...
No updates available.
```

## Verified transcript (local run)

```powershell
PS> nvm upgrade --help
Usage: nvm upgrade [flags]

Flags:
  --check    Check for updates without performing the upgrade.
```

Use `--check` in scripts or monitoring jobs when you only need availability status.
