---
title: Malicious Package Blocker
sidebar_label: Malicious Package Blocker
sidebar_position: 10
---

# Malicious Package Blocker

The Malicious Package Blocker stops an `npm`, `pnpm`, `yarn`, `vlt`, or `bun` install when a package name and version match the [OpenSSF Malicious Packages](https://github.com/ossf/malicious-packages) dataset.
If you're using Bun as a package manager, malicious package checks only run when [`shim_bun`](../cfg/core#package-managers) is on.

:::warning[Shim Mode Only]
Malicious package checks only run in [shim mode](./modes).
:::

## Example

When a named install hits the OpenSSF feed, the shim prints a block line and the install does not continue:

```powershell
npm install left-pad
```

```text
NVM blocked left-pad — recognized as malware (OpenSSF). (NVM4602)
```

The same line appears for `pnpm`, `yarn`, `vlt`, and (when [`shim_bun`](../cfg/core#package-managers) is on) `bun`.
An organization list hit uses `organization malware block` instead of the OpenSSF reason.

## How it works
It looks up package names in a signed local file (`malware.db`) and blocks matches. This database is automatically updated with [notifications](./notifications). Malicious package blocking is enabled by default in both Community and Certified Builds.

- A match produces a terminal error and the install command does not continue.
- Each blocked name prints `NVM blocked <name> — <reason>. (NVM4602)`.
OpenSSF uses `recognized as malware (OpenSSF)`.
- A local organization pattern uses `organization malware block`.

### What it is not
- It is not a file scanner.
- It does not inspect tarball contents.
- It is not the [module firewall](./firewall).

The module firewall applies **your** allow and deny lists.

This blocker applies a public feed of **known-malicious** names.

## What it checks

| Build | Checked |
|:-|:-|
| Community&nbsp;Builds | The named package on `npm install <name>` (and the equivalent `pnpm` / `yarn` commands). Direct `package.json` dependencies on a bare `npm install`. No lockfile. No transitive dependencies. |
| Certified&nbsp;Builds | Community checks, plus the project lockfile. The lockfile is the resolved graph, including transitive dependencies. Certified Builds also check that lockfile when `node` starts in the project directory. |

Community Builds do not read the lockfile, check transitive dependencies, or check when `node` starts.

If `malware.db` is missing, install-time refresh and hourly sync processes download / seed it. A missing or untrusted file still blocks after that attempt fails, except when `AirGapped` is on and **no** trusted file exists.

Certified Build installers build a snapshot of the live feed at build time (`utils\malware.db` + `utils\head.cose` in Program Files). It serves as a fallback only. The live feed is always preferred when reachable. Do not copy `malware.db` by hand. NVM for Windows handles the entire update lifecycle using end-to-end integrity verification.

Certified Builds may run a lockfile-only package-manager pass before extract. `stderr` can show `scanning...` during that pass.

## Skip the checks

:::danger[Unsafe Practice]
Malicious package blocking adds some latency and is an enhancement that does not exist in normal Node.js workflows. This is why it can be disabled. However; we **strongly discourage disabling malicious package blocking** that increases the threat level on your computer.
:::

Set [`skip_malware_checks`](../cfg/core#logging-and-announcements) to `true` to skip shim lookups.

```powershell
nvm config set skip_malware_checks=true
```

:::tip[Force Malicious Package Blocking on Corporate Computers]
Certified Builds Governance users can force malicious package blocking via central policy.
:::

## Allow a false positive

`MalwareAllowList` is available for Certified Builds Governance policies.
See [Registry Policy Reference](../cfg/enterprise/registry).

Each string is one pattern.
Matching is byte for byte.
There is no case folding.

- `left-pad` allows every version of that name.
- `left-pad@1.0.0` allows that exact version only.
- `@scope/*` allows every package in that scope.
- `*` inside a name is a wildcard.

An empty list allows nothing.
A match skips the OpenSSF block and the install continues.
This list does not clear an organization block.

## Organization lists (Certified Builds)

Certified Builds also read:

| Key | Effect |
|:-|:-|
| `MalwareBlockList` | HKLM patterns that always block. Community Builds ignore this list. |
| `MalwareTrustConflict` | `prevent` (default) still blocks an OpenSSF hit when the name is explicitly trusted or approved. `continue` lets that trust or approval through. Community Builds ignore this key. |

Bundled package-manager trust seeds (`npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm`, `vlt`) do not count as trust for this check.

A malware block does not write `package_manager.install`.
**NVM4602** is the record when Advanced Logging is on.

### Inspect a name

```powershell
nvm malware status left-pad
nvm malware status left-pad --json
```

An `allowed` row whose message says the block was overruled still means OpenSSF (or the org list) identified a package as malicious, but your policy allowed it anyway.
See [`nvm malware status`](../command/nvm/malware/status).

## Notifications

A match always prints in the terminal.

When the console is in the background, Windows also shows a notification.
[`disable_announcements`](../cfg/core#logging-and-announcements) does not hide this notification.

## Cache

`malware.db` is stored in the NVM root and is managable through the cache command.

```powershell
nvm cache list malware
nvm cache remove malware
nvm cache remove malware --prompt
```

`nvm cache remove all` removes the stamps and `malware.db`.
Removal honors [`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors).
See [Download Cache](./cache) and [`nvm cache remove malware`](../command/nvm/cache/remove/malware).

## Events

These events require the Advanced Logging add-on.
They use Windows Event ID 120 on **NVM for Windows/Operational**.

| Code | Event |
|:-|:-|
| **NVM4601** | `malware.definitions_updated` |
| **NVM4602** | `malware.package_blocked` — package, version, command, `source`, `reason` |

See [Event Logging](./log) and [Error Codes](../troubleshooting/error-codes).

## Related

- [NVM Firewall](../guide/firewall) — your version, module, and trust policy
- [Choosing a Build](../guide/builds/)
- [Registry Policy Reference](../cfg/registry)
