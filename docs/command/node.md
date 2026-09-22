---
title: node (shim)
sidebar_label: node (shim)
sidebar_position: 2
slug: /command/node
---

# node (shim)

In **shim** mode, the `node` command is the NVM for Windows' Zig-built `node.exe` shim, not the Node.js binary. It dynamically resolves which version of Node.js to run, verifies the real `node.exe`, applies a thin security wrapper, and launches the real `node.exe`.

Switch modes with [`nvm use shim`](/command/nvm/use/shim) / [`nvm use link`](/command/nvm/use/link). Background: [Operating Modes](/features/modes).

## What the shim does

1. Parse shim-only flags (below); strip them before forwarding.
2. Resolve Node.js version (active preference, detection files, `--nvm-use`, aliases).
3. Optionally auto-install a missing version when configured.
4. Verify shim self-integrity when launched from the data-root `.shim` directory.
5. Verify the resolved `node.exe` (verify-cache / Authenticode) before spawn.
6. `CreateProcessW` the real Node.js with remaining arguments.

## Shim flags

These flags are consumed by the shim and are **not** passed to Node.js. They may appear anywhere on the command line.

| Flag | Purpose |
|------|---------|
| `--nvm-use <version>` | Run this invocation with a specific Node.js version (one-shot; does not change the default). |
| `--nvm-use=<version>` | Same as `--nvm-use <version>`. |
| `--nvm-which` | Print how the version was resolved (source, requested, effective, resolved path), then continue. |
| `--nvm-shim-version` | Print the shim executable version and exit. |

```powershell
node --version
node --nvm-which --version
node --nvm-use 22 script.js
node --nvm-use=22 script.js
node --nvm-shim-version
```

Example `--nvm-which` line:

```text
nvm version resolution: source=preference requested= effective=24.16.0 resolved=24.16.0 node=C:\Users\...\node.exe
```

## Version resolution

Without `--nvm-use`, the shim uses the same resolution rules as other shim-mode tools: registry preference, then project detection files (defaults include `.nvmrc`, `.node-version`, `package.json`), aliases, and related config. See [Version resolution](/guide/version-resolution).

Detection and auto-install are configurable (`auto_detect`, `auto_use`, `auto_install`, `auto_install_prompt`). See [Basic Configuration](/cfg/core#project-detection-and-auto-behavior).

## Integrity checks

| Check | When | Behavior |
|-------|------|----------|
| Shim self-check | Invoked from `{DataRoot}/.shim/node.exe` | Byte-compare against the program-root canonical shim. Mismatch → `shim integrity check failed`, exit `1`. |
| `node.exe` trust | Before every spawn | Prefer signed **verify-cache** hit (~1–2 ms). Cache miss/invalid → full Authenticode. Failure → blocked (e.g. **NVM4301**). |

If the verify-cache public key or entries are missing, the shim falls back to full Authenticode (slower, still secure). `nvm doctor` reports verify-cache health.

## Latency

The shim adds roughly 1–3 ms of resolution work. Windows still pays `CreateProcessW` twice (shim, then Node). Typical total overhead is ~25–35 ms versus link mode. Details: [Operating Modes](/features/modes).

## Related

- [Package Manager Shims](/command/package-manager-shims) — `proxy.exe` for npm/npx/yarn/pnpm
- [Global Module Shims](/command/global-module-shims) — `proxy.exe` hardlinks for global CLIs
- [`nvm use shim`](/command/nvm/use/shim)
- [Error Codes](/troubleshooting/error-codes) — NVM4301 and related security codes
