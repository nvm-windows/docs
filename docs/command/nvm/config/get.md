---
title: get
sidebar_position: 2
---

# nvm config get

Get one or more configuration values.

## Usage

```powershell
nvm config get <name> [<name> ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<name> ...` | Yes | Configuration option names. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Output requested keys as JSON. |

## Examples

```powershell
nvm config get mode
nvm config get mode root auto_install
nvm config get mode root --json
```
