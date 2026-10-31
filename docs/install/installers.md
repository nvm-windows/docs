---
sidebar_label: Installers & Packages
title: Installers
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import WingetStatus from '@site/docs/_components/WingetStatus';

# Installers

NVM for Windows has a Community Build and a Certified Build.
Each build has an amd64 (x64) package and an arm64 package.
For help identifying the build best for you, review [Choosing a Build](../guide/builds/).

## Community Build

Use the Community Build for a _user-managed_ install under `%LOCALAPPDATA%\Author Software\nvm`.
The published installer is code-signed by Author Software Inc.

:::info[You may already have a Community Build installed]
[Microsoft Zenith](https://blogs.windows.com/windowsdeveloper/2026/09/04/announcing-project-zenith-the-ready-to-code-windows-experience/) preconfigures NVM for Windows, starting with AMD Ryzen AI Halo devices. More silicon partners & OEMs are being added.

Open PowerShell and run `nvm env`.
If NVM for Windows is present, the command shows the configuration.
:::

<Tabs>
  <TabItem value="native" label="Installer" default>
    1. Download the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License).
    1. Run the installer.

    :::tip[Recommended Approach]
    The installer opens a wizard.
    Use the wizard to set your Node.js options.
    :::


  </TabItem>
  <TabItem value="winget" label="Winget">
    ```powershell
      winget install nvm-windows # MIT License
    ```
    <WingetStatus />
    <br/>
    Runs with `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART`.

    Put extra installer parameters in `--custom`.
    See [Silent install](#silent-install).
  </TabItem>
  <TabItem value="upgrade" label="Upgrade from v1">
    See [Upgrading from v1](../guide/upgrade-from-v1).

    For a single computer:

    1. Download the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License).
    1. Run the installer as a standard user.

    The installer migrates supported v1 installs (v1.1.7 or later) and merges Node.js versions into v2.

    :::warning[Legacy Updater]
    The v1 updater applies minor and patch updates on the v1.x.x line only.
    The v1 updater does not install v2.
    :::
    :::warning[winget upgrade]
    If you installed v1 with winget, run `winget install nvm-windows` once for the first upgrade.
    That command resets the winget package ID from `CoreyButler.NVMforWindows` to `AuthorSoftware.NVMWindows`.
    Later upgrades use `winget upgrade nvm-windows`.
    Details: [Upgrading from v1](../guide/upgrade-from-v1#winget).
    :::
  </TabItem>
</Tabs>

### Silent Installation

The community installer is Inno Setup.
These switches apply to `nvm-<version>-x64-setup.exe` and `nvm-<version>-arm64-setup.exe`.

|Switch|What it does|
|:-|:-|
|`/VERYSILENT`|No wizard and no progress window.|
|`/SILENT`|Progress window only. No wizard pages.|
|`/SUPPRESSMSGBOXES`|Skip message boxes. Use with `/SILENT` or `/VERYSILENT`.|
|`/NORESTART`|Do not reboot when the install finishes.|
|`/DIR`|:warning: Ignored. A path other than the default program root stops the silent install with [NVM4100](../troubleshooting/error-codes.md).|

:::warning[/DIR is ignored]
Do not pass `/DIR` to choose an install folder.
The community program root stays `%LOCALAPPDATA%\Author Software\nvm`.
A different `/DIR` value is ignored, and the silent install stops with error [NVM4100](../troubleshooting/error-codes.md).
Set Node.js storage with `InstallRoot` in the wizard, or with `nvm config` after install.
:::

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
.\nvm-<version>-x64-setup.exe /SILENT /SUPPRESSMSGBOXES /NORESTART
```

A silent install skips the storage-permissions page.
If `InstallRoot` is not a safe managed path and the ACL check fails, the installer moves storage to AppData.
If ACL repair still fails, the silent install stops.
Pass `/ALLOWDEGRADEDACLS` to continue.

Runtime directories (`.shim`, `.nodejs`, `.sync`, `.cache`, `.verify`, `proxy.exe`) always live under the program root. Custom `InstallRoot` holds version trees only — NVM never creates those runtime dirs as siblings of a custom storage folder (for example choosing `D:\nvm` must not create `D:\.shim`).

|Parameter|Accepted&nbsp;values|What it does|
|:-|:-|:-|
|`/ALLOWDEGRADEDACLS`|`1`, `true`, `yes`|Finish a silent install when Node storage ACLs cannot be hardened. Sets `RuntimeACLDegraded`. Repair later with `nvm doctor --autofix`.|
|`/OFFICIALNODE`|`adopt` (default), `drop`|What to do with an official Node.js install (not NVM). `adopt` copies that version and your `%APPDATA%\npm` global modules into NVM storage, then uninstalls official Node.js. `drop` uninstalls official Node.js. It does not copy that install.|

If official Node.js is present, the wizard shows a line like `Node.js 22.20.0 detected with 14 global modules (128 MB)`. The wizard then shows **Adopt** and **Drop** only. Silent and winget installs skip that page. Those installs use `/OFFICIALNODE`. The community default is `adopt`. Any other value, including `copy`, `keep`, and `ignore`, is treated as `adopt`.

The community installer cannot keep official Node.js. The system PATH Node.js directory overrides the NVM user PATH. `copy` and `keep` are available only on the [certified MSI](#certified-build).

If the installer cannot remove official Node.js, the silent install stops. The exit code is not 0. Remove that Node.js installation, then run the installer again.

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /ALLOWDEGRADEDACLS=1
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=adopt
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=drop
```

There is no task list.
`/TASKS` has no effect.

#### Winget

`winget install nvm-windows` uses the very-silent switches above.
Pass a custom parameter with `--custom`.
Winget appends `--custom` to those switches.

```powershell
winget install nvm-windows --custom "/ALLOWDEGRADEDACLS=1"
winget install nvm-windows --custom "/OFFICIALNODE=adopt"
```

`--override` replaces the default switches.
If you use `--override`, include `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART`.

## Certified Build

Use the Certified Build for a machine-managed MSI install under `%ProgramFiles%\Author Software\nvm`.
The installer is code-signed by Author Software Inc.

:::info[Available now]
Certified Build files are available from the [customer portal](https://portal.author.io).
:::

Certified Builds support remote install through Active Directory and Microsoft Entra / Intune.
You can also install the MSI on one computer.
See [Enterprise Deployment](./enterprise/requirements) to install NVM for Windows on many computers.

Quiet installs need elevation. Pass MSI properties after the package path.

|Property|Accepted values|What it does|
|:-|:-|:-|
|`ACCEPT_EULA`|`1`|Accept the EULA without the wizard. Required for `/qn` and `/qb`.|
|`OFFICIALNODE`|`copy` (default), `adopt`, `keep`, `drop`|What to do with an official Node.js install (not NVM). `copy` copies that version and `%APPDATA%\npm` global modules into NVM. It leaves the official install on disk. It puts NVM first on the system PATH. `adopt` copies the same files, then uninstalls official Node.js. `keep` does not copy official Node.js. It leaves that install on disk. It puts NVM first on the system PATH. `drop` uninstalls official Node.js. It does not copy that install.|

`adopt-keep` means `copy`. `adopt-drop` means `adopt`. `ignore-keep` and `ignore` mean `keep`. `ignore-drop` means `drop`. Any other value becomes `copy`. Bare `adopt` uninstalls official Node.js after the copy. It is not an alias of `copy`.

```powershell
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=copy /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=adopt /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=keep /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=drop /qn /norestart
```

NVM first means `%LOCALAPPDATA%\Author Software\nvm\.nodejs`, then `C:\Program Files\Author Software\nvm`, then official Node.js.
If the copy fails, or the uninstall fails, the install stops.
Remove the existing Node.js installation, then run the installer again.

The wizard shows **Copy**, **Adopt**, **Keep**, and **Drop**. **Copy** is the default.

|File|Use Case|
|:-|:-|
|[Deploy Manually](./enterprise/manual)|Install with the MSI (or a script) on one computer.|
|[Intune](./enterprise/intune)|Deploy to a Microsoft Entra organization.|
|[Active Directory](./enterprise/ad)|Deploy sitewide with GPO Software Installation.|

### Silent Installation

The Certified Build uses a Windows Installer (MSI) package.
Quiet installs need elevation.

|Flag|What it does|
|:-|:-|
|`/i <path.msi>`|Install or upgrade.|
|`/qn`|No UI (quiet).|
|`/norestart`|Do not reboot when the install finishes.|

Pass MSI properties after the package path.

```powershell
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 /qn /norestart
```

|Property|Accepted&nbsp;values|What it does|
|:-|:-|:-|
|`ACCEPT_EULA`|`1`|Accept the [EULA](https://nvm-windows.com/eula.html) without the wizard. **Required** for `/qn` and `/qb`. A full-UI install does not need this property.|
|`OFFICIALNODE`|<ul><li>`adopt-keep` (default)</li><li>`adopt-drop`</li><li>`ignore-keep`</li><li>`ignore-drop`</li></ul>|What to do with an official Node.js install (not NVM).<br/>`adopt-keep` copies that version and `%APPDATA%\npm` global modules into NVM. It leaves the official install on disk. It puts NVM first on the system PATH.<br/>`adopt-drop` copies the same files. It then uninstalls official Node.js.<br/>`ignore-keep` does not copy official Node.js. It leaves that install on disk. It puts NVM first on the system PATH. Alias: `ignore`.<br/>`ignore-drop` does not copy official Node.js. It uninstalls that install. Alias: `drop`.<br/>`adopt` is an alias of `adopt-keep`.<br/>Any other value becomes `adopt-keep`.|

```powershell
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=adopt-keep /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=adopt-drop /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=ignore-keep /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=ignore-drop /qn /norestart
```

NVM first means `%LOCALAPPDATA%\Author Software\nvm\.nodejs`, then `C:\Program Files\Author Software\nvm`, then official Node.js.
If the copy fails, or the uninstall fails, the install stops.
Remove the existing Node.js installation, then run the installer again.

More `msiexec` flags, repair, and MST transforms: [Deploy Manually](./enterprise/manual).

:::note[Upgrading from v1 or Community v2]
The certified MSI installs to Program Files and updates machine `NVM_HOME` and PATH.
Existing Node.js versions stay under LocalAppData.
On the first `nvm` launch, obsolete AppData app binaries are removed.
The `installs` folder is kept.
The MSI does not run the community uninstaller.
The MSI also registers the ETW event provider and clears legacy SYSTEM environment variables during install.
`Remediation/` scripts (`machine-startup.ps1`, `Register-EventLogSource.ps1`, `Remove-LegacySystemEnv.ps1`) are backup only.
Do not add those scripts to GPO startup.
:::

## Installing Node.js

After NVM for Windows is installed, install one or more Node.js versions.

```powershell title="Example: Install the latest supported Node.js version"
nvm install lts
```

## Warnings

Read these warnings before you install the Community Build.

:::warning[Do not install the Community Build as Administrator!]
Do not install the Community Build as Administrator.
An Administrator install configures NVM for Windows for the administrator account.
It does not configure the user account that will run Node.js.
See [registered event source permissions](/permissions#community-installer-registered-event-source).
:::

:::warning[UAC for Logging]
The community installer tries to register NVM for Windows as a system event source.
That step shows a UAC prompt.
If the user account cannot complete that step, Event Viewer shows the source as "Unknown".
It does not show "NVM for Windows".
Native logging still works.
:::
