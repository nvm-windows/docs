---
title: Event Logging
sidebar_position: 6
tags: [native-integration]
---

Critical events, such as installations, configuration changes, and security events are logged natively, available in Windows Event Viewer. This allows for clear organization observability and auditing using tools most organizations already have.

![1776532731980](/img/features/native/1776532731980.png)

Only critical change events are logged by default. Additional logging is available through [configuration](../cfg/core#logging-and-announcements). It is possible to log every `node.exe` / `npm` / `npx` invocation (as well as other major package managers).

:::warning[Event source registration]
Community and certified builds both register an ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` next to `nvm.exe`). Look under **Applications and Services Logs → NVM for Windows/Operational**, not only the classic Application log.

If setup cannot elevate for `nvm --register-eventlog` (UAC canceled / non-admin), registration is skipped. Run that command later from an elevated terminal, or reinstall and accept the UAC prompt.
:::

:::tip[SIEM/Audit Logging]
The **Advanced Logging** add-on will be available in September 2026. It writes structured entries, with well known SIEM event codes, to a dedicated native NVM for Windows log (not the Application log). This is designed for streamlined SIEM integration and straightforward querying.
:::
