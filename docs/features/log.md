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
The **Advanced Logging** add-on (Certified Builds) writes structured entries with `EventName` and JSON `Payload` to **NVM for Windows/Operational**. Use the [SIEM guide](../guide/siem) for collector setup and starter queries. Details: [Advanced Logging](./certified-builds/advanced-logging).
:::

## Malware feed

These events are written only when advanced logging is on. They use Windows Event ID 120 on `NVM for Windows/Operational`. A block still prints in the terminal when that license is off, and that block does not write `package_manager.install`.

| Code | Event | Payload |
|------|--------|---------|
| **NVM4601** | `malware.definitions_updated` | `added`, `removed`, `seq`, `previous_seq` |
| **NVM4602** | `malware.package_blocked` | package name, version when known, command |
