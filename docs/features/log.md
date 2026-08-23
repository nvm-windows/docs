---
title: Event Logging
sidebar_position: 6
tags: [native-integration]
---

Critical events, such as installations, configuration changes, and security events are logged natively, available in Windows Event Viewer. This allows for clear organization observability and auditing using tools most organizations already have.

![1776532731980](/img/features/native/1776532731980.png)

Only critical change events are logged by default. Additional logging is available through [configuration](../cfg/core#logging-and-announcements). It is possible to log every `node.exe` / `npm` / `npx` invocation (as well as other major package managers).

:::warning[Basic Logging]
Logs are written as plaintext entries to the Windows Application log (shown above), with generic event codes.

If the NVM for Windows community installer is prevented from registering itself as a Windows event source, Application log entries are written as an "unknown" event source instead of "NVM for Windows". This is not an issue in certified distribution builds.
:::

:::tip[SIEM/Audit Logging]
The **advanced logging** add-on writes structured entries, with well known SIEM event codes, to a dedicated native NVM for Windows log (not the Application log). This is designed for streamlined SIEM integration and straightforward querying.
:::
