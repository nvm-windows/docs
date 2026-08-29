---
title: Local Installations
sidebar_position: 98
---

Local installations let NVM for Windows install Node.js from archives already on disk instead of (or before) contacting a download mirror. Use this for air-gapped hosts, shared lab mirrors, or any environment where outbound downloads are blocked or undesirable.

This differs from the ordinary [download cache](./cache): [`local_dir`](../cfg/registry#available-registry-keys) **replaces** `.cache/versions` as the archive root for installs. With [`local_install_only`](../cfg/registry#available-registry-keys), a miss never falls back to the network.

## Settings

| Option | Registry | Default | Effect |
|--------|----------|---------|--------|
| [`local_dir`](../cfg/registry#available-registry-keys) | `LocalInstallDir` | _(unset)_ | Directory of Node.js `.7z` archives used as the install source |
| [`local_install_only`](../cfg/registry#available-registry-keys) | `LocalInstallOnly` | `false` | Install only from that local source; fail if the archive is missing |

Both are overridable preferences (often set by [machine policy](../cfg/registry) on certified fleets). They are hidden from everyday `nvm config docs` output, but still work with `nvm config`:

```powershell
nvm config set local_dir=D:\node-archives
nvm config set local_install_only=true
nvm config get local_dir local_install_only
```

:::tip[Policy]
Enterprise deployments usually lock these under Administrative Templates / registry policy so every machine shares the same archive share. See [`LocalInstallDir` / `LocalInstallOnly`](../cfg/registry).
:::

## Archive layout

Place official Windows Node.js archives in [`local_dir`](../cfg/registry#available-registry-keys) (or the default version cache if you are not using [`local_dir`](../cfg/registry#available-registry-keys)):

```text
D:\node-archives\
  node-v24.11.0-win-x64.7z
  SHASUMS256-v24.11.0-win-x64.txt   # optional but recommended offline
  node-v22.20.0-win-x64.7z
  SHASUMS256-v22.20.0-win-x64.txt
```

- Archive name: `node-v{version}-win-{x64|arm64}.7z` (arch matches the machine).
- Optional SHASUM file beside the archive: `SHASUMS256-v{version}-win-{arch}.txt`.

On a connected machine you can populate a folder with [`nvm cache add`](../command/cache/add) and copy `.cache/versions` (or set that path as [`local_dir`](../cfg/registry#available-registry-keys) on the offline host).

## Install flow

```powershell
nvm install 24.11.0
```

1. Look for `node-v24.11.0-win-*.7z` under [`local_dir`](../cfg/registry#available-registry-keys) (or `.cache/versions` when [`local_dir`](../cfg/registry#available-registry-keys) is unset).
2. Run integrity checks (verify-cache, local SHASUM, trusted policy path, or live mirror SHASUM when online).
3. If found and valid → extract and install.
4. If missing and **[`local_install_only=true`](../cfg/registry#available-registry-keys)** → fail with `not found in local install directory` (no download).
5. If missing and local-only is off → download from configured mirrors as usual.

Machine policy with **both** `LocalInstallOnly` and `LocalInstallDir` set treats archives under that directory as a trusted local source for integrity when offline (archives still must sit under the configured root).

For end-to-end offline steps (prefetch → media/share → configure → install), see [Air-gapped Installations](../guide/air-gapped-installations).

## Related

- [Air-gapped Installations](../guide/air-gapped-installations) — step-by-step offline workflow
- [Download Cache](./cache) — default `.cache/versions` store and `--cache` / [`cache_downloads`](../cfg/core#downloads-and-mirrors)
- [`nvm install`](../command/install/) — install flags and local-source notes
- [Registry policy](../cfg/registry) — `LocalInstallDir`, `LocalInstallOnly`

:::info[`air_gapped`]
The separate [`air_gapped`](../cfg/registry#available-registry-keys) preference controls offline license/JWKS behavior for Author mirrors. It does **not** by itself redirect Node.js installs to a local archive folder — use [`local_dir`](../cfg/registry#available-registry-keys) / [`local_install_only`](../cfg/registry#available-registry-keys) for that.
:::
