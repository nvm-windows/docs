---
title: Requirements
certified: true
---

import SymlinkPermissionExplainer from '../../_components/SymlinkPermissionExplainer.mdx';

|Requirement|Guidance|
|:-|:-|
| **Installation&nbsp;Media** | Download NVM for Windows from the [customer portal](https://portal.author.io). The zip file contains everything you need. |
| **Supported OS** | Windows 11[^1], Windows 2019+ |
| **User Privileges** | No special permissions required, unless using [link mode](../../features/modes#link-mode) with UNC paths. |
| **Proxy&nbsp;Domain&nbsp;Exceptions**<br/><br/><br/><br/> |1. licensing.author.io<br/>2. mirror.author.io _(if using Author Software Node.js mirror)_ <br/><br/>_Unnecessary in airgapped deployments._ |

## User Privileges

|If you plan to...|Required Privileges|
|:-|:-|
|_force_ [shim mode](../../features/modes#shim-mode-default)...| None. |
|store Node.js versions on a local path...<br/>&nbsp;&nbsp;&raquo;&nbsp;*`%LOCALAPPDATA%\Author&nbsp;Software\nvm\installs` (default) is local*| None. |
|use UNC paths (e.g. network shares/mapped drives like `\\server\path`) in [link mode](../../features/modes#link-mode)| `SeCreateSymbolicLinkPrivilege`\* |

<SymlinkPermissionExplainer/>

## Proxy Exceptions

If your organization aggresively blocks traffic to domains, you must allow-list `licensing.author.io`. This domain provides license keys and public verification keys.

If your organization plans to use the Author Software Node.js mirror service (available in the governance package), `mirror.author.io` must also be allowed.

---

[^1]: As an EOL operating system, Windows 10 is not officially supported. However; v2.0.0 works on Windows 10 in our lab with some minor visual variations from Windows 11.
