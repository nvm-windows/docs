---
title: Air-gapped Installations
sidebar_position: 3
---

# Air-gapped Installations

This guide walks through installing Node.js with NVM for Windows when the target machine cannot or must not reach public download mirrors.

Feature background:

- [Local Installations](../features/local-installations) — `local_dir`/`local_install_only`
- [Download Cache](../features/cache) — `.cache/versions` and `nvm cache add`

## Choose a pattern

| Pattern | Best for | How |
|---------|----------|-----|
| **Prefetch into default cache** | One laptop/few machines | `nvm cache add` on a connected host, copy `%LOCALAPPDATA%\Author Software\nvm\.cache\versions` |
| **Shared `local_dir`** | Labs, fleets, USB/internal shares | Point every offline host at the same archive folder and set `local_install_only=true` |
| **Policy-locked local source** | Certified/Governance fleets | Set `LocalInstallDir` + `LocalInstallOnly` via [registry policy](../cfg/registry) or ADMX |

For more than a few people, prefer a shared `local_dir` (or policy) over copying personal cache folders.

## 1. Prefetch archives (connected host)

On a machine with network access:

```powershell
nvm cache add 24 22 lts
nvm cache list versions
```

Archives land under:

`%LOCALAPPDATA%\Author Software\nvm\.cache\versions\`

as `node-v{version}-win-{x64|arm64}.7z`. Optionally keep matching `SHASUMS256-v{version}-win-{arch}.txt` files beside each archive for offline integrity checks.

You can also download the Windows `.7z` (and SHASUM) files manually from your approved Node.js mirror and place them in the same layout.

## 2. Move content offline

Copy the archive folder to:

- USB/encrypted media
- Internal file share
- SCCM/Intune/other content distribution

Example layout on the share:

```text
\\files\software\node-archives\
  node-v24.11.0-win-x64.7z
  SHASUMS256-v24.11.0-win-x64.txt
  node-v22.20.0-win-x64.7z
  SHASUMS256-v22.20.0-win-x64.txt
```

Use the architecture that matches the offline machines (`x64` or `arm64`).

## 3. Configure the offline host

### Option A — shared folder (`local_dir`)

```powershell
nvm config set local_dir=\\files\software\node-archives
nvm config set local_install_only=true
nvm config get local_dir local_install_only
```

`local_dir` replaces the default version cache as the install source. With `local_install_only=true`, a missing archive fails instead of downloading.

### Option B — copy into the default cache

Copy archives into:

`%LOCALAPPDATA%\Author Software\nvm\.cache\versions\`

Then still set `local_install_only=true` if you must block network fallback (without `local_dir`, installs look in that default cache first).

### Option C — machine policy (certified)

Set registry/ADMX:

- `LocalInstallDir` → archive root
- `LocalInstallOnly` → `1`

See [registry policy reference](../cfg/registry). Policy can also treat archives under that root as a trusted local integrity source when both keys are set.

## 4. Install

```powershell
nvm install 24.11.0
nvm use 24.11.0
node -v
```

Expected path: find archive → integrity check → extract. If the archive is missing and local-only is on, install stops with `not found in local install directory`.

## 5. Refresh versions later

Repeat prefetch on a connected host when new Node releases are approved, update the share or media, then run `nvm install` again on offline hosts. No change to `local_dir` is required if the folder path stays the same.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| `not found in local install directory` | Exact version string; archive name `node-v…-win-….7z`; arch matches OS; `local_dir` path reachable |
| Integrity/SHASUM failure | Corrupt copy; missing or wrong SHASUM sidecar; re-copy from connected host |
| Still tries network | Confirm `local_install_only=true` (or policy `LocalInstallOnly=1`) |
| Works on one PC, not another | Arch mismatch (`x64` vs `arm64`); different `local_dir`; policy override |

## Related

- [Local Installations](../features/local-installations)
- [Download Cache](../features/cache)
- [`nvm install`](../command/install/)
- [`nvm cache`](../command/cache/)
- [Registry policy](../cfg/registry)

:::info[`air_gapped` preference]
`air_gapped` controls offline license/JWKS behavior for Author mirrors. It does **not** point Node installs at a local archive folder. Use `local_dir`/`local_install_only` (or the steps above) for that.
:::
