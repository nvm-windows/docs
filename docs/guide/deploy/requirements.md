---
sidebar_position: 2
certified: true
---

# Prerequisites & System Requirements

Phase 1 of [Enterprise Deployment](/guide/deploy/). Complete these steps before [installing](install) NVM for Windows.

|Requirement|Guidance|
|:-|:-|
| **Installation&nbsp;Media** | Download your NVM for Windows deployment pack from the [customer portal](https://portal.author.io). |
| **Supported OS** | Windows 11[^1], Windows 2019+ |
| **User Privileges** | No special permissions required, unless using [link mode](../../introduction/modes#link-mode) with UNC paths. |
| **Proxy&nbsp;Exceptions**<br/><br/> |1. licensing.author.io<br/>2. download.author.io _(if using Author Software Node.js mirror)_ |

## User Privileges

|If you plan to...|Required Privileges|
|:-|:-|
|_force_ [shim mode](../../introduction/modes#shim-mode-default)...| None. |
|store Node.js versions on a local path...<br/>&nbsp;&nbsp;&raquo;&nbsp;*`%LOCALAPPDATA%\Author&nbsp;Software\nvm\installs` (default) is local*| None. |
|use UNC paths (e.g. network shares/mapped drives like `\\server\path`) in [link mode](../../introduction/modes#link-mode)| `SeCreateSymbolicLinkPrivilege`\* |

\*NVM for Windows [link mode](../../introduction/modes#link-mode) uses NTFS junctions to resolve Node.js versions. NTFS junctions do not support UNC paths, but symlinks do. When the Node.js storage location is configured to use a UNC path, NVM for Windows creates symlinks instead of NTFS junctions.

:::tip[Enabling `SeCreateSymbolicLinkPrivilege`]
- Users with administrative rights have this privilege by default.
- This privilege is granted when **[Windows Developer Mode](https://learn.microsoft.com/en-us/windows/advanced-settings/developer-mode)** is enabled.
- This privilege can be granted via group policy by enabling:<br/>
**Computer Configuration** > **Windows Settings** > **Security Settings** > **Local Policies** > **User Rights Assignment** > *Create symbolic links*.
:::

## Proxy Exceptions

If your organization aggresively blocks traffic to domains, you must allow-list `licensing.author.io`. This domain provides license keys and public verification keys.

If your organization plans to use the Author Software Node.js mirror service available in certified governance builds and above, `download.author.io` must also be allowed.



[^1]: As an EOL operating system, Windows 10 is not technically supported. However; v2.0.0 works on Windows 10 in our lab tests with some visual variations from supported versions.
