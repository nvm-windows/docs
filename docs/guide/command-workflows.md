---
title: Command Workflows
sidebar_position: 2
---

# Command Workflows

This guide explains common end-to-end CLI workflows.

## 1) New Machine Bootstrap

Install the latest LTS version of Node.js:

```powershell
nvm install lts
```

Set as default version:

```powershell
nvm use lts
```

Verify the default version:

```powershell
nvm default
node -v
```

Optional validation:

```powershell
nvm env
nvm doctor
```

## 2) Multi-Version Project Testing

Install multiple versions of Node.js at once:

```powershell
nvm install 18 20 22
```

All versions will be downloaded in parallel, then installed sequentially.

Switch between versions for testing:

```powershell
nvm use 18
npm test
nvm use 20
npm test
nvm use 22
npm test
```

Use aliases for convenience:

```powershell
nvm alias add legacy 18.20.8
nvm alias add modern 24.1.0
```

## 3) Project Pinning with Run Command Files

Set default version and create a local `.nvmrc` file:

```powershell
nvm use 24
nvm pin 24 --file=.nvmrc
```

Or update package engines:

```powershell
nvm pin 24 --file=package.json
```

## 4) Download-Constrained Environments

Pre-cache artifacts:

```powershell
nvm cache add 20 22 24
nvm cache list
```

Use cache controls during install:

```powershell
nvm install 24 --cache
```

Cleanup after rollout:

```powershell
nvm cache remove version 20.19.1
nvm cache remove all
```

## 5) Runtime Mode Management

Switch mode:

```powershell
nvm use shim
nvm use link
```

Temporarily disable/enable nvm:

```powershell
nvm off
nvm on
```

## 6) Configuration and Policy-Aware Operations

Inspect effective values:

```powershell
nvm config list
nvm config get mode root auto_install
```

Apply updates:

```powershell
nvm config set mode=shim auto_install=true
```

Reset to defaults:

```powershell
nvm config reset auto_install
```

## 7) Health and Upgrade Workflow

```powershell
nvm doctor --list
nvm doctor --autofix
nvm upgrade --check
nvm upgrade
```

## Related Docs

- [Commands](../command/install)
- [Version Specifiers](./version-resolution)
- [Version Selectors](./version-resolution)
- [nvm config](../command/config)
- [Operating Modes](../features/modes)
