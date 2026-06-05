---
title: use
sidebar_position: 3
---

# nvm use

Switch the default Node.js version.

## Usage

```powershell
nvm use <version> [flags]
```

Default subcommand when you pass a version directly (for example `nvm use 24`).

## Subcommands

| Subcommand | Description |
|------------|-------------|
| *(default)* | Set active version — this page. |
| [`lts`](./lts) | Use the most recent LTS or a named LTS line. |
| [`latest`](./latest) | Use the highest semver among installed versions. |
| [`last`](./last) | Use the previously active default. |
| [`shim`](./shim) | Switch to shim operating mode. |
| [`link`](./link) | Switch to link operating mode. |

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<version>` | Yes | [Version specifier](../../guide/version-specifiers). May install when missing unless `--local` is set. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--install` | `-i` | Install the requested version if missing. Overrides `auto_install=false`. |
| `--no-install` | `-n` | Do not install if missing. Overrides `auto_install=true`. |
| `--local` | `-l` | Use latest **installed** match for a partial version. Never installs. |

## Examples

```powershell
nvm use 24
nvm use 24.2.0 --install
nvm use 24 --no-install
nvm use 24 --local
```

## Sample output

```powershell
Now using Node.js v24.1.0 by default.
```

## Notes

- Stores the current default and updates `last_version`.
- In shim mode, a reshim runs after activation.
- In link mode, `.nodejs` points to the linked active runtime path.
