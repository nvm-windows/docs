---
title: Version Resolution
sidebar_position: 1
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

- [`nvm install`](../command/nvm/install)
- [`nvm uninstall`](../command/nvm/uninstall)
- [`nvm use`](../command/nvm/use)
- [`nvm pin`](../command/nvm/pin)
- [`nvm alias add`](../command/nvm/alias/add)
- [`nvm cache add`](../command/nvm/cache/add)
- [`nvm cache remove version`](../command/nvm/cache/remove/version)

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
| `package.json` `engines.node` | Exact version or semver constraint | Auto-detection treats this as a constraint. If the default version satisfies it, NVM for Windows keeps the default. |

Configured auto-detect files come from [`auto_detect`](../cfg/core#project-detection-and-auto-behavior). By default, NVM for Windows checks
`.nvmrc`, `.node-version`, and `package.json`.

### How a constraint picks an installed version

1. If the default version satisfies the constraint, NVM for Windows uses the default version.
2. If the default version does not satisfy the constraint, NVM for Windows uses the newest installed version that does.
3. If no installed version satisfies the constraint, NVM for Windows can install a match when `auto_install` is on. Open lower bounds such as `>=16` or `>20` pick the oldest catalog match in that case.

This applies to `engines.node` and to range text in `.nvmrc` or `.node-version`.

Example: default `13.14.0`, `engines.node` is `>=8.9`. `13.14.0` satisfies the range, so `node` stays on `13.14.0`.

Example: default `13.14.0`, `engines.node` is `>=20`. `13.14.0` does not satisfy the range, so `node` uses the newest installed 20+ version.

## Resolution order {/* #resolution-order */}

1. User alias mapping (from `nvm alias add`)
2. Reserved aliases (`latest`, `lts`, `lts/<codename>`)
3. Partial versions expanded to the best matching concrete release
4. Semver constraints resolved in constraint-aware flows (for example `engines.node` or caret/tilde ranges in detect files)
5. Read version string from the configured detect file in the current directory tree (auto-detect)
6. Apply [`auto_use`](../cfg/core#project-detection-and-auto-behavior), [`auto_install`](../cfg/core#project-detection-and-auto-behavior), and related config when switching or installing

## Auto-detect Node.js version by project

In shim mode, NVM for Windows reads auto-detect files in the current directory. The default list is `.nvmrc`, `.node-version`, then `package.json`. The first file that yields a version wins.

If no file yields a version, NVM for Windows uses the default version (`nvm default`).

Shim runtime order:

1. `--nvm-use` / `--nvm-use=<version>` (this invocation only)
2. Auto-detect file in the current directory, when `auto_use` is on
3. Default version

`nvm list` and `nvm default` still show the default. They do not show the version the shim will run in this directory.

## See which version the shim will run

There is no `--nvm-use-which` flag. `--nvm-use` overrides the version for one command. `--nvm-which` prints how the shim resolved the version, then runs the command.

```powershell
node --nvm-which --version
npm --nvm-which --version
```

The line looks like this:

```text
nvm version resolution: source=package.json requested=>=8.9 effective=>=8.9 resolved=13.14.0 node=C:\Users\...\node.exe
```

| Field | Meaning |
|-------|---------|
| `source` | Why this version was chosen: `system_default`, a detect filename such as `package.json` or `.nvmrc`, or `override` for `--nvm-use`. |
| `requested` | Raw spec from that source. |
| `effective` | Spec after user alias mapping. |
| `resolved` | Concrete installed version. |
| `node` | Path of the real `node.exe`. |

See also [`node` shim flags](../command/node#shim-flags).

## Pinning a Node.js version to a project

`nvm pin` creates auto-detect files automatically. It accepts a version specifier, resolves it, and
writes the exact version to the auto-detect file.

```powershell
# set the active version, then pin .nvmrc
nvm use 24
nvm pin 24 --file=.nvmrc

# set package.json engines.node, engines.npm, and the equivalent devEngines properties
nvm pin 24 --file=package.json
```

## Related docs

- [Commands](/commands)
- [Command workflows](./command-workflows)
