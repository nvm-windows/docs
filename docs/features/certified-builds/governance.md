---
title: Governance
sidebar_label: Governance
sidebar_position: 3
certified:
  edition: governance
---

# Governance

Governance is an add-on for [Certified Builds](../../guide/builds/).
Think of it as the **policy pack** for fleets: ADMX/ADML templates and portal scripts that let IT lock preferences, gate downloads, and force runtime protections through Active Directory, Entra, Intune, or other MDM.

Download the pack from the [customer portal](https://portal.author.io).

## Without this add-on

A Certified Build without Governance still runs with Community-class features. You lose the ability to **enforce** policies from GPO / Intune, plus the Governance-only hosts and proxy modes below.

**Node.js remains uncontrolled.**

| Area | Without Governance |
|:-|:-|
| Preferences | Users control their own preferences. No policy enforcement. |
| Downloads | Public mirrors and basic/bearer proxy only. No [Author Mirror](../author-mirror). No IWA or PAC/WPAD proxy support. |
| Firewalls | Version and module allow/deny lists in policies are ignored. |
| Malware | Users can turn scans off. Organization malware lists are not forced from machine policy. |
| Runtime | Permission / V8 / eval flags and package cooldown are not forced. Lifecycle-script locks and shim-mode locks do not apply from policies. |

## Why enable it

Governance is for teams that need the same answer on every managed PC:

- Preferences stop drifting — GPO / Intune owns the settings users cannot override
- Node.js downloads follow policy (approved versions, corporate proxy, or local archives only)
- Package installs stay inside your supply-chain rules (malware scans, module lists, cooldown)
- Shimmed `node` can start hardened by default, not only when a developer remembers the flags

## What the policy pack is

| Item | Role |
|:-|:-|
| `NVMWindows.admx` / `NVMWindows.adml` | Administrative templates for GPO and Intune. They write `HKLM\Software\Policies\Author Software\nvm` |
| Portal licensing scripts | `Set-NvmWindowsLicensing.ps1` writes license material and the `AccessKey` used for [Author Mirror](../author-mirror) JWTs (not ADMX values) |

How to import templates: [Administrative Templates](../../cfg/ad).
Every key and default: [Registry Policy Reference](../../cfg/registry).

## What you can force

### Policy delivery

| Control | What it does |
|:-|:-|
| Administrative templates | Lock or override preferences from AD / Entra / Intune so endpoints share one posture. See [Administrative Templates](../../cfg/ad). |

### Downloads and network

| Control | What it does |
|:-|:-|
| Version firewall | Allow and deny Node.js versions. Hosted aliases such as `EOL` apply on the [Author Mirror](../author-mirror), not on the client alone. Local lists still work offline. See [NVM Firewall](../firewall). |
| Author Mirror | Unlocks `https://mirror.author.io/runtime/nodejs` — a policy-aware download host (not available air-gapped). See [Author Mirror](../author-mirror). |
| Advanced proxy | Require IWA (NTLM/Negotiate) or PAC/WPAD. See [HTTP Proxy](../http-proxy). |
| Air-gapped / local installs | Pin fleets to local archives (`LocalInstallDir` / `LocalInstallOnly`). See [Local Installations](../local-installations) and [Air-gapped Installations](../../guide/air-gapped-installations). |

### Supply chain

| Control | What it does |
|:-|:-|
| Malicious package blocking | Keep OpenSSF malware scans on (`SkipMalwareChecks` forced off). Deploy org allow/block patterns and trust-conflict behavior from policy. See [Malicious Package Blocker](../malicious-package-blocker). |
| Module firewall | Allow or deny npm/pnpm/yarn/npx package installs from machine lists. See [NVM Firewall](../firewall). |
| Package-manager lifecycle scripts | Block install-class lifecycle scripts from HKLM (`BlockPackageManagerLifecycleScripts`). Advanced Logging records **NVM4412** when that lock rewrites a command. |
| Package minimum age | Force a unified cooldown for npm/pnpm/yarn/yarnpkg, vlt, and bun/bunx (when the bun wrap is on). CLI bypass flags are stripped. DWORD `0` forces the gate off. |

### Runtime hardening

| Control | What it does |
|:-|:-|
| Shim mode | Force `OperatingMode=shim` so runtime policies (malware, firewalls, logging, Node flags) can apply. Link mode skips those checks. |
| Node permission model | Force `--permission` / `--experimental-permission` on shimmed `node` (default-deny FS/network unless the app passes `--allow-*`). |
| Freeze V8 globals | Force `--frozen-intrinsics`. |
| Disallow eval | Force `--disallow-code-generation-from-strings`. |

Permission, freeze, and disallow-eval also merge into `npm_config_node_options` for npm/npx/pnpm lifecycle scripts when the matching policy is on.
They do **not** set `NODE_OPTIONS`. Yarn, bun, corepack, and vlt are not covered.

### Fleet locks

| Control | What it does |
|:-|:-|
| Disable upgrades | Block in-app NVM self-upgrades (`DisableUpgrade`). AD / Intune package deploys still work. |
| Install root | Pin where versions live (`InstallRoot`) and optionally block users from changing it (`AllowRootDirChange`). |
| Publisher trust | Pin allowed Authenticode organizations / thumbprints (`AllowedSigners`, `AllowedThumbprints`). |

## Apply

1. Download the Governance pack (ADMX/ADML + licensing scripts) from the [customer portal](https://portal.author.io).
2. Install the Certified MSI / Intune package on the fleet ([enterprise requirements](../../install/enterprise/requirements)).
3. Import ADMX and deploy the policies you care about ([Intune](../../install/enterprise/intune), [Active Directory](../../install/enterprise/ad), or [manual MSI](../../install/enterprise/manual)).
4. Confirm values under `HKLM\Software\Policies\Author Software\nvm` — see [Registry Policy Reference](../../cfg/registry).

## Related

- [Choosing a Build](../../guide/builds/)
- [Understanding Security](../../guide/security)
- [Malicious Package Blocker](../malicious-package-blocker)
- [NVM Firewall](../firewall)
- [Author Mirror](../author-mirror)
- [Customer portal](https://portal.author.io)
