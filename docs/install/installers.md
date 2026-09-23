---
sidebar_label: Installers & Packages
title: Installers
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installers

NVM for Windows offers community and certified builds on amd64 (x64) and arm64 devices. See [Choosing an Edition](../guide/builds/) to understand which is right for you.

## Community Build

<Tabs>
  <TabItem value="native" label="Installer" default>
    Download and run the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License).

    :::tip[Recommended Approach]
    This installation approach provides a native GUI wizard to customize your Node.js workflows.
    :::


  </TabItem>
  <TabItem value="winget" label="Winget">
    :::warning[Coming Soon!]
    We're still getting everything setup for winget.
    :::

    ```powershell
      winget install nvm # MIT License
    ```

    `winget install` runs the community installer with `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART`. Extra installer parameters go in `--custom`. See [Silent install](#silent-install).
  </TabItem>
  <TabItem value="upgrade" label="Upgrade from v1">
    Download and run the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License). It automatically migrates v1 to v2.

    :::warning[Legacy Updater]
    The v1 updater is designed for minor/patch upgrades in the legacy v1.x.x line. It will not work with v2.
    :::
  </TabItem>
</Tabs>

## Silent install

The community installer is Inno Setup. These switches work on `nvm-<version>-x64-setup.exe` and `nvm-<version>-arm64-setup.exe`:

|Switch|What it does|
|:-|:-|
|`/VERYSILENT`|No wizard and no progress window.|
|`/SILENT`|Progress window only. No wizard pages.|
|`/SUPPRESSMSGBOXES`|Skip message boxes. Use with `/SILENT` or `/VERYSILENT`.|
|`/NORESTART`|Do not reboot when the install finishes.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
.\nvm-<version>-x64-setup.exe /SILENT /SUPPRESSMSGBOXES /NORESTART
```

The program root stays `%LOCALAPPDATA%\Author Software\nvm`. A silent `/DIR` that points somewhere else aborts with [NVM4100](../troubleshooting/error-codes.md). Node version storage is `InstallRoot` (wizard, or `nvm config` after install), not `/DIR`.

Silent install skips the storage-permissions page. If the current `InstallRoot` is not a safe managed path and the ACL check fails, the installer moves storage to AppData. If ACL repair still fails, the silent install stops unless you pass `/ALLOWDEGRADEDACLS`.

|Parameter|Accepted values|What it does|
|:-|:-|:-|
|`/ALLOWDEGRADEDACLS`|`1`, `true`, `yes`|Finish a silent install when Node storage ACLs cannot be hardened. Sets `RuntimeACLDegraded`. Repair later with `nvm doctor --autofix`.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /ALLOWDEGRADEDACLS=1
```

There is no task list. `/TASKS` has no effect.

### Winget

When the package is published, `winget install nvm` uses the very-silent switches above. Pass the custom parameter with `--custom` (appended to those switches):

```powershell
winget install nvm --custom "/ALLOWDEGRADEDACLS=1"
```

`--override` replaces the default switches. Include `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART` yourself if you use it.

## Certified Build

:::info[Available September 2026]
Code-signed Certified Build assets will be available from the customer portal.
:::

Certified builds are designed for remote installation through platforms like Active Directory and Microsoft Entra, but you can still install on a single computer using the MSI. See [Enterprise Deployment](./enterprise/requirements) to deploy NVM for Windows to many computers.

|File|Use Case|
|:-|:-|
|[Deploy Manually](./enterprise/manual)|Install with the MSI (or a script) on one computer.|
|[Intune](./enterprise/intune)|Deploy to a Microsoft Entra organization.|
|[Active Directory](./enterprise/ad)|Deploy sitewide with GPO Software Installation.|

:::note[Upgrading from v1 or community v2]
The certified MSI installs to Program Files and updates machine `NVM_HOME` / PATH. Existing Node versions stay under LocalAppData. On first `nvm` launch, obsolete AppData app binaries are retired while `installs` are kept. The MSI does not run the community uninstaller. Legacy SYSTEM env cleanup and Windows Apps registration for existing versions run during install; `Remove-LegacySystemEnv.ps1` is backup remediation only.
:::

## Installing Node.js

Once NVM for Windows is installed, use it to install one or more versions of Node.js.

```powershell title="Example: Install the latest supported Node.js version"
nvm install lts
```

## Warnings

:::warning[Do not install community edition as Administrator!]
Do not attempt to install the community edition as Administrator. Doing so will configure NVM for Windows for the administrator instead of the user account who will run Node.js. See [registered event source permissions](/permissions#community-installer-registered-event-source).
:::

:::warning[UAC for Logging]
The community installer attempts to register NVM for Windows as a system event source, introducing a UAC prompt. If the user account does not have permission to do this, log entries will show "Unknown" instead of "NVM for Windows" as the event source in Windows Event Viewer, but this does not prevent native logging from working.
:::
