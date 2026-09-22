---
sidebar_label: Firewall
sidebar_position: 6
---

# NVM Firewall

Frontline controls for Node version installs, npm package installs, and self-updating global CLI trust.

> Guide page for `feature-firewall`. Expand with ADMX screenshots and HTTPS policy contract examples before release.

## Pieces

| Firewall | Edition | Keys | Effect |
|----------|---------|------|--------|
| Version | Certified | `VersionAllowList` / `VersionBlockList` | Block `nvm install` of disallowed Node versions |
| Module | Certified | `ApprovedModules` / `ApprovedGlobalModules` | Block npm/pnpm/yarn/npx install of disallowed packages (shim mode) |
| Trust | Community + Certified | `TrustedModules`, `UntrustedModuleHandlerAction` | Auto-reshim or prompt when a global CLI self-updates |

## Commands

```text
nvm firewall trust module <entry>...          # both editions (HKCU; --machine for HKLM)
nvm firewall trust module list|ls [--json]            # effective TrustedModules (HKLM overrides HKCU)
nvm firewall distrust module <entry>...
nvm firewall distrust module list|ls [--json]  # same TrustedModules list as trust module list
nvm firewall allow version <entry>...         # certified
nvm firewall deny version <entry>...          # certified (stored as NOT <entry>)
nvm firewall allow module [--global] <entry>...
nvm firewall deny module [--global] <entry>...
```

`trust module` / `distrust module` write user preferences by default. `--machine` requires elevation. Certified `allow`/`deny` always require elevation.

## Defaults

- `TrustedModules` empty → `NOT ALL`
- `ApprovedModules` / `ApprovedGlobalModules` empty → `ALL`
- `UntrustedModuleHandlerAction` → `prompt` (console Y/N when terminal foreground; otherwise native toast with **Trust** / **Cancel**. Yes adds module to HKCU `TrustedModules` and reshims). Set `allow` to auto-reshim with a quiet toast (no Trust/Cancel). Set `deny` to skip prompt / auto-reshim. `nvm reshim` / script re-sign skips disk-changed modules unless trusted or handler is `allow`.
- Every untrusted-module change is audited as **NVM4406** (info, not error) in plain-text and structured logs, including when the handler is `allow` or the user accepts a prompt. Structured fields include `path`, `before_digest` / `after_digest`, and sizes when digests are unavailable (large binaries).
- `FirewallHTTPTimeoutSeconds` → `3`
- `FirewallSkipLockfile` → `0` (false): use nearest lockfile when present (`package-lock.json` / `npm-shrinkwrap.json`, or `pnpm-lock.yaml` / `yarn.lock` for those shims) for local matching and HTTPS policy POSTs; when `1`, use `package.json` only.

## Bare install (`npm install` with no package names)

For expandable install commands (`npm install`, `pnpm install`, `yarn`, and similar), NVM resolves modules from the nearest project manifest:

1. When `FirewallSkipLockfile` is false (default) and a lockfile exists for the active shim, use extracted lock packages for local rules and HTTPS POST body (`text/plain`, newline-delimited names).
2. Otherwise POST the raw `package.json` bytes (`application/json`) with header `x-nvm-package-shasum` (SHA-256 hex of the file). Lock-derived POST bodies do not send `x-nvm-package-shasum`.

## HTTPS policy URL

If a list contains a single `https://…` URL, NVM POSTs to that endpoint for remote evaluation. Expect `200` (allow) or `403` (tab-delimited blocks: `name<TAB>date<TAB>reason`). TLS verified; optional `TrustedFirewallSigners` / `TrustedFirewallThumbprint`. Fail closed on timeout/errors.

Authenticated policy servers receive a short-lived (2 minute) firewall JWT on `Authorization: Bearer <token>`. Claim shape:

- `desktop.pwd` — absolute working directory
- `nvm.shim` / `nvm.node_version` — proxied entrypoint and active Node
- `npm` | `pnpm` | `yarn` — `{ user, config, authenticated? }` for the active package manager (other families omitted). `user` is the npm username string when known (`null` otherwise): from npmrc `:username` / `_auth` / JWT claims on the **same registry host** as the primary credential, or from a local identity cache. If still unknown while a credential is present, NVM may run `npm whoami` once (via `node` + `npm-cli.js`, bypassing the shim) and cache the result — on login/whoami hooks and on the first firewall JWT mint that needs it. Later mints stay offline. `authenticated` is `true` when an npmrc credential is present (local check only). `npm logout` clears the cache. `config` is the scrubbed npmrc/yarnrc merge.

Set `ApplyVerboseFirewallMetadata` to also include verbose identity claims (`idp_*`).

`User-Agent` is `NVM for Windows/<version> <build>` where `<build>` is `community` or `certified`.

## Limits

Shim mode only for module/trust runtime gates. Link mode and non-proxied package managers bypass these controls.

Human-readable firewall list output shows at most **20** entries, then `and N more` when additional rules exist (`--json` is uncapped).
