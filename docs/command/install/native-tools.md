---
title: native-tools
sidebar_position: 2
---

# nvm install native-tools

Run `install_tools.bat` from the newest installed Node.js version that includes it.

This is only necessary for compiling native modules.

:::warning[Large Download]
This utility often installs large files (3GB+), alternative installers (like chocolatey), and other runtimes (like Python). This plaintext script is shipped with Node.js. NVM for Windows does not validate it.
:::

:::tip[Recommendation]
Disable this in regulated environments.
:::

## Usage

```powershell
nvm install native-tools
```

## Arguments

This subcommand takes no arguments.

## Flags

This subcommand has no flags.

## Behavior

| Detail | Description |
|--------|-------------|
| Policy | Blocked when `allow_tool_install` is disabled. |
| Detection | Fails when no installed version includes `install_tools.bat`. |
| Execution | Runs via `cmd.exe` in the detected tools directory. |

## Example

```powershell
nvm install native-tools
```
