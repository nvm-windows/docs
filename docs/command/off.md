---
title: off
sidebar_position: 12
---

# nvm off

Temporarily stop managing Node.js through NVM.

## Usage

```powershell
Usage: nvm off
```

## Arguments

This command takes no arguments.

## Flags

This command has no flags.

## Behavior

| Step | Detail |
|------|--------|
| Unlink | Removes the managed `.nodejs` target |
| Settings | Sets `enabled=false` |
| Installs | Installed Node.js versions remain on disk |

## Example

```powershell
nvm off
```

## Sample output

```powershell
NVM for Windows is no longer managing Node.js installations.
```

## Verified transcript (local run)

```powershell
PS> nvm off --help
Usage: nvm off

Stop managing Node.js with nvm.
```

## Typical use cases

- Short-term troubleshooting
- Temporary handoff to unmanaged runtime experiments

Use `nvm on` to re-enable management.
