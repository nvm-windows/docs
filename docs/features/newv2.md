# What's new in v2

NVM for Windows v2 is a full rewrite from v1.

The Community build remains free and open-source (MIT). Certified builds add signed installers, compliance materials, & governance controls (see [Choosing an Edition](../guide/builds/index.md)).

## Highlights

The biggest functional change is the introduction of [operational modes](./modes).


**shim mode**: lightweight shims for `node`, `npm`, `corepack`, and related commands. That unlocks per-directory version switching and other automation. **Link mode** remains for legacy PATH junctions — useful in air-gapped or simpler static setups.



Unless noted, features below are available in Community and all certified plans (Distribution, Compliance, Governance, Custom).

## Node.js Installation

- **Parallel simultaneous installations** — install multiple Node.js versions at once
- **Smaller download sources** — compact `.7z` archives instead of larger historical formats
- **Native extraction** — faster installs with fewer external unpacker dependencies
- **Caching** — reuse downloaded/extracted assets on repeat installs ([Caching](./cache))
- **Local air-gapped downloads** — install from a local archive directory when offline or restricted
- **Code-signed MSI installers** _(Certified Builds)_ — MSI/Intune packs for managed fleets ([Installers](../install/installers), [Choosing an Edition](../guide/builds/))

:::tip[7-zip]
NVM for Windows uses native [7-Zip](https://www.7-zip.org/download.html) if it is installed. The 7-Zip extraction algorithms are proprietary, but faster and free.
:::

## Operating modes

- **Lightweight shims** — Zig-built shims so Node-related commands resolve through NVM first ([Operating Modes](./modes))
- **Zero-latency link mode** — legacy junction/symlink PATH model when shim interception is not needed

## Automation

- **Per-directory version switching** — select Node from the current directory (for example `.nvmrc`) in shim mode ([Version resolution](./version-resolution))
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

_(Governance, Custom)_

- **Restrict Node.js versions** — allow/block lists and firewall policies (for example block EOL) ([Download Mirror & Firewall](./proxy))
- **Control NVM settings** — lock or override preferences with ADMX / GPO / Entra ([Administrative Templates](../cfg/ad))
- **Advanced proxy support** — IWA (NTLM/Negotiate) and PAC/WPAD beyond basic HTTP proxy ([Download Mirror & Firewall](./proxy))
- **Custom Node.js mirrors** — Author policy-aware mirror (`mirror.author.io`) or other approved mirrors with licensing
- **Active Directory and Entra integration** — deploy/manage via AD and Intune ([Enterprise Deployment](../install/enterprise/requirements))

## Compliance and observability

- **SBOM, provenance, and release materials** _(Compliance+)_ — supply-chain trust artifacts with release packs
- **Fully auditable native logging** _(Governance, Custom)_ — structured logging for SIEM/audit ([Logging](./log), [Choosing an Edition](../guide/builds/))
