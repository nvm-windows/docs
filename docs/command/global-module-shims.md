---
title: Global Module Shims
sidebar_label: Global Module Shims
sidebar_position: 4
slug: /command/global-module-shims
---

# Global Module Shims

In **shim** mode, globally installed CLI tools (anything that ships a `.cmd` next to the active Node install — for example `tsc`, `eslint`, `prettier`) are not invoked from that folder directly. NVM for Windows places a hardlink (or copy) of **`proxy.exe`** on `PATH` as `{DataRoot}/.shim/{name}.exe`.

Package managers (`npm`, `npx`, `yarn`, `pnpm`, `corepack`) use the same `proxy.exe` binary; see [Package Manager Shims](/command/package-manager-shims). The [node shim](/command/node) is a separate binary.

## How a global command is shimmed

1. You install a global package (for example `npm install -g typescript`).
2. The install (or a later proxy-triggered **reshim**) scans `*.cmd` basenames under the active Node version directory.
3. For pnpm-related tools, `reshim` also scans `PNPM_HOME\bin` when set, and always ensures a `pnpm` shim exists.
4. For each discovered name, `{DataRoot}/.shim/{name}.exe` is created as a hardlink/copy of `{DataRoot}/proxy.exe`.
5. Running `my-global-tool` hits the proxy. The proxy:
   - Parses `--nvm-use` / `--nvm-which` / `--nvm-shim-version` (same flags as the node shim)
   - Resolves the active Node.js version
   - Verifies trust (self, `node.exe`, delegated target)
   - Locates `my-global-tool.cmd` / `.exe` / `.bat` under that install and spawns it

Built-in prewarm list includes `node`, `npm`, `npx`, `yarn`, and `pnpm`. Other globals appear after install + reshim.

```powershell
npm install -g typescript
# reshim runs after global installs when needed
tsc --version
tsc --nvm-which --version
tsc --nvm-use=22 --version
```

:::tip
`node` itself is a separate shim binary (not `proxy.exe`). Global CLIs and package managers share `proxy.exe`.
:::

## When reshim runs

`reshim` refreshes hardlinks after:

- Node version installs / activation
- Global-affecting package-manager operations (for example `npm install -g`, yarn global/dlx/plugins, corepack enable/use)
- Explicit repair flows (`nvm doctor --autofix` / sync reshim)

If a new global CLI is missing from `PATH`, run reshim (or reinstall / activate the version) so `{DataRoot}/.shim/{name}.exe` is created.

## Integrity

Global shims use the same fail-closed trust path as package managers:

| Check | Behavior |
|-------|----------|
| Shim self-check | `{DataRoot}/.shim/{name}.exe` must byte-match `{DataRoot}/proxy.exe` |
| `node.exe` | Verify-cache / Authenticode (**NVM4301** / **NVM4303**) |
| Delegated `.cmd` / `.bat` / `.exe` | Script trust cache (SHA-256 + TPM-signed entry) or verify-cache for `.exe` — failure → **NVM4306** |
| Untrusted self-update | Entrypoint change while not on `TrustedModules` → **NVM4406** audit (deny / allow / prompt); see [Firewall](/guide/firewall) |

Trust entries are written at install, activation, and reshim. Details: [Package Manager Shims — Integrity](/command/package-manager-shims#integrity-verification).

## Layout

```text
{DataRoot}/
  proxy.exe
  .shim/
    npm.exe              # package managers (same binary)
    tsc.exe              # example global CLI hardlink → proxy.exe
    eslint.exe
    <global-cli>.exe
    node.exe             # separate node shim
{InstallRoot}/vX.Y.Z/
  tsc.cmd                # real launcher under active Node
  node_modules/...
```

## Related

- [Package Manager Shims](/command/package-manager-shims)
- [node (shim)](/command/node)
- [Operating Modes](/features/modes)
- [Error Codes](/troubleshooting/error-codes) — NVM4301, NVM4303, NVM4305, NVM4306, NVM4406
