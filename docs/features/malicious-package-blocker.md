---
title: Malicious Package Blocker
sidebar_label: Malicious Package Blocker
sidebar_position: 10
---

# Malicious Package Blocker

The Malicious Package Blocker stops an `npm`, `pnpm`, `yarn`, or bun install when a package name and version match the [OpenSSF Malicious Packages](https://github.com/ossf/malicious-packages) dataset.
Bun is checked only when [`shim_bun`](../cfg/core#package-managers) is on.

It looks up names in a signed local file (`malware.db`).
It is not a file scanner.
It does not inspect tarball contents.

It is not the [module firewall](./firewall).
The module firewall applies **your** allow and deny lists.
This blocker applies a public feed of **known-malicious** names.

Checks run in [shim mode](./modes).
They are on by default on Community Builds and Certified Builds.

A match is a terminal error.
That install command does not continue.
Each blocked name prints `NVM blocked <name> — <reason>. (NVM4602)`.
OpenSSF uses `recognized as malware (OpenSSF)`.
A local organization pattern uses `organization malware block`.
A remote 403 uses `remote malware policy`, then `: <reason>` when the TSV column is present.

## What it checks

| Build | Checked |
|:-|:-|
| Community Build | The named package on `npm install <name>` (and the equivalent `pnpm` / `yarn` commands). Direct `package.json` dependencies on a bare `npm install`. No lockfile. No transitive dependencies. |
| Certified Builds | Community checks, plus the project lockfile. The lockfile is the resolved graph, including transitive dependencies. Certified Builds also check that lockfile when `node` starts in the project directory. |

Community Builds do not read the lockfile.
Community Builds do not check transitive dependencies.
Community Builds do not check when `node` starts.

If `malware.db` is missing, install-time refresh and hourly sync download it. A missing or untrusted file still blocks after that attempt fails, except when `AirGapped` is on and **no** trusted file exists.

Certified MSI builds snapshot the live feed at pack time (`utils\malware.db` + `utils\head.cose` in Program Files). That pair is a fallback only. Live feed always wins when reachable. The shim uses the user data-root pair only when `head.cose` verifies and `state_hash` matches; otherwise it reads the Program Files seed. Do not copy `malware.db` by hand unless both the live pair and the seed are gone.

Certified Builds may run a lockfile-only package-manager pass before extract.
Stderr can show `scanning...` during that pass.
A reused stamp does not show that line.

## Skip the checks

Set [`skip_malware_checks`](../cfg/core#logging-and-announcements) to `true` to skip shim lookups.

```powershell
nvm config set skip_malware_checks=true
```

HKLM `SkipMalwareChecks` wins over HKCU.
The definition file still updates when checks are skipped.

## Allow a false positive

`MalwareAllowList` is HKLM only.
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
| `MalwareBlockList` | HKLM patterns that always block, or one `https://` policy URL. Community Builds ignore this list. |
| `MalwareTrustConflict` | `prevent` (default) still blocks an OpenSSF hit when the name is explicitly trusted or approved. `continue` lets that trust or approval through. Community Builds ignore this key. |

Bundled package-manager trust seeds (`npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm`, `vlt`) do not count as trust for this check.

A malware block does not write `package_manager.install`.
**NVM4602** is the record when Advanced Logging is on.

### Remote HTTPS body (Certified Builds)

When `MalwareBlockList` is one `https://` URL, the shim POSTs hits during install. A **403** body is TSV:

```text
name<TAB>date<TAB>reason
```

`reason` is optional. Empty reason uses `remote malware policy`. A custom reason is used only for that request. It is not written back to policy.

Local `MalwareBlockList` patterns stay `organization malware block`. They do not take a custom reason.

### Inspect a name

```powershell
nvm malware status left-pad
nvm malware status left-pad --json
```

`status` is local only. It does not POST.
An `allowed` row whose message says the block was overruled still means OpenSSF (or the org list) hit. That policy let it through.
See [`nvm malware status`](../command/nvm/malware/status).

## Notifications

A hit always prints in the terminal.

When the console is in the background, Windows also shows a toast.
The title is **Malicious package blocked** for OpenSSF-only hits, **Organization malware block** for local-list-only hits, and **Package blocked** when sources mix or a remote 403 kept the name.
The body names at most three packages, then `and N more`.
The cue is `Notification.Reminder`.
[`disable_announcements`](../cfg/core#logging-and-announcements) does not hide this toast.

On a Community Build joined to Active Directory, Entra, or Google Workspace, that body adds: `Certified keeps a record of blocks like this for your security tools.`

Certified Builds can also show **Malware definitions updated** after a successful definition change.
**Don't show again** sets `notify_malware_definitions` to false.
See [Desktop Notifications](./notifications).

## Cache

Stamps live under `.cache/malware-scan`.
`malware.db` lives in the NVM data root.

```powershell
nvm cache list malware
nvm cache remove malware
nvm cache remove malware --prompt
```

`nvm cache remove all` removes the stamps and `malware.db`.
Removal honors [`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors).
See [Download Cache](./cache) and [`nvm cache remove malware`](../command/nvm/cache/remove/malware).

## Events

These events need the Advanced Logging add-on.
They use Windows Event ID 120 on **NVM for Windows/Operational**.

| Code | Event |
|:-|:-|
| **NVM4601** | `malware.definitions_updated` |
| **NVM4602** | `malware.package_blocked` — package, version, command, `source`, `reason` |

See [Event Logging](./log) and [Error Codes](../troubleshooting/error-codes).

## Related

- [NVM Firewall](./firewall) — your version, module, and trust policy
- [Choosing a Build](../guide/builds/)
- [Registry Policy Reference](../cfg/enterprise/registry)
