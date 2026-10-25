---
title: Desktop Notifications
sidebar_position: 5
tags: [native-integration]
---

import DocImage from '@site/docs/_components/DocImage';

NVM for Windows uses native desktop notifications with the Windows Notification Center. Missed notifications stay in the Notification Center until acknowledged. Personal notification preferences are honored.

<div align="center">
<DocImage
	src="/img/features/native/native-notifications.png"
	alt="Windows Notification Center"
	style={{maxWidth: '980px'}}
/>
</div>

## When notifications appear

Most CLI notifications display **only when NVM is not already in the foreground** (ex: background agent). If you run `nvm` in an interactive terminal and that window has focus, those notifications are skipped so the UI does not interrupt work you are already watching.

Background cases that still notify include:

- Long-running installs started from another context
- Scheduled sync/update checks (`sync.exe`)
- License expiry reminders (certified editions)

News and updates can be turned off with [`disable_announcements`](../cfg/core#logging-and-announcements). License expiry notifications are **not** suppressed by that setting.

## Categories (Windows Settings)

Release, hotfix, pre-release, and news toasts are registered as Windows toast collections. Mute one type from the toast ellipsis or **Settings → System → Notifications → NVM for Windows**. Unmute from the same Settings page. `nvm config` cannot flip an OS mute.

| Collection | What it covers | Default |
|------------|----------------|---------|
| Releases | General product versions (`x.y.z`) | On |
| Hotfixes | Hotfix product versions (`x.y.z-hotfix.N`) on the same major.minor.patch as the installed NVM | On |
| Pre-releases | Alpha, beta, rc, and other hyphenated product versions | On |
| News | Project news feed | On |

Security, firewall, license, setup, and activity toasts have **no** collection. They stay on the default notifier so Windows has no per-type mute. Master Off for NVM, Focus Assist, and GPO still apply.

Sparse identity (an identity-only `.msix` registered per-user, no extra UAC) is what makes collections appear. If registration fails (sideload GPO, missing package), toasts still fire through the AUMID.

## CLI notifications

These use Notification Center when the NVM process is **not** in the foreground:

| Trigger | Title | Message (approx.) |
|--------|--------|-------------------|
| Install finished | _(empty)_ or failure title | Node.js vX installed/Node.js vX Installation Failed (plus error text) |
| `nvm use` (default switch) | _(empty)_ | Now using Node.js vX by default. |
| `nvm uninstall` | _(empty)_ | Joined status lines (uninstalled, skipped, active switch, cache purge, and similar) |
| `nvm config set` | _(empty)_ | key set to value |
| `nvm alias add` | _(empty)_ | "&lt;name&gt;" now refers to vX.X.X |
| `nvm alias remove` | _(empty)_ | &lt;count&gt; alias(es) removed successfully. |
| `nvm pin` | _(empty)_ | Success text for `.nvmrc`/`package.json` engines updates |
| Symlink failure (Developer Mode off) | Help Enabling Symlinks |

## Sync notifications

Scheduled maintenance can also display notifications:

| Trigger | Title | Notes |
|--------|--------|--------|
| News feed | Feed entry title | Body is the entry description with links; skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| Update available | Update Available or vX.X.X now Available | No summary: title is Update Available and the body says a new version is available. With a release summary: title is `vX.X.X now Available` and the body is that summary. Buttons: View and **Update**. Skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| Pre-release available | Update Available or vX.X.X now Available | Same title and body rules. Pre-releases collection. Buttons: View and **Install**. Skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| Hotfix available | Update Available or vX.X.X now Available | Same title and body rules. Hotfixes collection. Only for a hotfix on the installed major.minor.patch. A summary is required when you cut the hotfix. Buttons: View and **Apply**. Skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| License expiry<br/>_(certified builds)_ | Expiration warning | Not suppressed by [`disable_announcements`](../cfg/core#logging-and-announcements); at most one notification per milestone/day. |
| Malware definitions<br/>_(certified builds)_ | Malware definitions updated | Silent. Body is the added and removed counts. **Don't show again** sets `notify_malware_definitions` to false. Not suppressed by [`disable_announcements`](../cfg/core#logging-and-announcements). |
| Malware block, console in the background | Malicious package blocked | Audible (`Notification.Reminder`). Names at most three packages, then `and N more`. Not suppressed by [`disable_announcements`](../cfg/core#logging-and-announcements). On a community build joined to Active Directory, Entra, or Google Workspace, the body adds: `Certified keeps a record of blocks like this for your security tools.` |
