---
title: on
sidebar_position: 11
---

# nvm on

Enable Node.js management through NVM.

## Usage

```powershell
Usage: nvm on
```

## Arguments

This command takes no arguments.

## Flags

This command has no flags.

## Behavior

| Step | Detail |
|------|--------|
| Link setup | Mode-aware `.nodejs` target configuration |
| Link mode | Repairs link target when an active version exists |
| Shim mode | Runs shim refresh after activation |
| Settings | Sets [`enabled=true`](../cfg/core#related-settings) |

## Example

```powershell
nvm on
```

## Sample output

```powershell
NVM for Windows is now managing Node.js installations.
```

## Verified transcript (local run)

```powershell
PS> nvm on --help
Usage: nvm on

Manage Node.js with nvm.
```

## Typical use cases

- Re-enable management after temporary `nvm off`
- Restore expected links after manual path or link changes

Use this after maintenance, troubleshooting, or temporary suspension with `nvm off`.
