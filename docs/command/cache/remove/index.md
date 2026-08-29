---
title: remove
sidebar_position: 3
---

# nvm cache remove

Remove cached artifacts.

**Alias:** `rm`

## Subcommands

| Subcommand | Description |
|------------|-------------|
| [`version`](./version) | Remove cached Node.js archives (default). |
| [`metadata`](./metadata) | Remove cached metadata files. |
| [`all`](./all) | Clear metadata and versions caches. |

## Notes

Removal can be blocked when [`allow_download_cache_removal=false`](../../../cfg/core#downloads-and-mirrors).
