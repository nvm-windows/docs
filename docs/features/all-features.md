---
title: All Features
sidebar_label: All Features
sidebar_position: 1.5
---

import PageLink from '@site/docs/_components/PageLink';
import PageDescription from '@site/docs/_components/PageDescription';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';

# All Features

This page lists user-facing features in NVM for Windows v2.
The list comes from the product (CLI, shims, settings, and license gates), not from the Features sidebar alone.
See [What's new in v2](./newv2) for a shorter v2 summary.

<div class="all-features-table">

## Runtime

| Feature | Description |
|:-|:-|
| [Operating Modes](./modes) | Run in shim mode or link mode. You can switch at any time. |
| Shim mode | Zig shims intercept `node` and package-manager commands. See [node shim](../command/node) and [Package Manager Shims](../command/package-manager-shims). |
| Link mode | A PATH junction points at the active Node.js directory. There is no per-command intercept. |
| One-shot version override | Pass `--nvm-use` or `--nvm-use=<version>` on a shimmed command. NVM strips that flag before Node.js runs. |
| Show resolved Node | Pass `--nvm-which` on a shimmed command. The shim prints source, requested version, effective version, path, then runs Node.js. |
| [On / off](../command/nvm/on) | `nvm on` manages Node.js. `nvm off` stops management and unlinks `.nodejs`. |
| No mandatory admin | Typical user operations do not need administrator rights. |

## Install and versions

| Feature | Description |
|:-|:-|
| [Install](../command/nvm/install/) | Install one or more Node.js versions. Specs include `latest`, `lts`, `lts/<codename>`, and `x.x.x`. |
| Parallel installations | Each requested version installs in its own goroutine. |
| Compact `.7z` archives | Downloads are Windows `.7z` archives (x64 or arm64). Size is about 40% smaller than the old layout. |
| Native extraction | NVM uses installed 7-Zip when present. Otherwise it uses the embedded extractor. |
| Force reinstall | `--force` backs up an existing version, then reinstalls it. |
| Insecure TLS | `--insecure` or `allow_insecure_downloads` allows expired or invalid TLS certificates. |
| Copy global modules | `--copy-from` copies globals from another installed version. `--from` reinstalls them. |
| Auto-installed globals | `auto_installed_modules` installs a defined set of globals with each new Node.js version. |
| [Native tools](../command/nvm/install/native-tools) | `nvm install native-tools` runs the newest `install_tools.bat` after Authenticode checks. `allow_tool_install` can block this. |
| [Uninstall](../command/nvm/uninstall) | Remove one or more versions. `--purge` also drops cache. `--from-apps` is a quiet Apps & features uninstall. |
| [Use](../command/nvm/use/) | Set the default version. `--install` can install a missing version. `--local` picks the latest installed partial match. |
| [Use latest](../command/nvm/use/latest) | `nvm use latest` selects the newest installed semver that has `node.exe`. |
| [Use LTS](../command/nvm/use/lts) | `nvm use lts` or `nvm use lts <codename>`. |
| [Use last](../command/nvm/use/last) | Restore the previous default (`last_version`). |
| [List installed](../command/nvm/list/) | List installed versions. Marks the default. Supports JSON and a major-version filter. |
| [List releases](../command/nvm/list/releases) | List the download catalog. Marks installed, cached, LTS, and security releases. |
| [Default](../command/nvm/default) | Show the default version and the last version. |
| [Aliases](../cfg/aliases) | Name a version with `nvm alias`. Reserved names such as `latest` and `lts` are blocked. |
| Process architecture | Archive architecture follows the NVM process (`amd64` → `x64`). There is no `--arch` flag. |

## Automation

| Feature | Description |
|:-|:-|
| [Version resolution](../guide/version-resolution) | Identify a version from a specifier, alias, LTS name, or project file. |
| Version files | Default detect files are `.nvmrc`, `.node-version`, `package.json`, and `package-lock.json`. You can change the list. |
| [Pin](../command/nvm/pin) | Write the version to the detect file or to `package.json` `engines`. Optional install. |
| Per-directory auto-use | In shim mode, the shim reads project files and runs that Node.js without changing the system default. |
| Auto-install missing versions | Install a required version when a project needs one that is not present. |
| Auto-install prompt | `auto_install_prompt` asks before that install. |
| Reshim | `nvm reshim` rebuilds [global module shims](../command/global-module-shims) and re-trusts package-manager entrypoints. |
| Job object | Reshim child processes exit when the parent closes, so they do not lock installs. |

## Cache and offline

| Feature | Description |
|:-|:-|
| [Download Cache](./cache) | Keep Node.js archives on disk. `--cache` / `--no-cache` override `cache_downloads`. |
| [Cache add](../command/nvm/cache/add) | Download into the cache without installing. |
| [Cache list / remove](../command/nvm/cache/) | List or remove version archives, metadata, malware stamps, `malware.db`, and mirror JWTs. |
| [Local Installations](./local-installations) | `local_dir` is the archive source. `local_install_only` never falls back to the network. |
| [Air-gapped](../guide/air-gapped-installations) | `air_gapped` skips live JWKS, uses offline COSE, and prefers cached Authenticode. Certified MSI ships a build-time `malware.db` seed; live feed wins when reachable. Skip scans only when no trusted db exists. |
| [Download Mirrors](./mirrors) | Ordered Node.js mirrors and npm registry URLs. The first successful response wins. |
| Network deadlines | Catalog, mirror, reachability, and download budgets. `--relax-deadlines` and `--timeout-*-ms` override them. `nvm doctor` can measure them. |

## Security

| Feature | Description |
|:-|:-|
| Authenticode | WinVerifyTrust on `node.exe` and package-manager binaries. See [Understanding Security](../guide/security). |
| Allowed publishers | `allowed_signers` is an organization allow list. `allowed_thumbprints` pins certificate leafs. |
| Revocation | `authenticode_revocation` is `online`, `cached`, or `disabled`. Air-gapped prefers cached. |
| Verify cache | A signed cache of trusted binaries. A miss runs full Authenticode. `nvm reshim` reseeds it. |
| DACL hardening | Protected DACLs on install, data, `.shim`, and proxy trees. `nvm doctor --autofix` can repair them. |
| Shim self-check | A shim launched from `.shim` compares itself to the installed shim. |
| Directory trust gate | The proxy blocks package managers when the active Node.js directory is writable by other users (**NVM4305**). |
| Delegated command trust | The proxy refuses an unknown, unsigned, or untrusted package-manager entrypoint (**NVM4306**). Run `nvm firewall trust module <name>`. |
| [Malicious Package Blocker](./malicious-package-blocker) | OpenSSF name/version lookup in signed `malware.db`. Not a file scanner. Default on in shim mode. |
| Direct dependency checks | Community Builds check the named package and direct `package.json` dependencies. They do not read a lockfile. |
| Transitive dependency checks | Certified Builds also read the project lockfile. They check it when `node` starts in the project directory. |
| Malware allow list | HKLM patterns that clear an OpenSSF hit. Byte-for-byte. `*` clears every OpenSSF hit. |
| Organization malware block list | Certified Builds only. Extra HKLM block patterns. Community Builds ignore this list. |
| Malware trust conflict | Certified Builds only. `prevent` (default) still blocks a trusted or approved OpenSSF hit. `continue` lets that trust through. |
| Skip malware checks | `skip_malware_checks` skips shim lookups. The definition file still updates. HKLM wins. |
| [NVM Firewall](./firewall) | Your version, module, and trust lists. This is not the Malicious Package Blocker. |
| Version firewall | Governance. `nvm firewall allow version` and `deny version` write `VersionAllowList` / `VersionBlockList`. Lists are ignored without a Governance license. |
| Module firewall | Governance. Allow or deny npm/pnpm/yarn/npx/vlt installs with local lists. Lists are ignored without a Governance license. |
| Trust firewall | Community Builds and Certified Builds. `nvm firewall trust module` and `distrust module`. Default seeds include npm, npx, yarn, yarnpkg, corepack, and pnpm. |
| Untrusted module action | `prompt`, `allow`, or `deny` when a global CLI self-updates. |
| Node permission model | Shim prepends `--permission` (Node 23+) or `--experimental-permission` (20–22). |
| Default / allowed grants | Insert `--allow-*` from policy. Drop caller `--allow-*` tokens that are not in the allow list. |
| Permission grant audit | Write `nodejs.permission_grants` when flags are supplied, applied, or removed. The command still runs. |
| Freeze V8 globals | Shim prepends `--frozen-intrinsics` (Node 12+). |
| Disallow eval | Shim prepends `--disallow-code-generation-from-strings`. |
| Package minimum age | Cooldown for npm/npx/pnpm/yarn/yarnpkg, vlt, and bun/bunx (when the bun wrap is on). Governance can force it. |
| Package-manager mismatch | `pm_mismatch_action` is `ignore`, `warn`, or `error` when npm/pnpm/yarn does not match Node.js. |

## Package managers

| Feature | Description |
|:-|:-|
| [Package Manager Shims](../command/package-manager-shims) | Proxy `npm`, `npx`, `yarn`, `pnpm`, and similar commands through `proxy.exe`. |
| [Global Module Shims](../command/global-module-shims) | Reshim writes PATH shims for global CLI commands. |
| Corepack | Proxy trampolines yarn/pnpm through `corepack.js`. Reshim runs on enable, disable, prepare, hydrate, and use. |
| vlt | The proxy treats `vlt` like other package managers for firewall argv and global reshim. |
| Bun wrap | Wrap existing `bun` / `bunx` so OpenSSF checks run. NVM does not install bun and does not switch bun versions. Default off on Community Builds. Default on on Certified Builds. |

## Windows integration

| Feature | Description |
|:-|:-|
| [Windows Apps](./windows-apps) | Each installed Node.js version appears in Apps & features. |
| [Event Logging](./log) | Community Builds write critical events to the Windows Application log. |
| Structured logging | [Advanced Logging](./certified-builds/advanced-logging) add-on for Certified Builds. Adds `EventName` and `Payload` for SIEM. See [SIEM](../guide/siem). |
| [Desktop Notifications](./notifications) | Native Windows Notification Center. Missed notifications stay until you acknowledge them. Upgrade, install, or apply a build from the notification. |
| Notification collections | Mute Releases, Hotfixes, Pre-releases, or News in Windows Settings. `nvm config` cannot flip an OS mute. |
| [Windows Registry](./windows-registry) | User preferences live under HKCU. Machine policy can override them on Certified Builds. |
| `nvm://` protocol | Notification actions: upgrade (`Update` / `Install` / `Apply`), firewall Trust, and mute malware definition notices. |
| Code signing | Community Builds and Certified Builds are code-signed. The publisher is Author Software Inc. |

## Configuration and diagnostics

| Feature | Description |
|:-|:-|
| [Config](../command/nvm/config/) | `nvm config` list, get, set, reset, and docs. HKLM policy wins over HKCU. |
| [Env](../command/nvm/env) | Environment report: mirrors, sizes, antivirus, permission flags, license. JSON is available. |
| [Doctor](../command/nvm/sync-doctor) | Detect and repair common issues. `--autofix` can restore DACLs and verify-cache. |
| [Upgrade](../command/nvm/sync-upgrade) | Upgrade NVM for Windows. `disable_upgrade` blocks in-app upgrade. |
| News and releases | Background sync shows news and update notifications. `disable_announcements` hides those. License expiry still runs. |
| Sync task | Background tick: license, malware definitions, news, and releases. |

## Builds, policy, and add-ons

| Feature | Description |
|:-|:-|
| Dual Builds | Community Builds (MIT) and Certified Builds (EULA). See <PageLink id="choosingABuild" />. |
| Community feature mode | A Certified Build without a commercial license keeps running with Community features. |
| License | Hidden `nvm license` writes HKLM. Certified Builds, Advanced Logging, and Governance need a sitewide license. |
| License expiry notifications | Certified Builds warn at 7, 3, and 1 day, on the expiry day, and daily in the 7-day grace window. |
| [Author Mirror](./author-mirror) | Governance host `https://mirror.author.io/runtime/nodejs`. JWT version lists. EOL/ALPHA/MAINTENANCE need this host. |
| [Basic HTTP proxy](./http-proxy) | Proxy URL, `user:pass`, or Bearer. WinINET fallback. Community Builds and Certified Builds. |
| [Advanced proxy](./http-proxy#capabilities-by-license) | IWA (NTLM/Negotiate) and PAC/WPAD. [Governance](./certified-builds/governance) add-on. |
| Administrative templates | ADMX/ADML lock or override preferences. See [Administrative Templates](../cfg/ad) and [Governance](./certified-builds/governance). |
| [Active Directory](../install/enterprise/ad) | Deploy Certified Builds with GPO. |
| [Intune](../install/enterprise/intune) | Deploy Certified Builds as a Win32 app. The installer runs as System. |
| <PageLink id="trustArtifacts" /> | <TrustArtifactList format="inline" />. Certified Builds add-on. |
| <PageLink id="oem" label="sidebar" /> | <PageDescription id="oem" /> |

</div>
