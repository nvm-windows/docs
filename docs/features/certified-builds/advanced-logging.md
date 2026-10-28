---
title: Advanced Logging
sidebar_label: Advanced Logging
sidebar_position: 2
certified:
  edition: Advanced Logging
---

# Advanced Logging

Advanced Logging is an add-on for **Certified Builds**.
Community Builds are limited to [Basic Native Logging](../log).

Advanced Logging writes structured entries to the **NVM for Windows/Operational** provided in [Certified Builds](../../guide/builds/).

Without Advanced Logging, `nvm.exe` and the shims still write classic events to that channel. Classic events include `Source`, a plaintext `Message`, and `Code`. `Code` is a `UInt32`. Collectors can filter it. They do not include `EventName` or `Payload`.

Advanced Logging writes structured events on the same channel.
Each structured event has `EventName`, `Payload`, and `Code`.
Collectors query `EventData.Code` for an `NVM####` value.

:::tip[Recommended for SIEM]
Advanced Logging was designed to produce site-wide insights into which versions of Node.js are used, which devices are vulnerable to Node.js exploits, how Node is used on desktops by humans and agents, and to provide an auditable/observable stream of data to help prevent exploits in organizations. Use the [SIEM guide](../../guide/siem) to configure collector setup and establish the queries / reports your organization needs to obtain these benefits.
:::

## What Advanced Logging adds

`Code` still identifies an `NVM####` condition without this add-on.
It does not name the event.
It does not name the package, user, project, or parent process.

With `EventName` and `Payload`, you can query:

- Which Node.js versions run in the organization, who installed or removed them, and on which host.
- Which package a module-firewall allow (**NVM4408**) or deny (**NVM4403**) named. Classic `Code` is allow or deny only.
- Each `npm` / `yarn` / `pnpm` launch (`package_manager.executed`). Classic logging does not write this event.
- When HKLM blocks package-manager lifecycle scripts on an install-class command (`package_manager.lifecycle_scripts_blocked`, **NVM4412**). Classic logging does not write this event.
- A malware block as an Event Log record (`malware.package_blocked`). Without this add-on, the block prints in the terminal only.
- A network deadline (`network.deadline_exceeded`). Classic logging does not write this event.
- Whether a `node` launch came from a human or an agent (`parent_process`, `parent_pid`), and which project (`project_name`, `project_path`).
- Which permission flags the caller supplied, policy applied, or policy removed (`permission_allow.*`).

Plaintext `Message` is meant for a person on their own device. It can and will change as the Node.js ecosystem evolves. SIEM systems cannot reliably treat plaintext messages as a reliable schema.

Advanced logging adds data schema guarantees. `EventName` and `Payload` are the collector contract. See [SIEM](../../guide/siem) for starter queries.

Certified Builds write to **NVM for Windows/Operational** without the advanced logging add-on. Install, uninstall, default-version, and configuration changes still appear too. These events have no `NVM####` number though and the `Code` is always `0`. These cannot be filtered as an error code.

Some records never hit the Operational log without this add-on:

- `package_manager.executed`
- `package_manager.lifecycle_scripts_blocked`
- `network.deadline_exceeded`
- `malware.definitions_updated`
- `malware.package_blocked`.

## Comparisons

### Format Comparison
| | Community Builds | Certified Builds | +Advanced Logging |
|:-|:-:|:-:|:-:|
| **Channel** | `NVM for Windows/Operational` after event-source registration. Layout **NVM4101** uses Windows `Application`. | `NVM for Windows/Operational` | `NVM for Windows/Operational` |
| **Templates** | Event IDs 100–102 (`nvm.exe`),<br/>210–212 (shim) | Event IDs 100–102 (`nvm.exe`),<br/>210–212 (shim) | Certified + **120** / **121** / **122** |
| **Queryable&nbsp;fields** | `Source`, `Message`, `Code` (`UInt32`; `0` when not an `NVM####`) | `Source`, `Message`, `Code` (`UInt32`; `0` when not an `NVM####`) | `EventName`, `Payload` (JSON), `Code` |
| **Actor / context** | Not in EventData | Stuffed in `Message` when `Code` is `0` | `user`, `sid`, `hostname`, `parent_process`, `parent_pid`, `project_name`, `project_path`, `correlation_id` |
| **Collector contract** | `Message` text can change | `Message` text can change | `EventName` and `Payload` stay stable |

### Log Entry Comparison
| | Community Builds | Certified Builds | +Advanced Logging |
|:-|:-:|:-:|:-:|
| **Install / uninstall** | Classic 100–102. `Code` is `0`. Message `nvm.system.changed {json}`. | Classic 100–102. `Code` is `0`. Message `nvm.system.changed {json}`. | `nvm.system.changed`. Filter `Action`, `NodeVersion`, `User`, `hostname`. |
| **Default version** | Classic 100–102 | Classic 100–102 | `nvm.version.activated` |
| **Configuration change** | Classic 100–102 | Classic 100–102 | `nvm.configuration.changed` |
| **Each&nbsp;`node.exe`&nbsp;invocation** | Event ID **120** `nodejs.executed` when `log_executions` is on. Event **200** unused. | Event ID **120** `nodejs.executed` when `log_executions` is on. Event **200** unused. | Same Event **120**, including `permission_allow.*` when a permission launch is active |
| **Package-manager invocation** | :x: | :x: | `package_manager.executed` when `log_executions` is on |
| **Module firewall allow / deny** | :x: | Classic `Code` **4408** / **4403** | `package_manager.install` |
| **Node trust / verify-key** | Classic `Code` **4301–4312** | Classic `Code` **4301–4312** | `node.security.*`, `verify_key.open_failed` |
| **NVM Firewall policy and remote checks** | :x:<br/>(plaintext  untrusted-module change) | Classic `Code` **4401–4410** | `firewall.*` event names |
| **Network deadlines** | :x: | :x: | `network.deadline_exceeded` (**NVM4501**) |
| **Malware definitions / blocks** | :x:<br/>(terminal only) | :x:<br/>(terminal only) | **NVM4601**, **NVM4602** on Event ID **120** |

The full event-name list is on [SIEM](../../guide/siem).

## Malware feed

These events are written only when Advanced Logging is on.
They use Windows Event ID 120 on **NVM for Windows/Operational**.
Blocked activities still print in the terminal when Advanced Logging is off, but will not write `package_manager.install`.

| Code | Event | Payload |
|------|--------|---------|
| **NVM4601** | `malware.definitions_updated` | `added`, `removed`, `seq`, `previous_seq` |
| **NVM4602** | `malware.package_blocked` | package name, version when known, command, `source`, `reason` |

See [SIEM](../../guide/siem) for queries.
See [Error Codes](../../troubleshooting/error-codes) for each `NVM####` value.

If Event Viewer has no **NVM for Windows/Operational** channel, see [Windows Native Logging](../log).

## Related

- [SIEM](../../guide/siem) — fleet queries
- [Basic Native Logging](../log) — Community Builds
- [Choosing a Build](../../guide/builds/)
