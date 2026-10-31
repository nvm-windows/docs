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
| **NVM4101** | Community Build running outside its trusted program root | Community `nvm.exe` (or doctor) detects the process is not under `%LOCALAPPDATA%\Author Software\nvm`; advisory warning, not a hard block |
| **NVM4102** | Scheduled task cleanup exceeded 3 minutes | Setup was still removing old NVM scheduled tasks after 3 minutes. Setup rolls back |
| **NVM4103** | Storage permission check exceeded 5 minutes | Setup was still checking Node.js storage permissions after 5 minutes. Setup rolls back |
| **NVM4104** | Legacy Node.js link cleanup exceeded 5 minutes | Setup was still removing the old Node.js link after 5 minutes. Setup rolls back |
| **NVM4105** | Node.js version copy exceeded 5 minutes | Setup was still copying one Node.js version after 5 minutes. Each version has its own limit. Setup rolls back |
| **NVM4106** | Official Node.js adopt exceeded 15 minutes | Setup was still copying the official Node.js install after 15 minutes. Setup rolls back |
| **NVM4107** | Installed Node.js registration exceeded its time limit | Setup was still registering or signing installed Node.js versions after the hang limit. Community setup allows 10 minutes, plus 2 minutes for each version, and stops at 30 minutes. Certified setup allows 30 minutes. Setup rolls back |
| **NVM4108** | Sync task creation exceeded 3 minutes | Setup was still creating the background sync task after 3 minutes. Setup rolls back |
| **NVM4109** | Shim link creation exceeded 3 minutes | Setup was still creating the `.nodejs` shim link after 3 minutes. Setup rolls back |
| **NVM4110** | PATH update failed or exceeded 3 minutes | Setup could not put the NVM directories ahead of official Node.js, or that update was still running after 3 minutes. Setup rolls back |
| **NVM4111** | Event log registration exceeded 5 minutes | Setup was still registering the Windows event log after 5 minutes. A declined admin prompt is not this error. Setup rolls back |
| **NVM4112** | Storage permission repair exceeded its time limit | Setup was still repairing Node.js folder permissions after the hang limit. The limit matches **NVM4107**. Setup rolls back |
| **NVM4113** | Shim rebuild exceeded its time limit | Setup was still rebuilding shims after the hang limit. The limit matches **NVM4107**. Setup rolls back |
| **NVM4114** | Closing Node.js processes exceeded 3 minutes | Setup was still closing Node.js processes that lock the install after 3 minutes. Setup rolls back |
| **NVM4115** | Official Node.js uninstall exceeded 10 minutes | Setup was still uninstalling the official Node.js product after 10 minutes. Setup rolls back |
| **NVM4116** | Machine-triggered community installation | Community Inno Setup aborted a machine-controlled install (SYSTEM, Intune including Store Required/Available, GPO, Task Scheduler, or ConfigMgr). A silent install while Intune `AgentExecutor` is running is treated as machine-controlled. User-controlled installs still work: the setup wizard, Microsoft Store click, WinGet, UniGetUI/WingetUI, or a real terminal. Use [Certified Builds](https://nvm-windows.com/certified) for IT-managed deployment. |
| **NVM4301** | Node.js integrity verification failed | Shim or node launcher refuses to run `node.exe` because Authenticode / trust checks failed; reinstall with `nvm install <ver> --force` is the usual recovery |
| **NVM4302** | Link-mode activation blocked | `nvm use` (link mode) rejects a version directory that is unsafe (for example writable by other users or a reparse point) or whose `node.exe` cannot be verified |
| **NVM4303** | Verify-cache state changed | Trusted verify-cache material for a Node binary no longer matches; NVM requires a full verification pass before trusting the binary again |
| **NVM4304** | Full verification recovered | Informational follow-up after **NVM4303**: full verification succeeded and the cache was restored |
| **NVM4305** | Package-manager launch blocked (unsafe Node directory) | Proxy blocks `npm` / `yarn` / `pnpm` (and similar) because the active Node version directory fails cross-user write / trust checks; often fixed with `nvm doctor --autofix` or a private install root |
| **NVM4306** | Delegated command trust failed | Proxy refuses a package-manager or script entrypoint that is unknown, unsigned, or fails delegated-command trust checks. If you trust the change, run `nvm firewall trust module <name>`. `nvm reshim` alone does not keep the module trusted after the next self-update. A notification timeout prints a no-answer message and posts a silent desktop notification. |
| **NVM4307** | Auto-install prompt failed | Shim could not read the yes/no prompt before `nvm install`. Run `nvm install <version>` |
| **NVM4308** | Auto-install could not find nvm.exe | Shim searched `NVM_HOME`, the shim directory, and `%LOCALAPPDATA%\Author Software\nvm`. Set `NVM_HOME` to the folder that contains `nvm.exe` |
| **NVM4309** | Auto-install could not start nvm.exe | `nvm.exe` was found, but the process did not start. The message includes that path |
| **NVM4310** | Auto-install command failed | `nvm install <version>` exited with a non-zero code. The message includes that code. Output from `nvm.exe` is still shown |
| **NVM4311** | Auto-install did not leave a usable Node.js | `nvm install` returned success, but the shim still cannot resolve that version |
| **NVM4312** | Verify signing key did not open | Script signing could not open NCrypt key `AuthorSoftware.NVM.VerifyCache` after 4 attempts. Common cause: security software locks `ncrypt` or `%APPDATA%\Microsoft\Crypto\Keys` during `npm upgrade -g`. When Windows Security Center reports a product, the message names it as installed and does not claim that product blocked the call. `nvm env` shows the same name under My Computer as Antivirus, or `Not Detected` when no antivirus data is available. When `pubkey.cer` is present, the message says the key was not deleted. Run `nvm reshim` again. If the error remains, allow `nvm.exe` and `reshim.exe` to use the Microsoft Software Key Storage Provider and that key container. Certified Builds write structured event `verify_key.open_failed` (Event ID 122) with `key_name`, `provider`, `status`, `attempts`, `pubkey_present`, `common_cause`, `resolution`, `user`, `sid`, `hostname`, and `correlation_id`. |
| **NVM4313** | Node.js storage path refused | `nvm config set root=` or the installer Node-storage page chose Windows, Program Files, ProgramData, a profile folder, the NVM program folder, a drive root (for example `C:\`), or a parent of those paths. Uninstall also skips deleting that path. Use a dedicated directory such as `%LOCALAPPDATA%\Author Software\nvm\installs` |
| **NVM4314** | `node.exe` FileVersion does not match the install folder | Full verify (cache miss) compared PE VERSIONINFO FileVersion to the folder core version (major.minor.patch). Example: Node 10 dropped into `v24.0.0`. Missing VERSIONINFO on an existing `node.exe` also fails. Reinstall with `nvm install <ver> --force` |
| **NVM4403** | Module firewall blocked install | Local policy deny for a package install. Certified Builds also write structured event `package_manager.install`. |
| **NVM4404** | Firewall elevation required | Mutating firewall command run without administrator rights |
| **NVM4405** | Invalid firewall rule | Malformed trust or module allow/deny entry |
| **NVM4406** | Untrusted module changed | Audit (non-error): untrusted global CLI entrypoint changed; logged for deny, allow, and prompt accept/decline |
| **NVM4408** | Module firewall allowed install | Audit (non-error), Certified Builds only: proxy evaluated module policy and allowed the install. Structured event `package_manager.install`. |
| **NVM4410** | Firewall policy mutated | Audit: `nvm firewall` changed a policy list |
| **NVM4411** | Version firewall blocked a Node.js version | Governance `VersionAllowList` / `VersionBlockList` denied `nvm install`, `nvm use`, or a shim launch. Without Governance those lists are ignored. Lifecycle aliases such as `EOL` do not trigger this on the client. |
| **NVM4412** | Package-manager lifecycle scripts blocked | Audit (non-error), Advanced Logging on Certified Builds only. HKLM `BlockPackageManagerLifecycleScripts` rewrote an install-class command (`install` / `ci` / `add` / …). `npm --version` and `npm run` do not write this event. EventName `package_manager.lifecycle_scripts_blocked`. Windows Event ID 120 |
| **NVM4501** | Network deadline exceeded | Informational: a catalog, mirror, reachability, or download attempt used up its millisecond budget. Structured event `network.deadline_exceeded` (Certified Builds with Advanced Logging) |
| **NVM4601** | Malware definitions updated | Informational, advanced logging only. A successful `malware.db` write changed the database. Payload: `added`, `removed`, `seq`, `previous_seq`. Windows Event ID 120 |
| **NVM4602** | Malicious package blocked | Informational, advanced logging only. The shim blocked a package before the install audit. Payload includes the package name, version when known, command, `source` (`OpenSSF` or `MalwareBlockList`), and `reason`. The terminal line is `NVM blocked <name> — <reason>. (NVM4602)`. It still prints without the advanced logging license. Windows Event ID 120 |

## Ranges

| Range | Role |
|:-|:-|
| **NVM41xx** | Installer / Community layout and support boundary |
| **NVM43xx** | Runtime Node trust, activation, auto-install, package-manager gatekeeping, and Node storage path |
| **NVM44xx** | NVM Firewall (version / module / trust policy) |
| **NVM45xx** | Network deadlines |
| **NVM46xx** | Malware feed. Informational and advanced logging only |

## Tips

- Codes appear in user-facing text as `Event code: NVM####` and may also be logged to the Windows Application log or NVM operational channels (edition-dependent). In `NVM for Windows/Operational`, query `EventData.Code` for the number without the `NVM` prefix. See [SIEM](../guide/siem).
- **NVM4304** is success/recovery telemetry, not a failure.
- **NVM4312** is a failure to open the verify signing key. A present public key means the key was not deleted. Run `nvm reshim` again. If it still fails, allow `nvm.exe` and `reshim.exe` through the security tool for the Microsoft Software Key Storage Provider. See [Antivirus](./antivirus). Certified Builds record `verify_key.open_failed` as Event ID 122.
- **NVM4406** is an audit/info event for untrusted-module changes (including when allow/prompt accepts the change), not a failure. Structured payload includes `path`, `before_digest` / `after_digest` (SHA-256 hex when available), and `before_size` / `after_size`.
- **NVM4408** is an audit/info event for a module-firewall allow path, not a failure.
- **NVM4102** through **NVM4115** mean setup stopped and rolled back. The limits are hang nets. A slow machine should finish before them. The setup window shows the code and the log path. You can submit a redacted report from that window. The report removes your user name, other profile names, your computer name, your domain, email addresses, proxy credentials, UNC server names, and machine SIDs.
- **NVM4412** is an audit/info event that the lifecycle-script lock was applied to an install-class command. It is not a failed install. Community Builds and Certified Builds without Advanced Logging do not write it.
- **NVM4501** is informational, not a failure. The plaintext error names `TimeoutCatalogMs` and `TimeoutCatalogMirrorMs` (or `TimeoutDownloadMs` / `TimeoutReachabilityMs`) and where that budget came from: `machine policy`, `machine settings`, `your settings`, `default`, or `command flag`.
- Structured execution and install audits may include `project_name`, `project_path`, `parent_process`, `parent_pid`, and `sid` when the host can resolve them. A missing value is empty or `unknown`.
- `nodejs.executed` is written on Community and Certified Builds when `LogExecutions` is `1`. No Advanced Logging license.
- `package_manager.executed` is written on Certified Builds when `LogExecutions` is `1`. No Advanced Logging license. `package_manager.install` records an allowed install (**NVM4408**) or a blocked install (**NVM4403**).
- Symptom-based fixes without a code: [General Troubleshooting](./general).
