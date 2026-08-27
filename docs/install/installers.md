import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installers

NVM for Windows is available as community and certified builds on amd64 (x64) and arm64 devices. See [Choosing an Edition](../guide/builds/) to understand which is right for you.

## Community Build

<Tabs>
  <TabItem value="native" label="Installer" default>
    Download and run the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License).

    :::tip[Recommended Approach]
    This installation approach provides a native GUI wizard to customize your Node.js workflows.
    :::


  </TabItem>
  <TabItem value="winget" label="Winget">
    ```powershell
      winget install nvm # MIT License
    ```

    :::info[Silent Installation]
    Use this  option to silently install using the default configuration.
    :::
  </TabItem>
  <TabItem value="upgrade" label="Upgrade from v1">
    Download and run the [setup.exe installer](https://github.com/nvm-windows/nvm/releases) (MIT License). It automatically migrates v1 to v2.

    :::warning[Legacy Updater]
    The v1 updater is designed for minor/patch upgrades in the legacy v1.x.x line. It will not work with v2.
    :::
  </TabItem>
</Tabs>

## Certified Build

Code-signed assets will be available for download in the customer portal.

Certified builds are designed for remote installation through platforms like Active Directory and Microsoft Entra, but you can still install on a single computer using the MSI. See the Enterprise Deployment section to deploy NVM for Windows to many computers.

|File|Use Case|
|:-|:-|
|Intune|Deploy to a Microsoft Entra organization.|
|MSI Installer|Install on a single computer or deploy a sitewide deployment.|

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
