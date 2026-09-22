---
title: Deploy Manually
sidebar_label: Deploy Manually
sidebar_position: 4
certified: true
---

# Deploy Manually

Install the **certified** MSI on one machine (or with your own deployment script) without Active Directory GPSI or Intune packaging.

Download the certified deployment pack from the [customer portal](https://portal.author.io). Use the architecture that matches the target (`amd64` or `arm64`):

| File | Role |
|:-|:-|
| `nvm-windows-<version>-certified-<arch>.msi` | Installer package |
| `nvm-windows-<version>-certified-<arch>.mst` | Optional transform (silent EULA acceptance) |

Complete the [requirements](./requirements) first.

:::tip[Fleet Rollout]
 For fleet rollout, use the [Active Directory](./ad) or [Intune](./intune) guides instead.
:::

:::info[Elevation]
The certified MSI is **per-machine**. Install, repair, upgrade, and uninstall need an elevated prompt or a system-context agent. Payload lands under `%ProgramFiles%\Author Software\nvm`.
:::

## MSI properties

| Property | Required? | Purpose |
|:-|:-|:-|
| `ACCEPT_EULA=1` | **Yes** for quiet / reduced UI | Accepts the license without the wizard. Required for `/qn`, `/qb`, and same-version repair. |

Runtime settings are enforced with [Administrative Templates](../../cfg/ad)/[registry policy](../../cfg/registry), not MSI properties.

## Common `msiexec` flags

| Flag | Meaning |
|:-|:-|
| `/i <path.msi>` | Install or upgrade |
| `/x {PRODUCT-CODE}` | Uninstall (code is build-specific — take it from the MSI you deployed) |
| `/qn` | No UI (quiet) |
| `/norestart` | Do not reboot automatically |
| `/L*V <path.log>` | Verbose log |
| `TRANSFORMS=<path.mst>` | Apply an MST (see [MST transform](#mst-transform)) |
| `REINSTALL=ALL REINSTALLMODE=amus` | Same-version repair (with `/i`, not `/fa`) |

Use an **absolute** path to the MSI for repair. Relative paths can fail with Windows Installer error `1619` when the service reopens the package.

:::warning[Do not use `/fa` or `/famus`]
Those repair shorthands do not reliably carry `ACCEPT_EULA=1` into the repair session for this package. Use `/i` with `REINSTALL=ALL REINSTALLMODE=amus` instead.
:::

## Interactive install

Double-click the MSI, or:

```powershell
msiexec /i "C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi"
```

Accept the EULA in the UI. No `ACCEPT_EULA` property needed for a full-UI install.

## Silent install script

Run elevated PowerShell. Pass `ACCEPT_EULA=1` (or apply the MST — see below).

```powershell
# Requires elevation (Run as administrator)
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

Save as `Install-NvmWindows.ps1` and run:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Install-NvmWindows.ps1
```

Typical success exit codes: `0` (success), `3010` (success, reboot required).

### Same-version repair

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
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

See [Uninstall](../uninstall) for product-code discovery and GPO/Intune removal.

## MST transform \{#mst-transform}

### Purpose

An **MST** (Microsoft Transform) is a patch applied **with** the MSI at install time. The certified `.mst` from the portal sets **`ACCEPT_EULA=1`** so Group Policy Software Installation (and other agents that cannot easily pass MSI properties) can install quietly.

The MST does **not** configure runtime preferences. Use ADMX / policy for that. Do not hand-edit the binary `.mst`; regenerate it from Author tooling if you must change transform settings.

### When you need it

| Scenario | Use MST? |
|:-|:-|
| Manual / scripted `msiexec` with `ACCEPT_EULA=1` on the command line | Optional — property alone is enough |
| Active Directory **GPSI** (Modifications tab) | **Yes** — attach the `.mst` (see [Deploy with Active Directory](./ad)) |
| Any agent that installs the MSI but cannot pass public properties | **Yes** — apply via `TRANSFORMS=` or the agent’s transform list |

### Apply with `msiexec`

Host MSI and MST together (same folder). Prefer absolute paths:

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
$mst = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.mst'
$log = Join-Path $env:ProgramData 'Author\nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null

$arguments = "/i `"$msi`" TRANSFORMS=`"$mst`" /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

With the portal MST applied, you do not also need `ACCEPT_EULA=1` on the command line (the transform supplies it). Passing both is harmless.

### Apply in Group Policy

On the package **Modifications** tab, add the `.mst` from the same UNC share as the MSI. Full steps: [Deploy with Active Directory](./ad).

## Verify

```powershell
Get-Item "$env:ProgramFiles\Author Software\nvm\nvm.exe"
nvm version
```

Open a **new** terminal after install so `PATH` updates are visible.

## Related

| Topic | Doc |
|:-|:-|
| Prerequisites | [Requirements](./requirements) |
| GPO + MST | [Deploy with Active Directory](./ad) |
| Win32 / Intune | [Deploy with Microsoft Intune](./intune) |
| Removal | [Uninstall](../uninstall) |
| Policy after install | [Administrative Templates](../../cfg/ad) |
