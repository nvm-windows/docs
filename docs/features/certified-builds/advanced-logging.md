---
title: Advanced Logging
sidebar_label: Advanced Logging
sidebar_position: 2
certified:
  edition: Advanced Logging
---

# Advanced Logging

Advanced Logging is an add-on for [Certified Builds](../../guide/builds/).
It turns Windows Event Log activity into a stable, SIEM-friendly stream on a dedicated **NVM for Windows/Operational** channel.

Community Builds use [Windows Native Logging](../log) only (plaintext).
Certified Builds already use the dedicated Operational channel for classic events.
This add-on adds structured `EventName` + JSON `Payload` so collectors do not need to parse changing plaintext `Message` text.

For collector setup and queries, see the [SIEM guide](../../guide/siem).

## Why enable it

With Advanced Logging you can answer fleet questions from Event Logs / SIEM pipelines:

- Which Node.js versions run where, who installed or removed them, and on which host
- Which package the module firewall allowed (**NVM4408**) or denied (**NVM4403**) — named in a queryable `Payload`, not only that an allow/deny happened
- Launch provenance beyond classic Event 120 text: structured `parent_process`, `parent_pid`, `project_name`, and `project_path` on SIEM-oriented records (classic Certified launch logging already carries these fields when resolvable; see [Windows Native Logging](../log))
- Which permission flags the caller supplied, policy applied, or policy removed (`permission_allow.*`)
- Malware definition updates and malware blocks as Event Log records (not terminal-only)
- Network deadline budget hits (`network.deadline_exceeded`)
- When policy blocks package-manager lifecycle scripts on an install-class command (`package_manager.lifecycle_scripts_blocked`)

## What you get only with this add-on

These records appear on **NVM for Windows/Operational** as structured events (`EventName`, `Payload`, `Code`) only when Advanced Logging is licensed:

| Event | Code | Notes |
|:-|:-|:-|
| `package_manager.lifecycle_scripts_blocked` | **NVM4412** | Audit when HKLM blocks lifecycle scripts on an install-class command |
| `network.deadline_exceeded` | **NVM4501** | Catalog / mirror / download time budget used up |
| `malware.definitions_updated` | **NVM4601** | Successful `malware.db` change |
| `malware.package_blocked` | **NVM4602** | Shim blocked a package; terminal still prints without this add-on |

Module-firewall allow/deny, Node trust failures, and similar conditions still produce classic `Code` values without the add-on.
With Advanced Logging they also get queryable `EventName` / `Payload` (for example `package_manager.install`, `firewall.*`, `node.security.*`).

Full event-name list and starter queries: [SIEM](../../guide/siem).
Each `NVM####` value: [Error Codes](../../troubleshooting/error-codes).

## What Certified Builds already write

You do **not** need Advanced Logging for:

| Activity | Behavior |
|:-|:-|
| Basic Install / uninstall / default version / config change | Classic events on **NVM for Windows/Operational** (`Source`, `Message`, `Code`). `Code` is often `0` for informational system changes |
| Each `node.exe` launch | Event ID **120** `nodejs.executed` when [`log_executions`](../log) is on |
| Package-manager invocation | Event ID **120** `package_manager.executed` when `log_executions` is on (Certified Builds) |

:::warning[Plaintext Messages Only]
Classic events always include `Code` as a `UInt32` collectors can filter.
They do **not** include `EventName` or `Payload`.
Plaintext `Message` is for a person on the device. It can change as the product evolves. Do not treat it as a SIEM schema.
:::

## How structured events look

Each Advanced Logging event carries:

| Field | Role |
|:-|:-|
| `EventName` | Stable name for queries (for example `nodejs.executed`) |
| `Payload` | JSON context (user, host, package, paths, and more) |
| `Code` | `NVM####` as `UInt32` (`EventData.Code`) |

Structured templates use Event IDs **120** (info), **121** (warning), and **122** (error) on the same Operational channel.
If Event Viewer has no **NVM for Windows/Operational** channel, see [Windows Native Logging](../log).

## Related

- [SIEM](../../guide/siem) — fleet queries and field map
- [Windows Native Logging](../log) — Community Builds and `log_executions`
- [Choosing a Build](../../guide/builds/)
- [Error Codes](../../troubleshooting/error-codes)
