---
title: Event Logging
sidebar_position: 4
tags: [native-integration]
---

Critical events — installations, configuration changes, and security events — are logged natively in Windows Event Viewer. Community and Certified Builds both get operational events; org-wide SIEM/audit pipelines usually pair Event Viewer with the Advanced Logging add-on (below).

![1776532731980](/img/features/native/1776532731980.png)

Only critical change events are logged by default. Additional logging is available through [configuration](../cfg/core#logging-and-announcements). It is possible to log every `node.exe` / `npm` / `npx` invocation (as well as other major package managers).

:::warning[Event source registration]
Community and Certified Builds both register an ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` next to `nvm.exe`). Look under **Applications and Services Logs → NVM for Windows/Operational**, not only the classic Application log.

If setup cannot elevate for `nvm --register-eventlog` (UAC canceled / non-admin), registration is skipped. Run that command later from an elevated terminal, or reinstall and accept the UAC prompt.
:::

:::tip[Certified Builds — Advanced Logging]
The **Advanced Logging** add-on (Certified Builds, available September 2026) writes structured entries with well-known SIEM event codes to a dedicated native NVM for Windows log (not the Application log). Use it for fleet SIEM integration and audit querying.
:::
