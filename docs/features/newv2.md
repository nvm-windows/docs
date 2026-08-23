# What's new in v2

## TLDR

- Simplified permissions.
- Modern workflows focused on automation, security, observaibility, & compliance.
- Full rewrite from v1 (Go and Zig).
- Two Builds: Community (MIT) & Certified (EULA).
- Stewardship transfered to Author Software Inc.

## Community & Certified Builds

The Community build remains free and open-source (MIT). Certified builds add signed installers, optional **Trust Artifacts** and **Governance** add-ons, and related controls (see [Choosing an Edition](../guide/builds/index.md)).

## Node.js Installation

- **Parallel simultaneous installations** — install multiple Node.js versions at once
- **Smaller download sources** — compact `.7z` archives instead of larger historical formats
- **Native extraction** — faster installs with fewer external unpacker dependencies
- **Local air-gapped downloads** — install from a local archive directory when offline or restricted ([Local Installations](./local-installations), [Air-gapped Installations](../guide/air-gapped-installations))
- **Caching** — reuse downloaded/extracted assets on repeat installs ([Download Cache](./cache))
- **Code-signed MSI installers** _(Certified Builds)_ — MSI/Intune packs for managed fleets ([Installers](../install/installers), [Choosing an Edition](../guide/builds/))

:::tip[7-zip]
NVM for Windows uses native 7-Zip if it is installed, which uses proprietary algorithms for increased extraction speed. [7-Zip is free to download](https://www.7-zip.org).
:::

## Operating modes

The biggest functional change is the introduction of [operational modes](./modes).

- **Lightweight shims**: Zig-built shims so Node and related tools (npm, npx, etc) commands resolve through NVM first
- **Zero-latency link mode**: legacy junction/symlink PATH model when shim interception is not needed

Shim mode unlocks per-directory version switching and other automation. **Link mode** remains for legacy use, but bypassing the esoteric permission models in v1.

## Automation

- **Per-directory version switching** — select Node from the current directory (for example `.nvmrc`) in shim mode ([Version resolution](../guide/version-resolution))
- **Auto-install missing versions** — install a required version when a project needs one that is not present yet
- **Auto-install default global modules** — optionally install a defined set of globals with each new Node.js version

## Preferences

- **User-defined aliases** — aliases for versions or version groups via `nvm alias` ([Aliases](../cfg/aliases))
- **User-defined default global modules** — configure packages installed with each new runtime (`auto_installed_modules`)
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
