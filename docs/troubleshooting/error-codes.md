---
title: Error Codes
sidebar_label: Error Codes
sidebar_position: 2
---

# Error Codes

NVM for Windows uses stable `NVM####` codes in CLI messages, shim/proxy output, and Windows Application / operational logs. Use this page to interpret a code at a high level; run `nvm doctor` and check Event Viewer for the full message on a specific machine.

| Code | Meaning | Typically thrown when |
|:-|:-|:-|
| **NVM4100** | Silent install rejected a custom program directory | Community Inno Setup runs with `/SILENT` or `/VERYSILENT` and a non-default `/DIR` (program root must stay under LocalAppData) |
| **NVM4101** | Community build running outside its trusted program root | Community `nvm.exe` (or doctor) detects the process is not under `%LOCALAPPDATA%\Author Software\nvm`; advisory warning, not a hard block |
| **NVM4301** | Node.js integrity verification failed | Shim or node launcher refuses to run `node.exe` because Authenticode / trust checks failed; reinstall with `nvm install <ver> --force` is the usual recovery |
| **NVM4302** | Link-mode activation blocked | `nvm use` (link mode) rejects a version directory that is unsafe (for example writable by other users or a reparse point) or whose `node.exe` cannot be verified |
| **NVM4303** | Verify-cache state changed | Trusted verify-cache material for a Node binary no longer matches; NVM requires a full verification pass before trusting the binary again |
| **NVM4304** | Full verification recovered | Informational follow-up after **NVM4303**: full verification succeeded and the cache was restored |
| **NVM4305** | Package-manager launch blocked (unsafe Node directory) | Proxy blocks `npm` / `yarn` / `pnpm` (and similar) because the active Node version directory fails cross-user write / trust checks; often fixed with `nvm doctor --autofix` or a private install root |
| **NVM4306** | Delegated command trust failed | Proxy refuses a package-manager or script entrypoint that is unknown, unsigned, or fails delegated-command trust checks |

## Ranges

| Range | Role |
|:-|:-|
| **NVM41xx** | Installer / Community layout and support boundary |
| **NVM43xx** | Runtime Node trust, activation, and package-manager gatekeeping |

## Tips

- Codes appear in user-facing text as `Event code: NVM####` and may also be logged to the Windows Application log or NVM operational channels (edition-dependent).
- **NVM4304** is success/recovery telemetry, not a failure.
- Symptom-based fixes without a code: [General Troubleshooting](./general).
