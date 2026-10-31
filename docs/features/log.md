---
title: Windows Native Logging
sidebar_label: Windows Native Logging
sidebar_position: 4
tags: [native-integration]
---

# Windows Native Logging

:::note[Basic Logging]
_This overview covers basic logging. [Advanced Logging]() is available for [Certified Builds]()._
:::

Critical events are logged natively, including activities like Node.js version installations, configuration changes, and security concerns.

Community Builds produce events in plaintext entries in the Windows Application log, which is visible from Windows Event Viewer. "NVM for Windows" is registered as an event source.

![1776532731980](/img/features/native/1776532731980.png)


:::tip[Certified Builds: Dedicated Channel & Advanced Logging]
Certified Builds produce events in a dedicated `NVM for Windows/Operational` log, which is also visible from Windows Event Viewer. The [Advanced logging](./certified-builds/advanced-logging) add-on is available for Certified Builds, offering enriched / structured logs for auditing, observability, and [SIEM pipelines](../guide/siem).
:::



## Verbose Logging Options

Only critical change events are logged by default, but it is possible to log more activities.

### Log node.exe invocations

When you turn this on, NVM writes one Windows event for every `node.exe` invocation ([shim mode](./modes) only).

```powershell
nvm config set log_executions=true
node -v
```

1. Open Event Viewer.
1. Open **Windows Logs** → **Application**.
1. Filter by source **NVM for Windows**.

Each `node.exe` launch is Event ID **120** (`nodejs.executed`). Event ID **200** is unused.

```powershell
wevtutil qe Application /q:"*[System[Provider[@Name='NVM for Windows'] and (EventID=120)]]" /f:text /c:5
```

[Advanced Logging](./certified-builds/advanced-logging) details additional capabilities.
[SIEM](../guide/siem) has fleet queries.

## Warnings

:::warning[Event source registration]
Both builds register an ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` next to `nvm.exe`).
Community Builds register the **NVM for Windows** source on the Windows Application log. Certified Builds register **NVM for Windows/Operational** instead. Advanced Logging requires this dedicated channel.

If setup cannot elevate (UAC canceled / non-admin), or the log is missing, run `nvm --register-eventlog` from an elevated terminal, or reinstall and accept the UAC prompt.
:::

## Related

- [Advanced Logging](./certified-builds/advanced-logging) — Certified Builds structured events
- [SIEM](../guide/siem) — fleet queries
- [Operating Modes](./modes)
