---
title: Deploy with Microsoft Intune
sidebar_position: 2
certified: true
---

# Deploy with Microsoft Intune

Deploy the Certified Build with the files from the [customer portal](https://portal.author.io) download.
The installer runs as **System**.
The installer accepts the EULA (`ACCEPT_EULA=1`).

|File|Purpose|
|:-|:-|
|`nvm-windows-<version>-certified-x64.intunewin`|Upload this file to Intune as the Win32 app package.|
|`nvm-windows-<version>-certified-x64.intune.json`|Use this file for install commands, detection rules, return codes, and MSI metadata.|
|`nvm-windows-<version>-certified-x64.defender-exclusions.csv`|Import this file into the Microsoft Defender Antivirus exclusions policy.|
|`product-logo.png`|Upload this file as the Company Portal logo.|

Complete [Requirements](./requirements) first.
After installation, continue with [Configure policies](../../cfg/ad).

### 1. Upload the app

In the [Microsoft Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431):

1. Go to **Apps** > **All apps** > **Create**.
1. Select **Windows app (Win32)**.
1. Select the app package file.
1. Upload `nvm-windows-<version>-certified-x64.intunewin`.
1. Wait until Intune extracts and validates the package.

### 2. App information

Copy these values from the companion `.intune.json` file.

|Field|Value|
|:-|:-|
|Name|`NVM for Windows (Certified)`|
|Publisher|`Author Software Inc.`|
|Version|`<version>`|
|Description|Certified Build for x64. See `.intune.json` for the exact string in your package.|
|Logo|`product-logo.png`|

Upload `product-logo.png` from the deployment pack in the **Logo** field.
Company Portal shows that image on the app tile in Available apps.

![App information](/img/install/image.png)

### 3. Program settings

Set the program fields to these values.

|Setting|Value|
|:-|:-|
|Install command|`powershell.exe -ExecutionPolicy Bypass -File .\install.ps1`|
|Uninstall command|`msiexec.exe /x "{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}" /qn /norestart`|
|Install behavior|**System**|
|Device restart behavior|**No specific action** (suppress)|

:::info[Product code]
The uninstall product code (`{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}`) is under `msiInformation` in your `.intune.json`.
Other MSI metadata is in that same object.
If your manifest differs, use the values in that manifest.
:::

Add the return codes from `.intune.json`:

|Code|Type|
|:-|:-|
|`0`|Success|
|`1707`|Success|
|`3010`|Soft reboot|
|`1603`|Retry|
|`1618`|Retry|
|`1619`|Retry|

![Program settings](/img/install/image-2.png)

### 4. Requirements

Set the requirement fields to these values.

|Setting|Recommendation|
|:-|:-|
|Operating system architecture|**x64** or **ARM64**|
|Minimum OS|Windows 11 21H2|

:::info
Select **x64** or **ARM64**.
Do not select both in one app.
If you need both architectures, create one Intune application for each architecture.
Each architecture has its own `.intunewin` installer.
:::

![Requirements](/img/install/image-1.png)

### 5. Detection rules

Add a **File** detection rule.

|Setting|Value|
|:-|:-|
|Path|`%ProgramFiles%\Author Software\nvm`|
|File or folder|`nvm.exe`|
|Detection method|**File or folder exists**|
|Associated with a 32-bit app on 64-bit clients|**No**|

![Detection rules](/img/install/image-3.png)

### 6. Dependencies

Skip this step.
Dependencies are not required.

### 7. Supersedence

Skip this step for the first deployment.
Supersedence is not required.
For an update, set **Supersedence** on this Win32 app.
The new package then replaces the previous package.

:::warning[Upgrading from NVM for Windows v1]
If the organization used NVM for Windows v1.1.7 or later, v2 moves the existing install.
You do not need supersedence for that move.
Uninstall versions older than 1.1.7 first.
Users then lose existing installations and settings.

If you created a custom Intune application from v1.1.7 or later, supersede that application.
See the maintenance guide.
:::

### 8. Assignments

1. Complete the wizard and **Assign** the app to device groups or user groups.
1. Confirm deployment status under **Apps** > **Monitor** > **App install status**.

Install logs are in `%ProgramData%\Author\nvm-certified-install.log` on the target device.

### 9. Microsoft Defender exclusions

The Win32 app does not add antivirus exclusions. `install.ps1` only runs the MSI. Tamper Protection blocks `Add-MpPreference` on the device, including when the app runs as System.

Create a separate Endpoint security policy. Assign it to the same devices as the Win32 app.

1. Go to **Endpoint security** > **Antivirus** > **Create Policy**.
1. Set **Platform** to **Windows**.
1. Set **Profile** to **Microsoft Defender Antivirus exclusions**.
1. Under **Excluded processes**, select **Import**.
1. Select `nvm-windows-<version>-certified-x64.defender-exclusions.csv` from the deployment pack.

   The file contains these paths:
   - `C:\Program Files\Author Software\nvm\nvm.exe`
   - `C:\Program Files\Author Software\nvm\utils\reshim.exe`
1. Assign the policy to the same groups as the app.

This setting tells Defender to ignore files that those two programs open. Do not exclude `%APPDATA%\Microsoft\Crypto\Keys`. Do not put these paths in the NVM ADMX policy.

Arctic Wolf, CrowdStrike, and SentinelOne ignore this Defender policy. Set the exception in that product's console.
