---
title: Download Cache
sidebar_position: 99
---

NVM for Windows can keep downloaded Node.js archives on disk so later installs skip the network when a matching archive is already present. Manage that store with [`nvm cache`](../command/cache/), or turn automatic saving on with [`cache_downloads`](../cfg/core#downloads-and-mirrors).

Caching helps when:

- **Reinstalling often**: wipe/reinstall the same Node version without re-downloading.
- **Flaky or metered networks**: keep a local copy so installs still work after a bad mirror or offline stretch
- **Fleet/lab prep**: `nvm cache add` once, copy archives (or a shared `local_dir`) to other machines
- **Air-gapped installs**: prefetch on a connected host, then install offline ([Air-gapped Installations](../guide/air-gapped-installations))

:::info[Local installations]
Caching can cover a simple offline laptop. For teams and shared archives, prefer [Local Installations](./local-installations) and the [Air-gapped Installations](../guide/air-gapped-installations) guide.
:::

By default **`cache_downloads` is `false`**: a normal `nvm install` will **reuse** a cached archive if one exists, but will **not** write a new archive unless you pass `--cache` or enable the preference.

```powershell
nvm install 24 --cache
nvm install 24.11.0   # reuses the cached archive when present
```

## Where files live

Under the NVM data root (parent of the install root; default `%LOCALAPPDATA%\Author Software\nvm`):

| Store | Path | Contents |
|-------|------|----------|
| Versions | `.cache/versions` | Node.js `.7z` archives (`node-v{version}-win-{x64\|arm64}.7z`) |
| Metadata | `.cache/metadata` | Sync/release index metadata (not install archives) |
| HTTP | `.cache/http` | Short-lived HTTP bodies (for example SHASUM fetches) |

If `local_dir` is set (see [registry policy](../cfg/registry)), that directory **replaces** `.cache/versions` as the archive source for installs.

## Install behavior

| Flag/setting | Effect |
|----------------|--------|
| [`nvm install --cache`](../command/install/) | Download (if needed) and **save** the archive |
| [`nvm install --no-cache`](../command/install/) | Do not use or write the default version cache |
| [`cache_downloads=true`](../cfg/core#downloads-and-mirrors) | Always save successful downloads (unless `--no-cache`) |
| [`nvm cache add`](../command/cache/add) | Download and cache **without** installing |
| [`local_install_only`](../cfg/registry) | No network: install only from `local_dir`/cache hit |

Integrity on a cache hit is checked before reuse (local SHASUM beside the archive when present, download verify-cache, or live mirror SHASUM when online). A bad archive is removed and the install continues as a miss when network is allowed.

## Managing the cache

```powershell
nvm cache                  # list (alias: nvm cache list/ls)
nvm cache add 24 lts       # prefetch archives
nvm cache remove version 24.1.0
nvm cache remove metadata
nvm cache remove all
nvm list cached            # versions view of cached archives
```

[`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors) (default `true`) controls whether cache deletes are allowed. Policy can set it to `false`; removals then report that they are blocked.

Uninstall with `--purge` can also drop the matching cached archive for that version.

## Related

- [Air-gapped Installations](../guide/air-gapped-installations) — step-by-step offline workflow
- [Local Installations](./local-installations)
- Command reference: [`nvm cache`](../command/cache/)
- Preferences: [`cache_downloads`](../cfg/core#downloads-and-mirrors), [`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors)
- Policy: [`LocalInstallDir`/`LocalInstallOnly`](../cfg/registry)
