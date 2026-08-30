---
title: Windows Registry Integration
sidebar_position: 6
tags: [native-integration]
---

As of v2.0.0, settings and preferences are stored in the registry under user keys. These can be modified with the [`nvm config`](../command/config) command. See [Basic Configuration](../cfg/core) for the full preference list.

:::info[Attention v1 Users]
Prior versions of NVM for Windows utilized a plain text `settings.txt` file. Some users experienced difficulties using special characters. This was caused by encoding type problems in older versions of Go. Windows handles locale encoding natively in the registry, eliminating this problem.
:::

On certified fleets, machine policy can override user preferences. See [Administrative Templates](../cfg/ad) and the [registry policy reference](../cfg/registry).
