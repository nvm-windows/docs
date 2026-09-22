---
title: doctor
sidebar_position: 13
tags: [sync]
---

# nvm doctor

Detect and fix common NVM for Windows issues.

## Usage

```powershell
Usage: nvm doctor [<checks> ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[checks ...]` | No | Specific check names to run. When omitted, all checks run. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--autofix` | | Apply fixes automatically when supported. |
| `--list` | | List available checks without running them. |
| `--json` | | Structured JSON output for automation. |

## Behavior

| Detail | Description |
|--------|-------------|
| Backend | Delegates to `sync.exe doctor` |
| Failure | Occurs if sync utility is missing or cannot be resolved |
| Modes | Full check run, list-only, or autofix |

## Examples

```powershell
# run all checks
nvm doctor

# enumerate available checks only
nvm doctor --list

# run selected checks
nvm doctor path proxy

# run fixes where supported
nvm doctor --autofix

# structured output for automation
nvm doctor --json
```

## Sample output

```powershell
[OK] PATH layout
[OK] Mirror reachability
[WARN] Cached metadata is stale
```

## Verified transcript (local run)

```powershell
PS> nvm doctor --help
Usage: nvm doctor [<checks> ...] [flags]

Flags:
  --autofix
  --list
  --json
```

In enterprise environments, run doctor after rollout and during workstation health checks.
