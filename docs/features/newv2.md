# What's new in v2

## High Level

*   **No mandatory admin privileges**
*   **Modern workflows without symlinks**
*   **Version pinning** — .nvmrc, .node-version, package.json, or user-defined files
*   **Faster downloads and installations**
*   **Automatic installation of missing Node.js versions**
*   **Developer and Enterprise-ready**
*   **Fully rewritten for speed & maintainability** — Go and Zig
*   **Dual Builds** — Community (MIT) & Certified (EULA)

:::info[Code Signing Change]
- Community builds are not code signed.
- **Certified builds are 100% code-signed.**

All signatures show "Author Software Inc" as the publisher. Project stewardship transfered to Author Software Inc, but remains managed by the same people.
:::

## Community & Certified Builds

:::info[Certified Builds]
Available September 2026.
:::

The Community build remains free and open-source (MIT). Certified builds add signed installers, optional **Trust Artifacts**, **Advanced Logging**, and **Governance** add-ons, and related controls (see [Choosing an Edition](../guide/builds/index.md)).

## Node.js Installation

- **Parallel installations** — install multiple Node.js versions at once
- **Smaller downloads (40%)** — uses compact `.7z` archives
- **Native extraction** — faster installs with fewer external unpacker dependencies
- **Local air-gapped downloads** — install from a local archive directory when offline or restricted (see [Local Installations](./local-installations), [Air-gapped Installations](../guide/air-gapped-installations))
- **Caching** — reuse downloaded/extracted assets on repeat installs ([Download Cache](./cache))

:::tip[7-zip]
While not required, NVM for Windows uses native 7-Zip for extraction if it is installed. 7-Zip's proprietary algorithms provide the fastet extraction speed. [7-Zip is free to download](https://www.7-zip.org).

A slower embedded extractor is used if 7-Zip is not available.
:::

## Operating modes

The biggest functional change is the introduction of [operational modes](./modes).

- **Lightweight shims**: Zig-built shims for Node and related tooling commands (npm, npx, etc)
- **Zero-latency link mode**: junction/symlink PATH model when shim interception is not needed

Shim mode unlocks per-directory version switching and other automation. **Link mode** remains for legacy use while bypassing the esoteric permission models from v1.

## Automation

- **Per-directory version switching** — select Node from the current directory (for example `.nvmrc`) in shim mode ([Version resolution](../guide/version-resolution))
- **Auto-install missing versions** — install a required version when a project needs one that is not present yet
- **Auto-install default global modules** — optionally install a defined set of globals with each new Node.js version

## Preferences

- **User-defined aliases** — aliases for versions via `nvm alias` ([Aliases](../cfg/aliases))
- **User-defined default global modules** — configure packages installed with each new version ([`auto_installed_modules`](../cfg/core#downloads-and-mirrors))
- **Windows Registry preferences** — user prefs and (on certified builds) machine policy via `nvm config` ([Basic Configuration](../cfg/core), [Registry Policy Reference](../cfg/registry))

## Native Windows integrations

- **Windows Apps** — installed Node.js versions appear in Apps & features ([Windows Apps](./windows-apps))
- **Windows Event Viewer** — operational events in Event Viewer ([Event Logging](./log))
- **Desktop Notification Center** — updates and notices in the Windows notification center ([Desktop Notifications](./notifications))
- **Windows Registry** — user preferences stored under registry keys ([Windows Registry](./windows-registry))

## Security and governance

_(Governance add-on)_

- **Restrict Node.js versions** — allow/block lists and firewall policies (for example block EOL) ([Version Firewall + Author Mirror](./author-mirror))
- **Control NVM settings** — lock or override preferences with ADMX / GPO / Entra ([Administrative Templates](../cfg/ad))
- **Advanced proxy support** — IWA (NTLM/Negotiate) and PAC/WPAD beyond basic HTTP proxy ([Download Mirrors](./mirrors#http-proxies))
- **Custom Node.js mirrors** — Author policy-aware mirror (`mirror.author.io`) or other approved mirrors ([Download Mirrors](./mirrors), [Version Firewall + Author Mirror](./author-mirror))
- **Active Directory and Entra integration** — deploy/manage via AD and Intune ([Enterprise Deployment](../install/enterprise/requirements))

## Trust artifacts and observability

- **SBOM, provenance, and VEX** _(Trust Artifacts add-on)_ — supply-chain trust materials with release packs ([Choosing an Edition](../guide/builds/))
- **Fully auditable native logging** _(Advanced Logging add-on)_ — structured logging for SIEM/audit ([Event Logging](./log), [Choosing an Edition](../guide/builds/))
