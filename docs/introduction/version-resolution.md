---
title: Version Resolution
sidebar_position: 5
---

# Version Resolution

NVM for Windows accepts several ways to identify a Node.js version. Depending on the
context, an input can name one release, identify a release line, or describe a
range of acceptable releases. NVM for Windows resolves that input to a concrete Node.js
version before performing an operation.

There are two kinds of version input:

- A **version specifier** is an operational command-line argument.
- A **version constraint** describes acceptable versions in a project file.

## Version specifiers

Version specifiers are tokens passed to commands such as `install`, `use`, and
`uninstall`.

| Form | Example | Resolution |
|------|---------|------------|
| Latest release | `latest` | Newest available release from the mirror index. |
| Latest LTS | `lts` | Newest available LTS release. |
| Named LTS line | `lts/iron` | Newest release from the named LTS line. |
| User alias | `legacy` | Version assigned with [`nvm alias add`](../command/alias/add). |
| Major only | `24` | Newest matching `24.x.x` release. |
| Major.minor | `24.1` | Newest matching `24.1.x` release. |
| Exact version | `24.1.0`, `v24.1.0` | The specified release. The `v` prefix is optional. |

Commands that accept version specifiers include:

- [`nvm install`](../command/install)
- [`nvm uninstall`](../command/uninstall)
- [`nvm use`](../command/use)
- [`nvm rc`](../command/rc)
- [`nvm alias add`](../command/alias/add)
- [`nvm cache add`](../command/cache/add)
- [`nvm cache remove version`](../command/cache/remove/version)

## Version constraints

Version constraints describe acceptable releases in project pinning and
auto-detect files. Unlike a command-line specifier, a constraint can match a
range of releases.

| Constraint | Example | Meaning |
|------------|---------|---------|
| Caret | `^18` | Compatible with major 18. |
| Tilde | `~20.1` | Compatible with minor 20.1. |
| Minimum | `>=16` | Version 16 or newer. |
| Range | `>=18 <21` | Version 18 or newer, but older than version 21. |
| Wildcard | `18.x` | Any release in the 18.x line. |
| Any | `*` | Any version. |
| Exact | `24.1.0` | Only the specified release. |

Constraints can appear in the following project files:

| Source | Typical content | Behavior |
|--------|-----------------|----------|
| `.nvmrc` | Exact version or constraint | Auto-detection resolves a matching version. |
| `.node-version` | Exact version or constraint | Uses the same resolution path as `.nvmrc`. |
| `package.json` `engines.node` | Exact version or semver constraint | Auto-detection resolves a version satisfying the Node.js engine constraint. |

Configured auto-detect files come from `auto_detect`. By default, NVM for Windows checks
`.nvmrc`, `.node-version`, and `package.json`.

## Resolution process

When NVM for Windows receives a version input, it determines what the input represents and
resolves it to a concrete release:

1. Resolve user-defined aliases created with `nvm alias add`.
2. Resolve reserved aliases such as `latest`, `lts`, and `lts/<codename>`.
3. Expand partial versions to the newest matching concrete release.
4. In constraint-aware project-file flows, select a release that satisfies the
   semver constraint.

The selected release may come from installed versions, the local cache, or the
configured remote mirror, depending on the command and configuration.

## Project auto-detection

In shim mode, NVM for Windows can detect project version intent while traversing the
configured project files in the current directory tree:

1. Read the version input from a configured auto-detect file.
2. Resolve an exact version or a version satisfying the file's constraint.
3. Apply `auto_use`, `auto_install`, and related configuration when switching
   to or installing the selected version.

## Pinning a project

`nvm rc` accepts a version specifier on the command line, resolves it, and
writes the concrete result into the target project file.

```powershell
# set the active runtime, then pin .nvmrc
nvm use 24
nvm rc 24 --file=.nvmrc

# update package.json engines.node and engines.npm
nvm rc 24 --file=package.json
```

Files edited by hand can use version constraints directly:

```text title=".nvmrc"
^20
```

```json title="package.json"
{
  "engines": {
    "node": ">=18 <21"
  }
}
```

## Examples

```powershell
# reserved aliases
nvm install lts
nvm use latest

# named LTS line
nvm install lts/iron

# partial and exact versions
nvm use 24.1
nvm cache add 22.14.0

# user-defined alias
nvm alias add stable 24.1.0
nvm use stable
```

## Related docs

- [nvm rc](../command/rc)
- [Command workflows](./command-workflows)
- [Operating Modes](./modes)
