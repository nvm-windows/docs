---
title: Package Manager Shims
sidebar_label: Package Manager Shims
sidebar_position: 3
slug: /command/package-manager-shims
---

# Package Manager Shims

In **shim** mode, package managers are not run from the active Node.js folder directly. NVM for Windows places hardlinks (or copies) of a single Zig binary — **`proxy.exe`** — on `PATH` under names such as `npm.exe`, `npx.exe`, `yarn.exe`, and `pnpm.exe`.

The proxy resolves the active Node.js version (same rules as the [node shim](/command/node)), verifies trust, then delegates to the matching tool under that install.

Global CLIs installed with those managers (for example `tsc`) use the same `proxy.exe` mechanism — see [Global Module Shims](/command/global-module-shims).

## How `proxy.exe` works

1. Read the invoked basename (`npm`, `yarn`, …) from `argv[0]`.
2. Parse and strip shim flags (`--nvm-use`, `--nvm-which`, `--nvm-shim-version`).
3. Verify self-integrity when launched from `{DataRoot}/.shim/*.exe` (byte-compare to canonical `{DataRoot}/proxy.exe`).
4. Resolve Node.js (preference / detection / `--nvm-use`) and optionally auto-install.
5. Check the version directory is safe (not a reparse point, not cross-user writable) — failure → **NVM4305**.
6. Locate the delegated command under the Node install (`.exe`, then `.cmd`, then `.bat`).
7. Enforce package-manager constraints when policy applies (npm / npx / pnpm / yarn).
8. Verify trust of `node.exe` and the delegated target (below).
9. Spawn the real tool (for npm/npx/corepack: often `node.exe` + `*-cli.js`; otherwise the `.exe` / `.cmd`).

Canonical binary: `{DataRoot}/proxy.exe`. Per-command shims: `{DataRoot}/.shim/{name}.exe` (hardlink or copy of `proxy.exe`).

`reshim` refreshes those hardlinks after installs, global package changes, and related events (also used for [global module shims](/command/global-module-shims)).

## Supported package managers

First-class names the proxy treats as constrained package managers:

| Command | Typical target under the active Node install |
|---------|-----------------------------------------------|
| `npm` | `npm.cmd` / `node_modules/npm/bin/npm-cli.js` |
| `npx` | `npx.cmd` / `node_modules/npm/bin/npx-cli.js` |
| `pnpm` | `pnpm.cmd` / `.exe` (also scanned from `PNPM_HOME\bin`) |
| `yarn` | `yarn.cmd` / `.exe` |
| `corepack` | `corepack` entry / `node_modules/corepack/dist/corepack.js` (when present) |

The same `--nvm-*` flags work on these commands:

```powershell
npm --nvm-which --version
npm --nvm-use=22 install
pnpm --nvm-shim-version
```

When `auto_install` is enabled, missing auto-detected Node versions prompt/install the same way as `node` for these managers.

After global-affecting operations (for example `npm install -g`, yarn global/dlx/plugins, corepack enable/use), the proxy may trigger **reshim** so new [global CLI shims](/command/global-module-shims) are created.

## Integrity verification

Shims fail closed when trust checks fail.

### Shim binary

| Subject | Check |
|---------|--------|
| `{DataRoot}/.shim/{name}.exe` | Contents must match `{DataRoot}/proxy.exe` |
| `{DataRoot}/.shim/node.exe` | Contents must match the program-root canonical node shim |

Mismatch → `shim integrity check failed`, exit `1`.

### Resolved `node.exe`

Same verify-cache / Authenticode path as the [node shim](/command/node). Cache state changes can surface as **NVM4303**; untrusted Node → **NVM4301**.

### Delegated package-manager targets

| Target type | Verification |
|-------------|--------------|
| npm / npx / corepack JS entry (`npm-cli.js`, `npx-cli.js`, `corepack.js`) | SHA-256 + TPM-signed **script trust** cache entry |
| Delegated `.exe` | Same verify-cache path used for `node.exe` |
| Delegated `.cmd` / `.bat` | SHA-256 + TPM-signed script trust cache entry |

Trust entries are written when versions are installed, activated, or reshimed (`SignVersionScripts` / `nvm` sign hooks). If a script changed since it was trusted, or no trust entry exists, launch is blocked (**NVM4306**). Remedy: `nvm reshim`, reinstall the version, or `nvm doctor --autofix` as appropriate.

:::warning
`node.exe` trust alone is not enough for package managers. Entrypoint scripts must also match the script trust cache (SEC-04).
:::

## Layout summary

```text
{DataRoot}/
  proxy.exe                 # canonical package-manager / global shim
  .shim/
    npm.exe                 # hardlink/copy of proxy.exe
    npx.exe
    yarn.exe
    pnpm.exe
    <global-cli>.exe        # see Global Module Shims
    node.exe                # separate node shim binary
  .verify/                  # verify-cache public key material
{InstallRoot}/vX.Y.Z/
  node.exe                  # real OpenJS Node.js
  npm.cmd / npx.cmd / ...
  node_modules/...
```

## Related

- [Global Module Shims](/command/global-module-shims)
- [node (shim)](/command/node)
- [Operating Modes](/features/modes)
- [`nvm use shim`](/command/nvm/use/shim)
- [Error Codes](/troubleshooting/error-codes) — NVM4301, NVM4303, NVM4305, NVM4306
