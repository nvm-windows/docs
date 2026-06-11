---
title: Native Integrations
sidebar_position: 2
---

NVM for Windows runs natively on Microsoft Windows. Several integrations help it fit into the broader Microsoft ecosystem while remaining familiar and friendly for Node.js developers.

## Windows Apps

Installed versions of Node.js are visible in the Windows Apps screen. They can be uninstalled via CLI or directly from there:

![1776491546067](image/install/1776491546067.png)

## Windows Event Center

Critical events, such as Node.js installations/uninstallations, nvm configuration changes, and security events are logged natively. This allows for clear observability and auditing using tools most organizations already use.

![1776532731980](image/native/1776532731980.png)

The application currently logs critical change events only. While in strongly audited environments it is possible to log every node.exe/npm/npx invocation, NVM for Windows does not include this capability by default to prevent noisy logs. With enough support from customers, we may consider adding more granular logging options to Certified Builds of NVM for Windows in the future.

:::warning
**Do not run the Community Edition installer as administrator!**
Running as administrator will configure all settings for the "administrator" account instead of your user account.

The Community Edition installer prompts the user to elevate permissions in order to register NVM for Windows as a system event source. If it is not possible to elevate permissions during installation, event logging will still work, but Windows will show an "unknown" source instead of "NVM for Windows". It will also fallback to more generic event codes.

**These concerns do not apply to the Certified Build installer.**
:::

## Windows Notification Center

NVM for Windows leverages native Windows desktop notifications. Missed notifications will be available in the Windows Notification Center until acknowledged. Personal Windows notification preferences are honored.

<img
	src={require('./image/native/1776541489737.png').default}
	alt="Windows Notification Center"
	style={{width: '40%', maxWidth: '480px'}}
/>

## Windows Registry

As of v2.0.0, settings and preferences are stored in the registry under user keys. These can be modified with the [`nvm config`](../command/config) command.

Prior versions of NVM for Windows utilized a plain text file for settings. Some users experienced difficulties with special characters due to encoding types enforced by older versions of Go. By leveraging the registry instead, Windows handles encoding natively, by the native locale.

:::tip Enterprise Security
NVM for Windows provides significant capabilities for developers. In highly regulated environments, some of these capabilities may need to be throttled or disabled for compliance.

**Certified Builds** provide an option to override settings, enabling organizations to secure desktop environments according to their own policies.
:::