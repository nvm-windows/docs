# Installers

NVM for Windows is available for in community and certified builds (amd64 & arm64). See [Choosing an Edition](../guide/builds/) to understand which is right for you.

## Community Build

NVM for Windows should be installed with a _standard user account_.

The standard installer attempts to register NVM for Windows as a system event source, introducing a UAC prompt. If the user account does not have permission to do this, log entries will show "Unknown" instead of "NVM for Windows" as the event source in Windows Event Viewer.

:::warning[Do not install as Administrator]
Do not attempt to install the community edition as Administrator. Doing so will configure the application for the administrator account instead of the user account who will run Node.js.
:::

### Standard Installer

Visually configure a personalized Node.js workflow aligned with your preferences.

Download and run the [setup.exe installer](https://github.com/nvm-windows/nvm/releases).

:::tip[Recommended]
This is the recommended installation strategy.
:::

### Winget

Use winget to silently install with the default configuration.

```powershell
  winget install nvm
```

### Upgrade from v1

[Download](https://github.com/nvm-windows/nvm/releases) and run the standard installer. It automatically migrates v1 to v2.

:::warning[Legacy Updater]
The v1 updater is designed for minor and patch upgrades in the legacy v1.x.x line. It will not work with v2.
:::

## Certified Build

Certified builds are designed for remote installation

Download and run the MSI installer from the [customer portal](https://portal.author.io/downloads).

## Install Node.js

Once NVM for Windows is installed, use it to install one or more versions of Node.js.

```powershell title="Example: Install the latest supported Node.js version"
nvm install lts
```


