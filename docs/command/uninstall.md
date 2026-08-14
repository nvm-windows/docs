---
title: uninstall
sidebar_position: 2
---

# nvm uninstall

Uninstall one or more versions of Node.js.

**Aliases:** `rm`, `un`

## Usage

```powershell
Usage: nvm uninstall (rm,un) <version> ... [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `<version> ...` | Yes | One or more [version specifiers](../introduction/version-specifiers). Resolved before uninstall. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--purge` | | Remove matching cached download artifact(s) for each uninstalled version. |

Internal automation flag `--notify` exists in source and is hidden from help.

## Examples

```powershell
# uninstall exact version
nvm uninstall 20

# uninstall multiple versions in one call
nvm uninstall 20 18

# uninstall and purge cache for the same version
nvm uninstall 20.19.1 --purge

# uninstall via alias
nvm alias add oldlts 18.20.8
nvm uninstall oldlts
```

## Sample output

```powershell
Removed Node.js v20.19.1
Purged cached artifact for v20.19.1
```

## Verified transcript (local run)

```powershell
PS> nvm uninstall --help
Usage: nvm uninstall (rm,un) <version> ... [flags]

Uninstall one or more Node.js versions.

Flags:
	--purge    Purge the cache of this version (if cached).
```

## Notes

- You can uninstall multiple versions in one command.
- Use `--purge` when you want both runtime and artifact cleanup.
- If uninstalling the active default, set another default with `nvm use`.

See also [nvm list](./list/) and [nvm use](./use/).
