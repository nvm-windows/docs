---
title: Deploy with Active Directory
sidebar_position: 3
certified: true
---

import DocImage from '@site/docs/_components/DocImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deploy with Active Directory

**You need:**

- The NVM for Windows MSI and the MST[^1] from the [customer portal](https://portal.author.io).
- Administrative access to the domain controller to create group policies.

### Prepare the file server

Group Policy reads the MSI and the MST from a network share.
**Domain Computers** must reach that share when the policy applies.

1. Copy the MSI and the MST from the deployment pack to a file server.
1. Make the share available to **Domain Computers** and to users in the GPO scope.
1. Grant those accounts read access.

<DocImage src="/img/guide_fileserver.png" alt="Source Files" style={{ width: '95%', height: 'auto' }} />

### 1. Open the Group Policy Management Console

Use one of these methods:

- **Run**: Press Windows Key + R, type `gpmc.msc`, and select OK.
- **Start menu**: Select Start, type Group Policy Management, and open the top result.
- **Server Manager**: Open Server Manager, select Tools, and select Group Policy Management.

### 2. Create Group Policy

1. Right-click the organizational unit that contains the target computers where NVM for Windows will be installed.
1. Select **Create a GPO in this domain, and link it here**.
1. Select the GPO.
1. In the right pane, select the **Scope** tab.
1. Under **Security Filtering**, select **Add**.
1. In **Enter the object name to select**, add `Domain Computers`.
1. Add security groups if you must limit the NVM for Windows install.
1. Select **Check Names**.
1. Confirm that every name resolves.
1. Select OK.
1. If **Authenticated Users** is under **Security Filtering**, remove it.
1. Select the **Delegation** tab.
1. Confirm that `Domain Computers` and your groups are in the list.

:::warning[Delegate Read for Authenticated Users]
Removing **Authenticated Users** from **Security Filtering** prvents NVM for Windows installations from running on every device in the domain. It also removes the GPO Read permission.
On the **Delegation** tab, add **Authenticated Users** with Read only. Without that Read permission, the GPO can fail to apply.
:::

<DocImage src="/img/guide_gpo-create.png" alt="Create GPO" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

### 3. Configure Group Policy Installation Package

1. Right-click the GPO and select **Edit**.
2. Go to **Computer Configuration** > **Policies** > **Software Settings** > **Software installation**.
   Select **Computer Configuration**.
   Do not select User Configuration.
   Certified Builds install at machine level[^2].
   The Community Build does not.

<DocImage src="/img/guide_software_install_policy.png" alt="Find the GPO Software Installation Path" style={{ marginLeft: '2em', width: 'auto', height: 'auto' }} />

3. Right-click **Software installation**.
4. Select **New** > **Package**.
   A file dialog opens.

:::warning[Use a UNC path]
In the file dialog, open `\\server\share\...`.
Do not open a mapped drive.
The computer account applies this policy at startup.
A mapped drive is not available to that account.
:::

5. Open the file-server folder that holds the NVM for Windows media.
6. Select the `.msi` file.
7. Select **Open**.
   The **Deploy Software** dialog opens.
8. Select **Advanced**.
9. Select **OK**.
10. Select the **Deployment** tab.
11. Set the deployment type to **Assigned**.
12. Select _Uninstall this application when it falls out of the scope of management_ **only if you want removal when the computer leaves the scope**.

:::warning[Automatic uninstall when the computer leaves scope]
Automatic uninstall runs when a computer leaves the management scope.
That uninstall can remove Node.js for a user that you remove by mistake.

The MSI deletes `%LOCALAPPDATA%\Author Software\nvm` for the user who runs the uninstall.
That folder holds that user's Node.js versions and global modules.
Other user profiles on the same computer can keep their own folders.
Copy that user's storage directory before you remove the product.
You can restore that folder if you install NVM for Windows again.

Default storage directory: `%LOCALAPPDATA%\Author Software\nvm\installs`
:::

13. Select the **Modifications** tab.
14. Select **Add**.
15. Open the file server and select the `.mst` file[^1].
    You then accept the [EULA](https://nvm-windows.com/eula.html) on behalf of every user who receives the install.
    This step is required.
16. Select **OK**.

The GPO now installs NVM for Windows on the target computers.

:::info[What Happens on Target Computers]
1. The MSI registers NVM for Windows as a Event Tracing for Windows event provider.
1. Legacy SYSTEM `NVM_HOME`, `NVM_SYMLINK`, and Community Build `PATH` entries are removed.
:::

:::warning
Do not add these scripts to this GPO:

- `Remediation/machine-startup.ps1`
- `Register-EventLogSource.ps1`
- `Remove-LegacySystemEnv.ps1`

Use these scripts only when the MSI did not register the event provider or did not remove the legacy entries.
Use them for that failed step, or for an offline retry.
The v2 installer already registers the event provider and removes the legacy entries.
:::

### 4. License the fleet

The MSI does not write the organization access token or private key.

:::info[Access token and private key]
- **Certified Build.** The access token is the license. `Set-NvmWindowsAccessToken.ps1` writes `AccessToken` and `JwksCose`. It does not write `AccessKey`.
- **Governance.** `Set-NvmWindowsLicensing.ps1` writes `AccessToken`, `AccessKey`, and `JwksCose`. `AccessKey` signs a short-lived JWT for requests to the Author Node.js mirror. See [Node.js mirror](/features/author-mirror#author-mirror).
:::

<Tabs>
  <TabItem value="certified" label="Certified Build" default>
    The Certified Build pack includes `Set-NvmWindowsAccessToken.ps1`.

    Add a **Computer Configuration** startup script.
    Do not put secret files on the software share.

    Pass the access token on the command line:

    ```powershell
    powershell.exe ^
      -ExecutionPolicy Bypass ^
      -File \\fileserver\software\nvm-windows\<version>\Licensing\Set-NvmWindowsAccessToken.ps1 ^
      -AccessToken "<jwt-from-portal>" ^
      -JwksCoseUrl "https://assets.nvm-windows.com/nvm-jwks.cose"
    ```

    See the [license secret notes](../../cfg/enterprise/registry.md).
  </TabItem>
  <TabItem value="governance" label="Governance">
    The Governance pack includes `Set-NvmWindowsLicensing.ps1`.

    Create a private key:

    1. Open [portal.author.io](https://portal.author.io).
    1. Go to NVM for Windows → Private Keys.
    1. Create a key with a memorable name. This represents a group of users.
    1. Save the secret that the portal shows.
       Author does not show the secret again.

    Add a **Computer Configuration** startup script.
    Do not put secret files on the software share.

    Pass the access token and the private key on the command line:

    ```powershell
    powershell.exe ^
      -ExecutionPolicy Bypass ^
      -File \\fileserver\software\nvm-windows\<version>\Licensing\Set-NvmWindowsLicensing.ps1 ^
      -AccessToken "<jwt-from-portal>" ^
      -AccessKey "<private-key>" ^
      -JwksCoseUrl "https://assets.nvm-windows.com/nvm-jwks.cose"
    ```

    See the [license secret notes](../../cfg/enterprise/registry.md).
  </TabItem>
</Tabs>

:::tip[Apply the install on a client]
A computer-assigned package installs when the computer starts.
`gpupdate /force` refreshes policy. It does not install the MSI.

Restart the computer after the refresh.
Or run `gpupdate /force /boot`.
That command refreshes policy, then restarts the computer so Software Installation can run.

A computer-assigned package has no supported install path that skips the restart.
:::

:::tip[Alternative: User Configuration with elevated privileges]
You can put the package under User Configuration and raise privileges for the install.

The install then runs at the next logon.
Sign out and sign in on the client. A restart is not required for this path.
Active Directory temporarily bypasses user limits so the MSI runs with administrative rights.

1. Create or edit a GPO.
   Link it to the OU that contains the target users.
1. Add the MSI under **User Configuration** > **Policies** > **Software Settings** > **Software Installation**.
1. Select **Advanced**.
1. Select **Install this application at logon**.
1. Raise installer privileges:
   1. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Windows Installer**.
   1. Double-click **Always install with elevated privileges**.
   1. Set it to **Enabled**.
   1. Select Apply, then OK.
   1. Go to **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Windows Installer**.
   1. Double-click **Always install with elevated privileges**.
   1. Set it to **Enabled**.
1. Turn on loopback processing so this user policy applies on the target computers:
   1. Go to **Computer Configuration** > **Policies** > **Administrative Templates** > **System** > **Group Policy**.
   1. Double-click **Configure user Group Policy loopback processing mode**.
   1. Select **Enabled**.
   1. Select **Merge** or **Replace**.
   1. Select **OK**.

<DocImage src="/img/guide_loopback.png" alt="Enable Loopback Processing" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

:::warning[Temporary security risk]
**Always install with elevated privileges** lets a standard user run any Windows Installer package with elevated rights.
An attacker can use that setting.
:::

[^1]: You must apply the MST. The MST accepts the [EULA](https://nvm-windows.com/eula.html).
[^2]: An upgrade from a Community Build to a Certified Build keeps existing Node.js installations and user preferences. The Certified Build MSI does that move.
