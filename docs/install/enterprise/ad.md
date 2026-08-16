---
title: Deploy with Active Directory
certified: true
---

# Deploy with Active Directory

**What you'll need:**

- The NVM for Windows MSI installer and MST patch[^1] (available in the [customer portal](https://portal.author.io)).
- Administrative access to your domain controller to create group policies.

### Prepare the file server

GPO software installation reads the MSI and MST from a network share. Domain Computers must be able to reach that share when the policy applies.

Upload the NVM for Windows MSI and MST files from your deployment package to a file server accessible to **Domain Computers** and any users in the GPO scope. Grant read access to those principals.

<img src="/img/guide_fileserver.png" alt="Source Files" style={{ width: '95%', height: 'auto' }} />

### 1. Open the Group Policy Management Console

- **Using Run Command**: Press Windows Key + R, type `gpmc.msc`, and hit OK.
- **Using Start Menu**: Click Start, type Group Policy Management, and select the top application result.
- **Using Server Manager**: Open the Microsoft Server Manager Console, click Tools in the upper right-hand corner, and click Group Policy Management.

### 2. Create Group Policy

1. Right-click on the organizational unit containing the computer(s) where NVM for Windows will be installed. Select "Create a GPO in this domain, and link it here.".
1. Click on the GPO. In the right-hand pane, select the "Scope" tab.
1. Under "Security Filtering", click "Add". In the "Enter object name to select" section, add `Domain Computers`. If you have any security groups you wish to limit the installation to, add them as well. Click "Check Names" to assure they are all recognized. Click OK to proceeed.
1. If "Authenticated Users" is present under "Security Filtering", remove it.
1. Click the "Delegation" tab. Assure `Domain Computers` and any groups you specified are in the list.

<img src="/img/guide_gpo-create.png" alt="Create GPO" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

### 3. Configure Group Policy Installation Package

1. Right-click the GPO and select "Edit".
1. Navigate to **Computer Configuration** > **Policies** > **Software Settings** > **Software installation**. Make sure to select the _Computer Configuration_ and not the user configuration. Unlike the public edition, NVM for Windows certified builds are installed at the machine level[^2].

<img src="/img/guide_software_install_policy.png" alt="Find the GPO Software Installation Path" style={{ marginLeft: '2em', width: 'auto', height: 'auto' }} />

3. Right-click "Software installation", then select "New > Package". This will open a file selection dialog.
1. Navigate to the location on your file server where the NVM for Windows installation media was uploaded. Select the `.msi` file and press "Open". This will present a "Deploy Software" dialog.
1. Select `Advanced` on the "Deploy Software" dialog, then "OK".
1. Click on the "Deployment" tab and choose "Assigned" as the deployment type. Check "Uninstall this application when it falls out of the scope of management" if you wish to remove NVM for Windows when it no longer applies to users.

:::warning[Automatic Uninstallation via GPO Consequences]
Automatically uninstalling NVM for Windows when the application falls out of the scope of management may have an unintended critical impact on users erroneously removed from the installation scope.

Uninstalling NVM for Windows removes all Node.js versions managed by NVM for Windows. This includes any global modules users have installed in these Node.js versions. It is possible to backup the Node.js storage directory before removing. This folder can be manually restored if NVM for Windows needs to be reinstalled later.

Default storage directory: `%LOCALAPPDATA%\Author Software\nvm\installs`
:::

7. Click the "Modifications" tab, then click the "Add" button.
1. Navigate to the file server and select the `.mst` file[^1]. By doing this, you're agreeing to the EULA on behalf of any user the application is installed for (required).
1. Press "OK" to close the window.
1. In the GPO manager, navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **System** > **Group Policy**.

<img src="/img/guide_loopback.png" alt="Enable Loopback Processing" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

11. Double-click to open the policy, choose "Enabled", and choose **Merge** or **Replace**.
1. Click "OK".

**Congratulations, you've created a group policy that will install NVM for Windows on user computers.**

:::tip[Update Client Device]
Run `gpupdate /force` in a terminal on the client device to immediately apply the policy.
:::

:::tip[Alternative User Configuration with Elevated Privileges]
It is also possible to create the installer under the user configuration by elevating user privileges for the installation.

This method moves the deployment to User Configuration so it triggers at logon, but configures Active Directory to temporarily bypass user restriction rules to execute the MSI with administrative authority.

1. **Create or Edit a GPO**: Link it to the OU containing your target Users.
1. **Configure Software Installation**: Add your MSI under User *Configuration* > *Policies* > *Software Settings* > *Software Installation*. Select *Advanced*, and you will now be able to check *Install this application at logon*.
1. **Elevate Installer Privileges:**
   1. Navigate to *Computer Configuration* > *Policies* > *Administrative Templates* > *Windows Components* > *Windows Installer*.
   1. Double-click **Always install with elevated privileges**.
   1. Set it to **Enabled**, click Apply, and click OK.
   1. Navigate to *User Configuration* > *Policies* > *Administrative Templates* > *Windows Components* > *Windows Installer*.
   1. Double-click **Always install with elevated privileges** there as well and set it to **Enabled**.

:::warning[Temporary Security Risk]
Enabling **Always install with elevated privileges** allows standard users to run any Windows Installer package with elevated privileges, which can be exploited by malicious actors.
:::

[^1]: The MST patch must be applied to automatically accept the EULA.
[^2]: If you are upgrading your fleet of computers from public builds to certified builds, the certified build MSI installer will automatically migrate existing Node.js installations and user preferences.
