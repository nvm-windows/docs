---
title: set
sidebar_position: 3
---

# nvm config set

Set one or more configuration values.

## Usage

```powershell
nvm config set <key=value> [<key=value> ...]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<key=value> ...` | Yes | One or more assignments. See [value formats](/command/config#config-set-value-formats) on the parent page. |

## Examples

```powershell
nvm config set mode=shim
nvm config set auto_install=true auto_install_prompt=false
nvm config set auto_detect=.nvmrc,.node-version,package.json
nvm config set node_mirror=https://nodejs.org/dist
```

## Sample output

```powershell
mode : shim
```
