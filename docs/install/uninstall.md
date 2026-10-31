---
sidebar_label: Uninstall
sidebar_position: 4
---

# Uninstall

:::tip[NVM for Windows != Node.js]
Uninstalling NVM for Windows (the application) from the computer is different from [`nvm uninstall`](../command/nvm/uninstall), which only removes installed Node.js versions while leaving NVM for Windows installed.
:::

:::warning[Backup Node.js installations]
Copy the Node.js storage directory before you uninstall if you need those versions later.
The default path is `%LOCALAPPDATA%\Author Software\nvm\installs`.
See [Basic Configuration](../cfg/core#mode-and-install-location).

A Community Build uninstall removes that user's managed Node.js versions and global modules.
A Certified Build uninstall deletes `%LOCALAPPDATA%\Author Software\nvm` for the user who runs the uninstall.
Other profiles on the same computer can keep their own folders.
:::

## Community Builds

Community Builds install per user under `%LOCALAPPDATA%\Author Software\nvm`.
The package is the open-source setup EXE.
See [Installers](./installers#community-build).

### Using the uninstaller

1. Open **Settings** → **Apps** → **Installed apps**.
   You can also open **Control Panel** → **Programs and Features**.
1. Select **NVM for Windows**.
1. Select **Uninstall**.
1. Complete the wizard.

You can also run:

```powershell
winget uninstall nvm-windows
```

Or run `unins000.exe` from `%LOCALAPPDATA%\Author Software\nvm`.

The Community Build uninstaller removes:

- Application files under `%LOCALAPPDATA%\Author Software\nvm`
- Node.js versions under the configured install root (default `%LOCALAPPDATA%\Author Software\nvm\installs`)
- User preferences under `HKCU\Software\Author Software\Preferences\nvm`
- The `NVM_HOME` user environment variable and related `PATH` entries
- The **NVM for Windows Sync** scheduled task
- Per-version Apps entries (see [Windows Apps](/features/windows-apps))
- The per-user sparse identity package `AuthorSoftware.NVMWindows` (notification collections)

Open a **new** terminal after uninstall.
The new terminal reads the updated `PATH`.

### Manual uninstall

Use this procedure only when the uninstaller is missing or the uninstaller fails.

1. Close terminals and processes that use `node`, `npm`, or `nvm`.
1. Delete the sync task if it exists:

   ```powershell
   schtasks /Delete /TN "NVM for Windows Sync" /F
   ```

1. Remove the sparse identity package if it is still registered:

   ```powershell
   Get-AppxPackage -Name AuthorSoftware.NVMWindows* | Remove-AppxPackage
   ```

1. Delete `%LOCALAPPDATA%\Author Software\nvm`.
   That folder holds app files, installs, cache, and shims.
   If you set a custom [`root`](../cfg/core#mode-and-install-location) or `InstallRoot`, delete that directory too.
   See [Basic Configuration](../cfg/core) and the [registry reference](../cfg/registry).
1. Remove leftover user environment values:
   - Delete `NVM_HOME` from **User** environment variables.
   - Delete legacy `NVM_SYMLINK` if it is present.
   - Remove PATH entries for the NVM install directory, the `.nodejs` shim path, or legacy `nvm` and `nodejs` symlink folders.
1. Remove leftover registry keys for the current user:
   - `HKCU\Software\Author Software\Preferences\nvm`
   - `HKCU\Software\Classes\nvm` (protocol handler)
   - `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\nvm4w-node-v*` (per-version Apps entries)
   - The Inno Setup uninstall key under `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\` (the name ends in `_is1` for NVM for Windows)
1. Sign out, or open a new terminal.
1. Confirm that `nvm`, `node`, and `npm` do not resolve.

:::tip[Reinstall later]
A Community Build reinstall uses the [standard installer or winget](./installers#community-build).
A restored installs folder works only when you put it at the same [`root`](../cfg/core#mode-and-install-location) path that the new install expects.
:::

## Certified Builds

Certified Builds install for the computer in `%ProgramFiles%\Author Software\nvm`.
The package is an MSI or an Intune Win32 package.
Prefer uninstall through MDM or GPO.
Detection rules and assignments then stay consistent.
See [Requirements](./enterprise/requirements), [Intune](./enterprise/intune), [Active Directory](./enterprise/ad), and [Installers](./installers#certified-build).

:::warning[Scope of removal]
The MSI deletes `%LOCALAPPDATA%\Author Software\nvm` for the user who runs the uninstall.
That folder holds that user's Node.js versions and global modules.
Other user profiles on the same computer can keep their own folders.
Copy that user's storage directory before you remove the product from a fleet.
See the warning in [Deploy with Active Directory](./enterprise/ad).
:::

### Uninstall via GPO or Microsoft Entra (Intune)

Use the procedure that matches the original deployment.

#### Active Directory GPO

Use this procedure when Software Installation deployed NVM for Windows.

1. Open the GPO that assigns the MSI.
   See [Deploy with Active Directory](./enterprise/ad).
1. Remove the package assignment.
   Or keep **Uninstall this application when it falls out of the scope of management** if you enabled that option at deploy time.
1. Move computers or users out of the GPO security filter or OU.
   The package then no longer applies.
1. On each client, run `gpupdate /force`.
   Restart the computer when the package was assigned to the computer.
   Sign out and sign in when the package was assigned to the user.
1. Confirm that the app is gone from **Apps**.

Do not enable automatic uninstall when the computer leaves the scope until you read the [effect on managed Node.js installs](./enterprise/ad).

#### Microsoft Intune/Entra

Use this procedure for a Win32 app.
See [Deploy with Intune](./enterprise/intune).

1. In the [Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431), open **NVM for Windows (Certified)**.
1. Set the assignment to **Uninstall** for the target groups.
   Or remove the install assignment and assign uninstall to those groups.
1. Open **Apps** → **Monitor** → **App install status**.
1. Wait until the devices report uninstalled.

The uninstall command is in the deployment pack (`.intune.json`):

```powershell
msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
```

Use the `productCode` under `msiInformation` in the `.intune.json` for your build.
The example product code in the Intune guide can differ by release.

{/* #### MECM

Remove or retire the application deployment in Configuration Manager so clients run the MSI uninstall. See [Deploy with MECM](./enterprise/mecm) when that guide is complete.
*/}

### Manual uninstall

Use this procedure for one device.
Use it for a lab computer, emergency access, or an install with no MDM.

1. Open **Settings** → **Apps** → **NVM for Windows (Certified)** → **Uninstall**.
   Or run:

   ```powershell
   msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
   ```

   The product code is in the portal MSI or in `.intune.json` (`msiInformation.productCode`).
1. Confirm that `%ProgramFiles%\Author Software\nvm` is gone.
   Intune uses that path for detection.
1. Confirm that per-user data is gone.
   The MSI deletes `%LOCALAPPDATA%\Author Software\nvm` for the user who runs the uninstall.
   If AppData remains for another user on the same PC, sign in as that user and delete that profile's `%LOCALAPPDATA%\Author Software\nvm`.
   Or run an elevated script that targets each profile.
   Switching from Community Builds unregisters `AuthorSoftware.NVMWindows` before those files are deleted.
   The first Certified Builds launch retries that cleanup if the MSI ran as SYSTEM.
   Switching back to Community Builds unregisters `AuthorSoftware.NVMWindows.Certified` after Program Files `nvm.exe` is gone.
   The first Community Builds launch retries if MSI deprovision ran as SYSTEM.
   To remove a leftover identity immediately:

   ```powershell
   Get-AppxPackage -Name AuthorSoftware.NVMWindows* | Remove-AppxPackage
   ```
1. Optional: remove policy that the MSI does not delete:
   - Clear or unlink ADMX policies under **Author Software** → **NVM for Windows** ([Administrative templates](../cfg/ad)).
   - Remove leftover values under `HKLM\Software\Policies\Author Software\nvm` if you set them with registry CSP or OMA-URI ([registry reference](../cfg/registry)).
1. Optional: delete `%ProgramData%\Author\nvm-certified-install.log` if the file exists.
1. Open a new terminal.
1. Confirm that `nvm` is not on PATH.

:::info[Policies vs product]
MSI uninstall removes the product.
Group Policy and Intune configuration profiles can still write keys under `HKLM\Software\Policies\Author Software\nvm` until you disable those policies.
:::

### Related

|Topic|Doc|
|:-|:-|
|Which build you have|[Choosing a Build](../guide/builds/)|
|Install again|[Installers](./installers)|
|Enterprise prerequisites|[Requirements](./enterprise/requirements)|
|Intune uninstall command|[Deploy with Intune](./enterprise/intune)|
|GPO software removal|[Deploy with Active Directory](./enterprise/ad)|
|Remove Node.js versions only|[`nvm uninstall`](../command/nvm/uninstall)|
|Policy keys|[Registry reference](../cfg/registry)|
