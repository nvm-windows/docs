---
sidebar_label: Uninstall
sidebar_position: 4
---

# Uninstall

:::tip[NVM for Windows != Node.js]
Uninstalling NVM for Windows (the application) from the computer is different from [`nvm uninstall`](../command/uninstall), which only removes installed Node.js versions while leaving NVM for Windows installed.
:::

:::warning[Backup Node.js Installations!]
Uninstalling NVM for Windows removes all managed Node.js versions and their global modules. Back up the Node.js storage directory first if you may need those versions later. The default location is `%LOCALAPPDATA%\Author Software\nvm\installs` (see [Basic Configuration](../cfg/core#mode-and-install-location)).

Choose the section that matches your [edition](../guide/builds/).
:::

## Community Builds

Community builds install per-user under `%LOCALAPPDATA%\Author Software\nvm` with the open-source setup EXE. See [Installers](./installers#community-build).

### Using the uninstaller

1. Open **Settings** → **Apps** → **Installed apps** (or **Control Panel** → **Programs and Features**).
1. Select **NVM for Windows** → **Uninstall**.
1. Complete the setup wizard.

Alternatively:

```powershell
winget uninstall nvm
```

Or run `unins000.exe` from the install directory (`%LOCALAPPDATA%\Author Software\nvm`).

The community uninstaller removes:

- Application files under `%LOCALAPPDATA%\Author Software\nvm`
- Node.js versions under the configured install root (default `%LOCALAPPDATA%\Author Software\nvm\installs`)
- User preferences under `HKCU\Software\Author Software\Preferences\nvm`
- The `NVM_HOME` user environment variable and related `PATH` entries
- The **NVM for Windows Sync** scheduled task
- Per-version Apps entries (see [Windows Apps](/features/windows-apps))

Open a **new** terminal after uninstall so `PATH` and environment changes apply.

### Manual uninstall

Use this only when the uninstaller is missing or fails.

1. Close terminals and processes using `node`, `npm`, or `nvm`.
1. Delete the sync task (if present):

   ```powershell
   schtasks /Delete /TN "NVM for Windows Sync" /F
   ```

1. Delete `%LOCALAPPDATA%\Author Software\nvm` (app files, installs, cache, shims). If you customized [`root`](../cfg/core#mode-and-install-location)/`InstallRoot`, delete that directory too (see [Basic Configuration](../cfg/core) and [registry reference](../cfg/registry)).
1. Remove leftovers from the user environment:

   - Delete `NVM_HOME` (and legacy `NVM_SYMLINK` if present) from **User** environment variables.
   - Remove PATH entries that point at the NVM install directory, `.nodejs` shim path, or legacy `nvm`/`nodejs` symlink folders.
1. Remove registry leftovers under the current user:

   - `HKCU\Software\Author Software\Preferences\nvm`
   - `HKCU\Software\Classes\nvm` (protocol handler)
   - `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\nvm4w-node-v*` (per-version Apps entries)
   - The Inno Setup uninstall key under `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\` (name ends in `_is1` for NVM for Windows)
1. Sign out/open a new terminal and confirm `nvm`, `node`, and `npm` are no longer resolved.

:::tip[Reinstall later]
Community reinstall uses the [standard installer or winget](./installers#community-build). Restoring a backed-up installs folder only works if you place it at the same [`root`](../cfg/core#mode-and-install-location) path the new install expects.
:::

## Certified Builds

Certified builds install machine-wide to `%ProgramFiles%\Author Software\nvm` as an MSI/Intune Win32 package. MDM or GPO uninstallation is preferred so detection and assignments stay consistent. See [enterprise requirements](./enterprise/requirements), [Intune](./enterprise/intune), [Active Directory](./enterprise/ad), and [Installers](./installers#certified-build).

:::warning[Scope of removal]
Uninstalling certified NVM for Windows removes Node.js versions managed for that user (default storage: `%LOCALAPPDATA%\Author Software\nvm\installs`) and can affect every account on the device that relied on the machine install. Back up installs before fleet-wide removal. See the GPO warning in [Deploy with Active Directory](./enterprise/ad).
:::

### Uninstall via GPO or Microsoft Entra (Intune)

#### Active Directory GPO

If NVM for Windows was deployed with Software Installation:

1. Open the GPO that assigns the MSI (see [Deploy with Active Directory](./enterprise/ad)).
1. Remove the package assignment, or rely on **Uninstall this application when it falls out of the scope of management** if that option was enabled at deploy time.
1. Move computers/users out of the GPO security filter or OU so the package no longer applies.
1. On clients, run `gpupdate /force` (or wait for the next policy refresh), then confirm the app is gone from **Apps**.

Do not enable automatic uninstall-on-scope-exit without understanding the [impact on managed Node.js installs](./enterprise/ad).

#### Microsoft Intune/Entra

If deployed as a Win32 app (see [Deploy with Intune](./enterprise/intune)):

1. In the [Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431), open the **NVM for Windows (Certified)** app.
1. Change assignments so target groups receive **Uninstall**, or remove the install assignment and assign uninstall to those groups.
1. Monitor **Apps** → **Monitor** → **App install status** until devices report uninstalled.

The package uninstall command matches your deployment pack (from `.intune.json`):

```powershell
msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
```

Use the `productCode` under `msiInformation` in the `.intune.json` that shipped with your build. The example product code in the Intune guide may differ per release.

{/* #### MECM

Remove or retire the application deployment in Configuration Manager so clients run the MSI uninstall. See [Deploy with MECM](./enterprise/mecm) when that guide is complete.
*/}

### Manual uninstall

For a single device (lab machine, break-glass, or non-MDM install):

1. Prefer **Settings** → **Apps** → **NVM for Windows (Certified)** → **Uninstall**, or:

   ```powershell
   msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
   ```

   Product code is listed in your portal MSI/`.intune.json` (`msiInformation.productCode`).
1. Confirm `%ProgramFiles%\Author Software\nvm` is gone (detection path used by Intune).
1. Confirm per-user data is removed. The MSI runs a cleanup action that deletes `%LOCALAPPDATA%\Author Software\nvm` for the user context that performed uninstall. If AppData remains (for example another user profile on the same PC), delete that profile’s `%LOCALAPPDATA%\Author Software\nvm` while signed in as that user, or remove it with an elevated script that targets each profile.
1. Optional policy cleanup (does **not** happen automatically with MSI uninstall):

   - Clear or unlink ADMX policies under **Author Software** → **NVM for Windows** ([Administrative templates](../cfg/ad)).
   - Remove leftover values under `HKLM\Software\Policies\Author Software\nvm` if you applied registry CSP/OMA-URI directly ([registry reference](../cfg/registry)).
1. Optional: remove install logs under `%ProgramData%\Author\nvm-certified-install.log` if present.
1. Open a new terminal and confirm `nvm` is no longer on PATH.

:::info[Policies vs product]
Uninstalling the MSI removes the product. Group Policy/Intune **configuration** profiles can still push keys under `HKLM\Software\Policies\Author Software\nvm` until you disable those policies.
:::

### Related

|Topic|Doc|
|:-|:-|
|Which edition you have|[Choosing an Edition](../guide/builds/)|
|Install again|[Installers](./installers)|
|Enterprise prerequisites|[Requirements](./enterprise/requirements)|
|Intune uninstall command|[Deploy with Intune](./enterprise/intune)|
|GPO software removal|[Deploy with Active Directory](./enterprise/ad)|
|Remove Node.js versions only|[`nvm uninstall`](../command/uninstall)|
|Policy keys|[Registry reference](../cfg/registry)|
