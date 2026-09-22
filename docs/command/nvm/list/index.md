---
title: list
sidebar_position: 5
---

# nvm list

List installed Node.js versions. Default behavior when you run `nvm list` with no subcommand.

**Alias:** `ls`

## Usage

```powershell
nvm list [majors ...] [flags]
nvm list installed [majors ...] [flags]
```

## Subcommands

| Subcommand | Description |
|------------|-------------|
| *(default)* / `installed` | Installed versions — this page. |
| [`releases`](./releases) | Downloadable releases from mirrors. |
| [`cached`](./cached) | Versions in the download cache. |

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[majors ...]` | No | Numeric major filters (`18`, `20`). Named aliases are rejected. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--json` | | Structured JSON with installed, cached, and default markers. |

Also applies to [`releases`](./releases) and [`cached`](./cached): `--limit`, `--no-limit`.

## Examples

```powershell
nvm list
nvm list installed
nvm list installed 18 20
nvm list --json
```

## Sample output

```powershell
* 24.1.0    (default)
  22.14.0
  20.19.1
```
