---
title: Deploy Manually
sidebar_label: Deploy Manually
sidebar_position: 4
certified: true
---

# Deploy Manually

This guide explains how to install the Certified Build MSI on one computer, or with your own script.


1. Download the Certified Build deployment pack from the [customer portal](https://portal.author.io).
1. Select the architecture of the target computer.

| File | Role |
|:-|:-|
| `nvm-windows-<version>-certified-<arch>.msi` | Installer package. `<arch>` is `x64` or `arm64`. |
| `nvm-windows-<version>-certified-<arch>.mst` | Optional transform. The transform accepts the EULA for a silent install. |

Complete the [requirements](./requirements) first.

:::tip[Fleet rollout]
For many computers, use [Active Directory](./ad) or [Intune](./intune).
:::

:::info[Elevation]
The Certified Build MSI installs per machine.
Install, repair, upgrade, and uninstall need an elevated prompt or a system-context agent.
The files install under `%ProgramFiles%\Author Software\nvm`.
:::

## MSI properties

The Certified Build MSI has two public properties for install.

| Property | Required? | Purpose |
|:-|:-|:-|
| `ACCEPT_EULA=1` | **Yes** for quiet / reduced UI | Accepts the license without the wizard. Required for `/qn`, `/qb`, and same-version repair. |
| `OFFICIALNODE` | No | Choose what happens to an existing official Node.js install. The default is `copy`. Values are listed under [Certified Build](../installers#certified-build). |

Set runtime options with [Administrative Templates](../../cfg/ad) or [registry policy](../../cfg/registry).
Do not set runtime options with MSI properties.

## Common `msiexec` flags

Use these flags with `msiexec`.

| Flag | Meaning |
|:-|:-|
| `/i <path.msi>` | Install or upgrade |
| `/x {PRODUCT-CODE}` | Uninstall. Copy the product code from the MSI that you deploy. |
| `/qn` | No UI (quiet) |
| `/norestart` | Do not reboot automatically |
| `/L*V <path.log>` | Verbose log |
| `TRANSFORMS=<path.mst>` | Apply an MST (see [MST transform](#mst-transform)) |
| `REINSTALL=ALL REINSTALLMODE=amus` | Same-version repair (with `/i`, not `/fa`) |

Use an **absolute** path to the MSI for repair.
A relative path can fail with Windows Installer error `1619`.
The service then cannot open the package again.

:::warning[Do not use `/fa` or `/famus`]
`/fa` and `/famus` do not keep `ACCEPT_EULA=1` in the repair session for this package.
Use `/i` with `REINSTALL=ALL REINSTALLMODE=amus`.
:::

## Interactive install

Double-click the MSI, or run:

```powershell
msiexec /i "C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi"
```

Accept the EULA in the UI.
A full-UI install does not need the `ACCEPT_EULA` property.

## Silent install script

Run elevated PowerShell.
Pass `ACCEPT_EULA=1`, or apply the MST (see below).

```powershell
# Requires elevation (Run as administrator)
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

1. Save the script as `Install-NvmWindows.ps1`.
1. Run:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Install-NvmWindows.ps1
```

Exit code `0` means success.
Exit code `3010` means success, and the computer needs a restart.

### Same-version repair

Use this script to repair the same version.

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-repair.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" REINSTALL=ALL REINSTALLMODE=amus ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

### Quiet uninstall

```powershell
msiexec /x "{PRODUCT-CODE-FROM-DEPLOYED-MSI}" /qn /norestart
```

See [Uninstall](../uninstall) for the product code and for GPO or Intune removal.

## MST transform \{#mst-transform}

An MST is a Windows Installer transform.
You apply the MST with the MSI.
The sections below show when to use the transform and how to apply it.

### Purpose

The Certified Build `.mst` from the portal sets **`ACCEPT_EULA=1`**.
Group Policy Software Installation can then install with no UI.
An agent that cannot pass MSI properties can also install with no UI.

The MST does not set runtime preferences.
Use ADMX or registry policy for runtime preferences.
Do not edit the binary `.mst`.

### When you need it

| Scenario | Use MST? |
|:-|:-|
| Manual or scripted `msiexec` with `ACCEPT_EULA=1` on the command line | Optional. The property is sufficient. |
| Active Directory **GPSI** (Modifications tab) | **Yes**. Attach the `.mst`. See [Deploy with Active Directory](./ad). |
| An agent installs the MSI but cannot pass public properties | **Yes**. Use `TRANSFORMS=` or the agent transform list. |

### Apply with `msiexec`

Put the MSI and the MST in the same folder.
Use absolute paths.

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$mst = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.mst'
$log = Join-Path $env:ProgramData 'Author\nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null

$arguments = "/i `"$msi`" TRANSFORMS=`"$mst`" /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

The portal MST sets `ACCEPT_EULA=1`.
The command line does not need `ACCEPT_EULA=1` when you apply that MST.
You can pass both.
The install still succeeds.

## Verify

Confirm the install:

```powershell
Get-Item "$env:ProgramFiles\Author Software\nvm\nvm.exe"
nvm version
```

Open a **new** terminal after install.
The new terminal shows the updated `PATH`.

## Related

| Topic | Doc |
|:-|:-|
| Requirements | [Requirements](./requirements) |
| GPO + MST | [Deploy with Active Directory](./ad) |
| Win32 / Intune | [Deploy with Microsoft Intune](./intune) |
| Removal | [Uninstall](../uninstall) |
| Policy after install | [Administrative Templates](../../cfg/ad) |
