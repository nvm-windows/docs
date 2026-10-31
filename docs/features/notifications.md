---
title: Windows Desktop Notifications
sidebar_position: 5
tags: [native-integration]
---

import DocImage from '@site/docs/_components/DocImage';

# Windows Desktop Notifications

NVM for Windows uses the native Windows Notification Center.
You see important work without watching a terminal.
Missed notifications stay in Notification Center until you clear them.
Windows respects your Focus Assist and per-app notification settings.

<div align="center">
<DocImage
	src="/img/features/native/native-notifications.png"
	alt="Windows Notification Center"
	style={{maxWidth: '980px'}}
/>
</div>

## Why notifications matter

Desktop notifications close the gap between a background sync task and a decision you must make.

- You learn that a new NVM for Windows build is ready while you work elsewhere.
- You can open the release notes or start the upgrade from the notification. You do not need to recall a command.
- You see malware blocks and untrusted-module prompts when the console is not in front of you.
- Certified Builds warn you before a sitewide license expires.

CLI notifications for install, `nvm use`, and config changes also appear when another process or agent runs NVM and your terminal is not focused.

## Channels

Windows registers four notification **collections** under **NVM for Windows**.
Each collection is a muteable channel in Settings.

| Channel (Settings name) | Collection ID | Events |
|-------------------------|---------------|--------|
| **Releases** | `nvm.releases` | Stable product updates (`x.y.z`) |
| **Hotfixes** | `nvm.hotfixes` | Hotfix builds (`x.y.z-hotfix.N`) for the installed major.minor.patch |
| **Pre-releases** | `nvm.prereleases` | Alpha, beta, rc, and other hyphenated product versions |
| **News** | `nvm.news` | Project news feed entries |

Security, firewall, license, malware, setup, and activity notifications use the **default** notifier.
They have no collection.
Windows cannot mute those types one by one.
The app master Off, Focus Assist, and GPO still apply.

Sparse identity (an identity-only `.msix` registered per user, no extra UAC) makes the four collections appear.
If registration fails (sideload GPO, missing package), notifications still fire through the AUMID `AuthorSoftware.NVMWindows`.

## Mute and unmute

### Per channel (Windows Settings)

1. Open **Settings → System → Notifications → NVM for Windows**.
1. Turn a channel Off or On: **Releases**, **Hotfixes**, **Pre-releases**, or **News**.

You can also mute one channel from the ellipsis on a notification.
Unmute from the same Settings page.
`nvm config` cannot clear an OS mute.

### By configuration

| Goal | How |
|------|-----|
| Stop news and product-update notifications | `nvm config set disable_announcements=true` |
| Stop malware-definition notifications (Certified Builds) | Click **Don't show again** on that notification, or `nvm config set notify_malware_definitions=false` |
| Turn announcements back on | `nvm config set disable_announcements=false` |
| Turn malware-definition notifications back on | `nvm config set notify_malware_definitions=true` |

[`disable_announcements`](../cfg/core#logging-and-announcements) skips news and release / pre-release / hotfix notifications only.
It does **not** suppress license expiry, malware blocks, firewall prompts, or malware-definition notices.
HKLM policy can force `DisableAnnouncements` and `NotifyMalwareDefinitions`. See [Registry Policy Reference](../cfg/registry).

## Actions and automations

Many notifications include buttons.
A button runs a protocol or opens a URL.
You do not need to switch to a terminal first.

| Button | Channel / notification | What it does |
|--------|-----------------|--------------|
| **View** | Releases, Hotfixes, Pre-releases | Opens the release page in your browser |
| **Update** | Releases | Starts `nvm://upgrade?version=…`. NVM upgrades to that version with `--force` (no console prompt). Omitted when [`disable_upgrade`](../cfg/registry) is on |
| **Install** | Pre-releases | Same upgrade protocol for a pre-release build. Omitted when `disable_upgrade` is on |
| **Apply** | Hotfixes | Same upgrade protocol for a hotfix on your current major.minor.patch. Omitted when `disable_upgrade` is on |
| **Read** | News | Opens the news entry URL |
| **Trust** / **Cancel** | NVM Firewall (untrusted module) | Accepts or declines trust for a self-updated global CLI |
| **Don't show again** | Malware definitions (Certified Builds) | Sets `notify_malware_definitions` to `false` |
| **Open Developer Settings** | Symlink help | Opens `ms-settings:developers` |

Machine policy can block in-app upgrades with [`disable_upgrade`](../cfg/registry).
When that key is on, the notification omits **Update** / **Install** / **Apply**. **View** still opens the release page.

## When notifications appear

Most CLI notifications display **only when NVM is not already in the foreground**.
If you run `nvm` in an interactive terminal and that window has focus, those notifications are skipped so the UI does not interrupt work you are already watching.

Background cases that still notify include:

- Long-running installs started from another context
- Scheduled sync and update checks (`sync.exe`)
- License expiry reminders (Certified Builds)

## CLI notifications

These use Notification Center when the NVM process is **not** in the foreground:

| Trigger | Title | Message (approx.) |
|--------|--------|-------------------|
| Install finished | _(empty)_ or failure title | Node.js vX installed / Node.js vX Installation Failed (plus error text) |
| `nvm use` (default switch) | _(empty)_ | Now using Node.js vX by default. |
| `nvm uninstall` | _(empty)_ | Joined status lines (uninstalled, skipped, active switch, cache purge, and similar) |
| `nvm config set` | _(empty)_ | key set to value |
| `nvm alias add` | _(empty)_ | "&lt;name&gt;" now refers to vX.X.X |
| `nvm alias remove` | _(empty)_ | &lt;count&gt; alias(es) removed successfully. |
| `nvm pin` | _(empty)_ | Success text for `.nvmrc` / `package.json` engines updates |
| Symlink failure (Developer Mode off) | Help Enabling Symlinks | Button: **Open Developer Settings** |

## Sync and security notifications

Scheduled maintenance and security paths also display notifications:

| Trigger | Channel | Title | Notes |
|--------|---------|--------|--------|
| News feed | News | Feed entry title | Body is the entry description. Button: **Read**. Skipped when [`disable_announcements`](../cfg/core#logging-and-announcements) is true |
| Update available | Releases | Update Available or vX.X.X now Available | No summary: title is Update Available and the body says a new version is available. With a release summary: title is `vX.X.X now Available` and the body is that summary. Buttons: **View** and **Update**. Skipped when `disable_announcements` is true |
| Pre-release available | Pre-releases | Update Available or vX.X.X now Available | Same title and body rules. Buttons: **View** and **Install**. Skipped when `disable_announcements` is true |
| Hotfix available | Hotfixes | Update Available or vX.X.X now Available | Same title and body rules. Only for a hotfix on the installed major.minor.patch. A summary is required when you cut the hotfix. Buttons: **View** and **Apply**. Skipped when `disable_announcements` is true |
| License expiry<br/>_(Certified Builds)_ | _(default)_ | NVM for Windows license expires in … / expired | Not suppressed by `disable_announcements`. At most one notification per milestone or day |
| Malware definitions<br/>_(Certified Builds)_ | _(default)_ | Malware definitions updated | Silent. Body is the added and removed counts. **Don't show again** sets `notify_malware_definitions` to false. Not suppressed by `disable_announcements` |
| Malware block, console in the background | _(default)_ | Malicious package blocked | Audible (`Notification.Reminder`). Names at most three packages, then `and N more`. Not suppressed by `disable_announcements`. On a Community Build joined to Active Directory, Entra, or Google Workspace, the body adds: `Certified keeps a record of blocks like this for your security tools.` |
| Untrusted module (notification path) | _(default)_ | NVM Firewall | Buttons: **Trust** / **Cancel**. Used when the terminal is not in the foreground |

## Related

- [Basic Configuration](../cfg/core#logging-and-announcements) — `disable_announcements`, `notify_malware_definitions`
- [Registry Policy Reference](../cfg/registry) — HKLM `DisableAnnouncements`, `NotifyMalwareDefinitions`, `DisableUpgrade`
- [Malicious Package Blocker](./malicious-package-blocker) — block notifications and definition notices
- [NVM Firewall](./firewall) — Trust / Cancel prompts
