---
title: SIEM
sidebar_label: SIEM
sidebar_position: 7
certified:
  edition: Advanced Logging
---

import SiemQuery from '@site/docs/_components/SiemQuery';

# SIEM

Security Information and Event Management (SIEM) systems collect logs from many devices into one store.This store can be queried for incidents, policy gaps, and inventory.

NVM for Windows [Advanced Logging](../features/certified-builds/advanced-logging) writes Node.js activity in an SIEM-friendly format, in a dedicated **NVM for Windows/Operational** channel. Send that channel to your SIEM to see which Node.js versions run in the organization, who installed or removed them, when a firewall or malware rule blocked a package, and much more.

:::info[Structured Logs]
Advanced logging produces structured logs with metadata fields. These are explicitly designed for querying.

Without this, SIEM collectors would require custom parsers against plaintext messages, with no syntax guarantees. The plaintext logging available without advanced logging is designed for individual user readability, not SIEM or analytics. Plaintext logs will change over time with community feedback. Advanced Logging exists to provide a reliable log source for critical auditing capabilities.
:::

This guide shows how to collect the channel, then gives starter queries.

## Setup the collector

| Item | Value |
|:-|:-|
| Channel | `NVM for Windows/Operational` |
| Provider | `NVM for Windows` |
| Provider GUID | `{4c0f8d8e-2d6b-4f93-9f0f-3f0d7b4e2d11}` |

Point your collector at the `NVM for Windows/Operational` channel. Do not collect only the Windows Application log. Application warnings, such as **NVM4101**, are a separate stream.

Structured events need the Advanced Logging add-on. Without that license, classic events still include `Code`. They do not include `EventName` or `Payload`.

## How to query

There is a full list of [Error Codes](../troubleshooting/error-codes) (and explanations) for use in SIEM pipelines. When querying, drop the `NVM` prefix. For example, `NVM4312` is `EventData.Code == 4312`.

| You want | Filter |
|:-|:-|
| Structured info, warning, or error | Event ID **120**, **121**, or **122** |
| An NVM code | `Code` (number only) |
| A named lifecycle or audit event | `EventName`, then parse `Payload` as JSON |

|Field|Detail|
|:-|:-|
|`Payload`|JSON string - Do not look for the NVM number inside this field.|
|`Code`|Separate `UInt32` - `Code` is `0` when the event is not an `NVM####` condition.|

Collectors flatten EventData in different ways. Use the names your platform created if a sample field is missing.

| | Microsoft Sentinel | Splunk | Elastic | Event Viewer |
|:-|:-|:-|:-|:-|
| Channel | `EventLog` | `Channel` | `winlog.channel` | log name |
| Event ID | `EventID` | `EventCode` | `winlog.event_id` | `EventID` |
| Event name | `EventData.EventName` | `EventData.EventName` | `winlog.event_data.EventName` | `Data[@Name='EventName']` |
| Payload | `EventData.Payload` | `EventData.Payload` | `winlog.event_data.Payload` | `Data[@Name='Payload']` |
| Code | `EventData.Code` | `EventData.Code` | `winlog.event_data.Code` | `Data[@Name='Code']` |
| Computer | `Computer` | `Computer` | `winlog.computer_name` | — |

## Example Queries
<SiemQuery id="nvmCode" />

### Node.js versions in use

Event ID **200** records each shim launch when `log_executions` is on.
This Event ID does not need Advanced Logging.

<SiemQuery id="versionsInUse" />

With Advanced Logging, the structured form is `nodejs.executed` on Event ID **120**.

<SiemQuery id="nodejsExecuted" />

### Who installed a Node.js version

<SiemQuery id="installedVersions" />

### Who installed Node.js 20

<SiemQuery id="installedNode20" />

Change `20.` to another major version, or to an EOL line your policy tracks.
The event does not mark EOL for you.

### Who uninstalled a Node.js version

<SiemQuery id="uninstalledVersions" />

### Which version became the default

<SiemQuery id="versionActivated" />

### Package-manager installs allowed or blocked

Certified Builds write `package_manager.install` when the module firewall allows or denies an install.
**NVM4408** is an allow.
**NVM4403** is a deny.
A malware block does not write this event. Use **NVM4602** instead.

<SiemQuery id="packageManagerInstall" />

### Malware blocks

<SiemQuery id="malwareBlocks" />

Inspect `Payload` for the package name, version when known, command, `source`, and `reason`.

### Integrity verification failures

Authenticode / trust failures are **NVM4301**. A swapped `node.exe` whose FileVersion does not match the folder is **NVM4314**.

<SiemQuery id="integrityFailures" />

### Version firewall blocks

Certified `VersionAllowList` / `VersionBlockList` denies are **NVM4411**.

<SiemQuery id="versionFirewall" />

### Lifecycle scripts blocked

HKLM `BlockPackageManagerLifecycleScripts` writes **NVM4412** (`package_manager.lifecycle_scripts_blocked`) on Certified Builds with Advanced Logging when the proxy rewrites an **install-class** command (`install`, `ci`, `add`, `update`, `rebuild`, and similar; `npx` with a package; bare `yarn`). `npm --version` and `npm run` do not write it. The lock still applies to those commands. This is audit, not a failed install. Community Builds do not write it. Inspect `Payload.command`, `Payload.verb`, and `Payload.action`.

<SiemQuery id="lifecycleScriptsBlocked" />

### Configuration changes

<SiemQuery id="configurationChanges" />

## Event ID templates

The Windows Event ID is the template.
It is not the NVM number.

| Event ID | Writer | Fields |
|:-|:-|:-|
| 100 | `nvm.exe` info | `Source`, `Message`, `Code` |
| 101 | `nvm.exe` warning | `Source`, `Message`, `Code` |
| 102 | `nvm.exe` error | `Source`, `Message`, `Code` |
| 120 | structured info | `Source`, `EventName`, `Payload`, `Code` |
| 121 | structured warning | `Source`, `EventName`, `Payload`, `Code` |
| 122 | structured error | `Source`, `EventName`, `Payload`, `Code` |
| 200 | shim execution | `RequestedCommand`, `ResolvedPath`, `NodeVersion`, `Arguments`, `WorkingDirectory` |
| 210 | shim info | `Source`, `Message`, `Code` |
| 211 | shim warning | `Source`, `Message`, `Code` |
| 212 | shim error | `Source`, `Message`, `Code` |

Event ID **200** has no `Code` field.

Security events from the shims include `user`, `sid`, `hostname`, `parent_process`, `parent_pid`, `project_name`, and `project_path` when the process can resolve them.
An empty value is `unknown`.

## Event names with Code 0

Query these by `EventName`.

| EventName | What it records |
|:-|:-|
| `nvm.system.changed` | Install, uninstall, and similar lifecycle results. Payload: `Action`, `NodeVersion`, `Outcome`, `User`, `sid`, `hostname`, `correlation_id`. |
| `nvm.configuration.changed` | A setting change. Payload: `Configuration`, `Value`, `Old`, `Outcome`. |
| `nvm.version.activated` | The active Node.js version changed. Payload: `version`, `previous_version`, `user`, `hostname`. |
| `nodejs.executed` | A `node` launch when `LogExecutions` is `1`. Source `node-shim`. When permission allow flags were supplied, applied, or removed, the payload includes `permission_allow.supplied`, `permission_allow.applied`, and `permission_allow.removed`. |
| `package_manager.executed` | An `npm`, `yarn`, `pnpm`, or similar launch on a Certified Build when `LogExecutions` is `1`. Source `proxy`. |

## Event names that carry an NVM code

Match `Code` to the number in [Error Codes](../troubleshooting/error-codes).

| EventName | Code | Source |
|:-|:-|:-|
| `verify_key.open_failed` | 4312 | `nvm.exe` on a Certified Build. A Community Build writes Event ID 102 with the same code. |
| `node.security.verification_failed` | 4301 | `node-shim` or `proxy` |
| `node.security.activation_blocked` | 4302 or 4305 | `nvm.exe` uses 4302. The proxy uses 4305. |
| `node.security.cache_state_changed` | 4303 | `node-shim` or `proxy` |
| `node.security.full_verification_recovered` | 4304 | `node-shim` or `proxy` |
| `node.security.version_mismatch` | 4314 | `node-shim` or `proxy`. PE FileVersion does not match the install folder. |
| `node.security.version_firewall_blocked` | 4411 | `node-shim` or `proxy`. Certified `VersionAllowList` / `VersionBlockList` denied the version. |
| `package_manager.lifecycle_scripts_blocked` | 4412 | `proxy`. Advanced Logging only. HKLM lifecycle-script lock on an install-class command. |
| `network.deadline_exceeded` | 4501 | `nvm.exe` or `sync.exe` |
| `malware.definitions_updated` | 4601 | `sync.exe`. Advanced Logging only. |
| `malware.package_blocked` | 4602 | Shim. Advanced Logging only. |
| `firewall.elevation_required` | 4404 | `nvm.exe` |
| `firewall.invalid_rule` | 4405 | `nvm.exe` |
| `firewall.untrusted_module_changed` | 4406 | `nvm.exe` or `proxy` |
| `firewall.remote_request` | 4407 | `nvm.exe` |
| `firewall.remote_allowed` | 4407 | `nvm.exe` |
| `firewall.remote_trust_allowed` | 4407 | `nvm.exe` |
| `firewall.remote_unauthorized` | 4401 | `nvm.exe` |
| `firewall.remote_failed` | 4402 or 4409 | `nvm.exe` or `proxy`. 4409 means the host was unreachable. |
| `firewall.remote_blocked` | 4403 | `nvm.exe` only. The proxy event of the same name uses code 0. |
| `firewall.policy_mutated` | 4410 | `nvm.exe` |
| `firewall.policy_mutate_failed` | 4410 | `nvm.exe` |
| `package_manager.install` | 4403 or 4408 | `proxy` on a Certified Build. 4403 is a deny. 4408 is an allow. |
