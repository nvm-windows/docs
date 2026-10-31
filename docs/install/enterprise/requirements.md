---
title: Requirements
sidebar_position: 1
certified: true
---

import SymlinkPermissionExplainer from '../../_components/SymlinkPermissionExplainer.mdx';

# Requirements

|Requirement|Guidance|
|:-|:-|
|Installation media|Download the Certified Build from the [customer portal](https://portal.author.io). The zip file contains the deployment files.|
|Supported OS|Windows 11[^1]. Windows Server 2019 or later.|
|User privileges|No special privileges unless using  link mode with UNC paths. See [User privileges](#user-privileges).|
|Proxy exceptions|Allow `licensing.author.io`. If you use the Author Software Node.js mirror, also allow `mirror.author.io`. An air-gapped deployment does not need these exceptions. See [Proxy exceptions](#proxy-exceptions).|

## Understanding User Privileges

|If you plan to...|Required privileges|
|:-|:-|
|Force [shim mode](../../features/modes#shim-mode-default)|None.|
|Store Node.js versions on a local path. The default path `%LOCALAPPDATA%\Author Software\nvm\installs` is a local path.|None.|
|Store Node.js versions on a UNC path in [link mode](../../features/modes#link-mode). This could be a network share or a mapped drive, e.g. `\\server\path`, |`SeCreateSymbolicLinkPrivilege`|

<SymlinkPermissionExplainer/>

## Proxy exceptions \{#proxy-exceptions}

If your organization blocks outbound domains, allow `licensing.author.io`.
That host supplies license keys and public verification keys.

If you use the Author Software Node.js mirror (Governance), also allow `mirror.author.io`.

An air-gapped deployment does not need these exceptions.

---

[^1]: Windows 10 is end of support. NVM for Windows does not _officially_ support versions of Windows Microsoft does not support. However, NVM for Windows v2 runs on Windows 10 in our lab with some minor visual variations from Windows 11.
