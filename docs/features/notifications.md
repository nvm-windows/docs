---
title: Desktop Notifications
sidebar_position: 7
tags: [native-integration]
---

NVM for Windows uses native desktop notifications with the Windows Notification Center. Missed notifications stay in the Notification Center until acknowledged. Personal notification preferences are honored.

<img
	src="/img/features/native/1776541489737.png"
	alt="Windows Notification Center"
	style={{width: '40%', maxWidth: '480px'}}
/>

## When notifications appear

Most CLI notifications display **only when NVM is not already in the foreground** (ex: background agent). If you run `nvm` in an interactive terminal and that window has focus, those notifications are skipped so the UI does not interrupt work you are already watching.

Background cases that still notify include:

- Long-running installs started from another context
- Scheduled sync/update checks (`sync.exe`)
- License expiry reminders (certified editions)

News and updates can be turned off with [`disable_announcements`](../cfg/core#logging-and-announcements). License expiry notifications are **not** suppressed by that setting.

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
| Update available | Update Available | Version availability with View/Upgrade links; skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| License expiry<br/>_(certified builds)_ | Expiration warning | Not suppressed by [`disable_announcements`](../cfg/core#logging-and-announcements); at most one notification per milestone/day. |
