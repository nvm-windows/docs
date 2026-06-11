---
title: env
sidebar_position: 8
---

# nvm env

Display environment details used by NVM for Windows.

## Usage

```powershell
Usage: nvm env [flags]
```

## Arguments

This command takes no arguments.

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Full diagnostic report as JSON. |

## Report sections

| Section | Contents |
|---------|----------|
| Computer | Windows version/build, shell, admin and developer mode |
| Installation | NVM for Windows version, install path, upgrade policy |
| Version management | Mode, active version, install/cache roots, sizes and counts |
| Mirrors | Node and npm mirror URLs and reachability |
| License | Optional license summary when available |

## Examples

```powershell
# human-readable diagnostics
nvm env

# machine-readable report for tooling/support
nvm env --json

# save to file for ticket attachment
nvm env --json > nvm-env.json
```

## Sample output

```powershell
NVM for Windows
├─ Version            : v2.0.0-alpha.1
├─ Status             : on
├─ Operating Mode     : shim
└─ Installed Versions : 4
```

## Verified transcript (local run)

```powershell
PS> nvm env --help
Usage: nvm env [flags]

Flags:
  --json    Output in JSON format.
```

Use this command when troubleshooting path, root, and runtime behavior.
