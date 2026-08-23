---
title: Version Resolution
---

import VersionConstraintTable from '../_components/VersionConstraintTable.mdx';
import VersionSpecifierTable from '../_components/VersionSpecifierTable.mdx';

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

<VersionSpecifierTable />

Commands that accept version specifiers include:

- [`nvm install`](../command/install)
- [`nvm uninstall`](../command/uninstall)
- [`nvm use`](../command/use)
- [`nvm rtconfig`](../command/rtconfig)
- [`nvm alias add`](../command/alias/add)
- [`nvm cache add`](../command/cache/add)
- [`nvm cache remove version`](../command/cache/remove/version)

### Examples

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

## Version constraints

Version constraints describe acceptable releases in project pinning and
auto-detect files. Unlike a command-line specifier, a constraint can match a
range of releases.

<VersionConstraintTable />

Constraints can appear in the following project files:

| Source | Typical content | Behavior |
|--------|-----------------|----------|
| `.nvmrc` | Exact version or constraint | Auto-detection resolves a matching version. |
| `.node-version` | Exact version or constraint | Uses the same resolution path as `.nvmrc`. |
| `package.json` `engines.node` | Exact version or semver constraint | Auto-detection resolves a version satisfying the Node.js engine constraint. |

Configured auto-detect files come from `auto_detect`. By default, NVM for Windows checks
`.nvmrc`, `.node-version`, and `package.json`.

## Resolution order {/* #resolution-order */}

1. User alias mapping (from `nvm alias add`)
2. Reserved aliases (`latest`, `lts`, `lts/<codename>`)
3. Partial versions expanded to the best matching concrete release
4. Semver constraints resolved in constraint-aware flows (for example `engines.node` or caret/tilde ranges in detect files)
5. Read version string from the configured detect file in the current directory tree (auto-detect)
6. Apply `auto_use`, `auto_install`, and related config when switching or installing

## Auto-detect Node.js version by project

In shim mode, NVM for Windows resolves the Node.js version from an auto-detect file (.nvmrc, .node-version, package.json, etc.). If no version can be resolved, it falls back to the default system version.

## Pinning a Node.js version to a project

`nvm rtconfig` creates auto-detect files automatically. It accepts a version specifier, resolves it, and
writes the exact version to the auto-detect file.

```powershell
# set the active version, then pin .nvmrc
nvm use 24
nvm rtconfig 24 --file=.nvmrc

# set package.json engines.node, engines.npm, and the equivalent devEngines properties
nvm rtconfig 24 --file=package.json
```

## Related docs

- [Commands](/commands)
- [Command workflows](../guide/command-workflows)