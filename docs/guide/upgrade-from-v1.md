---
title: Upgrading from v1
sidebar_label: Upgrading from v1
sidebar_position: 1.5
---

# Upgrading from v1

Use this guide to move from NVM for Windows v1 to v2.
The v2 installer migrates supported v1 installs for you.

## Supported versions

The v2 installer upgrades existing installs of **v1.1.7 or later**.
It detects the prior install, migrates settings, and merges Node.js versions into the v2 layout.

:::warning[Older than v1.1.7]
Uninstall NVM for Windows versions older than **1.1.7** before you install v2.
Those versions do not migrate automatically.
You lose existing Node.js installations and settings if you remove them without a backup.
:::

The v1 in-app updater does **not** install v2.
That updater applies minor and patch updates on the v1.x.x line only.
Use a v2 installer or winget for the move to v2.

## Standard upgrade

1. Download the community [setup.exe](https://github.com/nvm-windows/nvm/releases), or use [winget](#winget).
1. Run the installer as a **standard user**.
   Do not run the community installer as Administrator.
1. Follow the wizard.

The installer:

- Detects a prior NVM for Windows install
- Migrates settings into the v2 preference store
- Merges Node.js versions into the v2 storage directory (default `%LOCALAPPDATA%\Author Software\nvm\installs`)
- Updates PATH and related environment entries for v2

Wizard screens show migration progress.
See [Installers](../install/installers) for silent switches and warnings.

:::info[Install directory vs Node.js storage]
v2 supports a **custom Node.js storage** directory (`InstallRoot`).
Set it in the wizard or with `nvm config` after install.

v2 does **not** support a custom NVM **program** directory the way v1 did.

|Build|NVM program directory|
|:-|:-|
|Community|`%LOCALAPPDATA%\Author Software\nvm` (fixed)|
|Certified|`%ProgramFiles%\Author Software\nvm` (fixed)|

A silent community `/DIR` that points elsewhere is ignored and stops the install with [NVM4100](../troubleshooting/error-codes.md).
:::

### Node.js versions

Installed Node.js versions from a supported v1 install are merged into v2 storage.
You do not re-download those versions when the copy succeeds.
After install, open a **new** terminal and run `nvm list` to confirm the versions.

### Backup in restricted environments

The installer copies Node.js version trees and related files during migration.
Some locked-down environments block or interrupt those copies.

:::warning[Backup before you upgrade]
If policy, antivirus, or DLP can block file copies, back up your v1 Node.js storage first.
Copy the v1 Node.js root (often under `%NVM_HOME%` or a custom path you set) to a safe location.
Restore from that backup only if migration fails.
:::

## Winget \{#winget}

Winget is a supported install path for community v2.
The package ID changed when the project moved to the `nvm-windows` organization.

|Install path|Winget ID|
|:-|:-|
|v1 (legacy)|`CoreyButler.NVMforWindows`|
|v2 (current)|`AuthorSoftware.NVMWindows` (moniker `nvm-windows`)|

### First upgrade from a v1 winget install

If you installed v1 with winget, run this command **once**:

```powershell
winget install nvm-windows
```

That command resets the winget-tracked package ID from `CoreyButler.NVMforWindows` to `AuthorSoftware.NVMWindows`.
Later upgrades use the normal winget upgrade flow.

```powershell
winget upgrade nvm-windows
```

### Installer users who adopt winget later

If you installed with the setup EXE (not winget), you can still run `winget install nvm-windows` later.
Future upgrades then work with standard winget upgrade operations.

### Tips

- Choose the setup EXE wizard for the first v2 install if you want the migration screens and storage options.
- If winget is your primary upgrade path after the ID reset, you do not need `nvm upgrade` for product updates.
  Notifications from the sync tool can still tell you when a new version is available.
- Do not elevate the community winget install for a normal user install.
  See [Installers](../install/installers#warnings).

## Sitewide upgrades

For organization fleets, use a **certified** build.
Certified packages support MSI, Intune Win32, and Active Directory deployment.
Those channels are the supported path for controlled, sitewide updates.

1. Download the certified pack from the [customer portal](https://portal.author.io).
1. Deploy with [Deploy Manually](../install/enterprise/manual), [Intune](../install/enterprise/intune), or [Active Directory](../install/enterprise/ad).
1. Apply license and policy after install ([Requirements](../install/enterprise/requirements), [Administrative Templates](../cfg/ad)).

:::tip[v1 fleets on Intune]
If the organization used NVM for Windows **v1.1.7 or later**, the certified MSI migrates the existing install.
Uninstall versions older than 1.1.7 first.
If you built a custom Intune app from v1.1.7 or later, set **Supersedence** on the v2 Win32 app.
See [Deploy with Microsoft Intune](../install/enterprise/intune).
:::

Community winget and the community setup EXE are for individual machines.
They are not a fleet control plane.
Use certified deployment for sitewide rollout and update policy.

## Related

|Topic|Doc|
|:-|:-|
|Community and certified installers|[Installers](../install/installers)|
|Silent community switches|[Installers — Silent install](../install/installers#silent-install)|
|Manual certified MSI|[Deploy Manually](../install/enterprise/manual)|
|Intune|[Deploy with Microsoft Intune](../install/enterprise/intune)|
|Active Directory|[Deploy with Active Directory](../install/enterprise/ad)|
|In-app product updates|[`nvm upgrade`](../command/nvm/sync-upgrade)|
|Choosing community vs certified|[Choosing a Build](./builds/)|
