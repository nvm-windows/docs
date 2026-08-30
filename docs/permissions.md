---
sidebar_label: Permissions
sidebar_position: 5
---

import SymlinkPermissionExplainer from './_components/SymlinkPermissionExplainer.mdx';

# Permissions

**No special permissions** are required to install or operate NVM for Windows. Users may _want_ to leverage special permissions in select circumstances though.

## Community Installer: Registered Event Source

The community installer attempts to register NVM for Windows as an application event source. This allows Windows Event Viewer to display "NVM for Windows" instead of "Unknown" for native logs it writes. This can be helpful for sorting and filtering logs in Windows Event Viewer.

Windows requires administrative privileges to register an event source. The installer attempts to elevate privileges, triggering a UAC prompt. If the user account lacks these permissions (or refuses them), the event source will not be registered. Logs are still written to and readable from Windows Event Viewer with the aforementioned caveat.

Most commnunity users have administrative rights on their own computer. For those who don't, such as users working on company computers or in highly regulated industries, consider using certified builds (available September 2026), which are not subject to this restriction.

## Link Operating Mode: UNC Paths

<SymlinkPermissionExplainer/>

:::warning[No Elevation]
Starting in v2, NVM for Windows will not attempt to elevate permissions on failure of symlink creation (i.e. no UAC prompt). If permissions block the creation of a link, the user is notified (desktop notification) with guidance.
:::

By default, NVM for Windows is configured to operate in the new "shim" mode.

## Policy Management

In secure/regulated environments, it may be desirable to enforce policies around specific features. This may include restricting which Node.js versions can be installed, what `node.exe` is allowed to access, how npm/pnpm/yarn manage module installation, which global modules can be installed, and more.

These are all configuration controls, not operating system permissions. Policy enforcement is available in certified governance builds.
