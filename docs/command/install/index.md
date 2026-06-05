---
title: install
sidebar_position: 1
---

# nvm install

Install one or more versions of Node.js.

**Aliases:** `i`, `add`

## Usage

```powershell
nvm install <version> [<version> ...] [flags]
```

Default subcommand when you pass version arguments directly (for example `nvm install 24`).

## Subcommands

| Subcommand | Description |
|------------|-------------|
| *(default)* | Install one or more versions — this page. |
| [`native-tools`](./native-tools) | Run `install_tools.bat` from the newest eligible install. |

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<version> ...` | Yes | One or more [version specifiers](../../introduction/version-specifiers). |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--copy-from` | | Copy global modules from an existing installed version at install time. |
| `--from` | | Install global modules using the module list from another installed version. |
| `--cache` | | Save downloaded artifacts into the cache for reuse. |
| `--no-cache` | | Install without caching (unless local-only policy/source applies). |
| `--force` | | Reinstall even if the target version already exists. |
| `--insecure` | | Accept invalid TLS/SSL certificates from download sources. Use only in controlled networks. |

Internal flags (`--notify`, `--debug`) exist for automation and are hidden from normal help output.

## Examples

```powershell
nvm install lts
nvm install 24
nvm install 22.14.0 20.19.1
nvm install lts/iron
nvm install 24 --cache
nvm install 24 --no-cache
nvm install 24.0.0 --force
nvm install 24 --copy-from=22.14.0
nvm install 24 --from=22.14.0
```

## Sample output

```powershell
Installing Node.js v24.1.0...
Downloading node-v24.1.0-win-x64.7z...
Extracting files...
Installed Node.js v24.1.0
```

## Behavior notes

- If `local_dir` is configured, installs use that location as the source/cache root.
- If `local_install_only` is enabled, installs are restricted to local sources.
- Auto-install module list (`auto_installed_modules`) is applied during install.

See also [nvm cache](../cache/) and [nvm use](../use/).
