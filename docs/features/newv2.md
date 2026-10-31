---
sidebar_label: What's new in v2
title: What's new in v2
sidebar_position: 1
---

import PageLink from '@site/docs/_components/PageLink';
import PageDescription from '@site/docs/_components/PageDescription';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';

# What's new in v2

## High Level

*   **No mandatory admin privileges**
*   **Modern workflows without symlinks**
*   **Version pinning** — .nvmrc, .node-version, package.json, or user-defined files
*   **Faster downloads and installations**
*   **Automatic installation of missing Node.js versions**
*   **Developer and Enterprise-ready**
*   **Fully rewritten for speed & maintainability** — Go and Zig (see [Why we Rewrote NVM for Windows](https://medium.com/@goldglovecb/why-we-rewrote-nvm-for-windows-3b6fa5be3e7f?sharedUserId=goldglovecb))
*   **Dual Builds** — Community Builds (MIT) & Certified Builds (EULA)
*   **Malicious package blocking** — stop known-malicious npm names on install

:::info[Code Signing]
Community Builds and Certified Builds are code-signed.
The publisher on the signature is Author Software Inc.
Project stewardship transferred to Author Software Inc. The same people still manage the project.
:::

## Community & Certified Builds

The Community Build remains free and open-source (MIT). Certified Builds add optional **Trust Artifacts**, **Advanced Logging**, and **Governance** add-ons, and related controls (see [Choosing a Build](../guide/builds/index.md)).

## Node.js Installation

| Feature | Details |
|:-|:-|
| Parallel installations | Install multiple Node.js versions at once |
| Smaller downloads (40%) | Compact `.7z` archives |
| Native extraction | Faster installs with fewer external unpacker dependencies |
| Local air-gapped downloads | Install from a local archive directory (`local_dir` / cache) when offline or restricted. Community Builds and Certified Builds. Policy-locked fleets and Author-mirror offline license (`air_gapped`) need Governance. See [Local Installations](./local-installations) and [Air-gapped Installations](../guide/air-gapped-installations). |
| Caching | Reuse downloaded/extracted assets on repeat installs. See [Download Cache](./cache). |

:::tip[7-zip]
While not required, NVM for Windows uses native 7-Zip for extraction if it is installed. 7-Zip's proprietary algorithms provide the fastet extraction speed. [7-Zip is free to download](https://www.7-zip.org).

A slower embedded extractor is used if 7-Zip is not available.
:::

## Operating modes

The biggest functional change is the introduction of [operational modes](./modes).

| Feature | Details |
|:-|:-|
| Lightweight shims | Zig-built shims for Node and related tooling commands (`npm`, `npx`, and others) |
| Zero-latency link mode | Junction/symlink PATH model when shim interception is not needed |

Shim mode unlocks per-directory version switching and other automation. **Link mode** remains for legacy use while bypassing the esoteric permission models from v1.

## Automation

| Feature | Details |
|:-|:-|
| Per-directory version switching | Select Node from the current directory (for example `.nvmrc`) in shim mode. See [Version resolution](../guide/version-resolution). |
| Auto-install missing versions | Install a required version when a project needs one that is not present yet |
| Auto-install default global modules | Optionally install a defined set of globals with each new Node.js version |

## Preferences

| Feature | Details |
|:-|:-|
| User-defined aliases | Short names for versions. See [Aliases](../cfg/aliases) and [`nvm alias`](../command/nvm/alias/). |
| User-defined default global modules | Configure packages installed with each new version ([`auto_installed_modules`](../cfg/core#downloads-and-mirrors)) |
| Windows Registry preferences | User prefs via `nvm config`. Policies hive overrides need [Governance](./certified-builds/governance). See [Basic Configuration](../cfg/core) and [Registry Policy Reference](../cfg/registry). |

## Native Windows integrations

| Feature | Details |
|:-|:-|
| Windows Apps | Installed Node.js versions appear in Apps & features. See [Windows Apps](./windows-apps). |
| Windows Event Viewer | Operational events in Event Viewer. See [Event Logging](./log). |
| Desktop Notification Center | Updates and notices in the Windows notification center. See [Desktop Notifications](./notifications). |
| Windows Registry | User preferences stored under registry keys. See [Windows Registry](./windows-registry). |

## Malicious packages

v2 stops an `npm`, `pnpm`, `vlt`, or `yarn` install when a package name and version match the [OpenSSF Malicious Packages](https://github.com/ossf/malicious-packages) dataset.
The check uses a signed local file (`malware.db`).
It is not a file scanner and operates adjacent to the [module firewall](./firewall).

Community Builds check the named package and direct `package.json` dependencies.
Certified Builds also read project lockfiles and check the full dependency graph.

| Feature | Details |
|:-|:-|
| Default on | Community Builds and Certified Builds in [shim mode](./modes) |
| Community Builds | Named package on `npm install <name>` (and the equivalent `pnpm` / `yarn` commands). Direct `package.json` dependencies on a bare `npm install`. No lockfile. No transitive dependencies. |
| Transitive dependencies | Certified Builds only. Names and versions in the project lockfile. Also checked when `node` starts in the project directory. |

See [Malicious Package Blocker](./malicious-package-blocker) for details.

## Security and governance

_([Governance](./certified-builds/governance) add-on)_

| Feature | Details |
|:-|:-|
| Restrict Node.js versions | Allow/block lists. See [NVM Firewall](./firewall). Lifecycle aliases such as `EOL` need the [Author Mirror](./author-mirror). |
| Control NVM settings | Lock or override preferences with ADMX / GPO / Entra. See [Administrative Templates](../cfg/ad). |
| Advanced proxy support | IWA (NTLM/Negotiate) and PAC/WPAD beyond basic HTTP proxy. See [HTTP Proxy](./http-proxy). |
| Custom Node.js mirrors | Author policy-aware mirror (`mirror.author.io`) or other approved mirrors. See [Download Mirrors](./mirrors) and [Author Mirror](./author-mirror). |
| Active Directory and Entra integration | Deploy/manage via AD and Intune. See [Enterprise Deployment](../install/enterprise/requirements). |

## Trust artifacts and observability

| Feature | Add-on | Details |
|:-|:-|:-|
| <TrustArtifactList format="inline" /> | <PageLink id="trustArtifacts" /> | <PageDescription id="trustArtifacts" /> See <PageLink id="choosingABuild" />. |
| Fully auditable native logging | <PageLink id="advancedLogging" /> | <PageDescription id="advancedLogging" /> See [Event Logging](./log) and [SIEM](../guide/siem). |
