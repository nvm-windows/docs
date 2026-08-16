# Core Configuration

User preferences for NVM for Windows live in the Windows registry and are managed with [`nvm config`](../command/config) (alias: `nvm cfg`).

```powershell
nvm config list
nvm config get mode auto_use
nvm config set auto_install=true
nvm config reset auto_install
nvm config docs
```

| Type | Accepted values |
|------|-----------------|
| Boolean | `true`, `false`, `1`, `0` |
| List | Comma-delimited strings |
| Enum | Only values listed for that option |

On certified fleets, machine policy can override these values. See [Active Directory](ad) and the [registry policy reference](../guide/deploy/policy/registry).

---

## Operating mode and install location

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `mode` | `shim` | `shim`, `link` | How Node.js is resolved on PATH. **Shim** (recommended) intercepts `node`/`npm`/etc. and enables auto-detect, auto-install, and shim security options. **Link** uses junctions/symlinks with near-zero latency but fewer features. Same effect as `nvm use shim` / `nvm use link`. See [Operating Modes](../features/modes). |
| `root` | `%LOCALAPPDATA%\Author Software\nvm\installs` | Directory path | Where Node.js versions are stored. Changing this does not move existing installs; migrate files yourself or reinstall versions. |

---

## Downloads and mirrors

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `node_mirror` | `https://nodejs.org/dist` | One or more URLs (comma-delimited) | Where Node.js archives are downloaded. First successful mirror wins. |
| `npm_mirror` | `https://registry.npmjs.org` | One or more URLs (comma-delimited) | npm registry / npm tarball mirrors. |
| `cache_downloads` | `false` | Boolean | Keep downloaded installers for offline reuse. |
| `allow_download_cache_removal` | `true` | Boolean | Allow `nvm cache remove` to delete cached downloads. Set `false` to lock the cache. |
| `allow_insecure_downloads` | `false` | Boolean | Allow downloads when TLS certificates are expired or invalid. Leave off unless you control a broken corporate MITM proxy and understand the risk. |
| `auto_installed_modules` | _(empty)_ | Comma-delimited npm package names | Global modules installed automatically whenever a new Node.js version is installed (for example `typescript,eslint`). |

```powershell
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set cache_downloads=true
nvm config set auto_installed_modules=typescript,prettier
```

Proxy settings (`proxy`, `proxy_auth`, `proxy_auth_type`) exist for restricted networks. They are normally set by policy on certified builds; ask your admin if downloads fail behind a corporate proxy.

---

## Project detection and auto behavior

These options apply primarily in **shim** mode (and related `nvm rc` workflows).

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `auto_detect` | `.nvmrc,.node-version,package.json` | Comma-delimited filenames | Project files scanned (in order) to pick a Node.js version for the current directory. |
| `default_detect_file` | `.nvmrc` | Filename | File written when you pin a version with `nvm rc`. |
| `auto_use` | `true` | Boolean | When a project file names a version, use that version for commands without changing your global default. |
| `auto_install` | `false` | Boolean | If the detected version is missing, install it automatically. |
| `auto_install_prompt` | `true` | Boolean | Ask before auto-installing when `auto_install` is on. Set `false` for fully silent auto-install. |

```powershell
nvm config set auto_install=true auto_install_prompt=false
nvm config set auto_detect=.nvmrc,.node-version
```

---

## Package managers

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `pm_mismatch_action` | `error` | `ignore`, `warn`, `error` | What to do when the active package manager (npm/pnpm/yarn) does not match the expectations for the selected Node.js version during install or use. |

- `error` — stop the operation (safest default)
- `warn` — continue after a warning
- `ignore` — stay silent

---

## Shim security and audit logging

These options only take effect in **shim** mode. They inject Node.js runtime flags (or logging) when `node` is launched through the shim. They do **not** apply in link mode.

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `log_executions` | `false` | Boolean | Log every Node.js invocation (for example `node app.js`) to the Windows Event Log. |
| `enforce_permission_model` | `false` | Boolean | Start Node with the permission model (`--permission` or `--experimental-permission`, depending on Node major). Default-deny filesystem/network access unless the process passes `--allow-*` flags. |
| `freeze_v8_global_objects` | `false` | Boolean | Start Node with `--frozen-intrinsics` so built-in prototypes cannot be patched. Adds measurable startup cost. Requires Node.js 12+. |
| `disable_eval_and_string_execution` | `false` | Boolean | Start Node with `--disallow-code-generation-from-strings`, blocking `eval()` and `new Function()`. |

```powershell
nvm config set log_executions=true
nvm config set enforce_permission_model=true
```

:::tip[See also]
OS-level install and symlink privileges are separate from these Node flags. See [Permissions](../permissions).
:::

---

## Notifications

| Option | Default | Values | What it does |
|--------|---------|--------|--------------|
| `disable_announcements` | `false` | Boolean | Hide project and release announcements. License expiry notices (certified) still run. |

---

## Related settings (not listed here)

| Topic | Where |
|-------|--------|
| Version aliases (`stable=24.x`, etc.) | Prefer `nvm alias` / upcoming [Aliases](aliases) docs; values are stored as `aliases` |
| Turn version management on/off | `nvm on` / `nvm off` (writes `enabled`) |
| Machine licensing | `nvm license` (not `nvm config set`) |
| Active / last version | Managed by `nvm use` (`active_version`, `last_version`) |
| Enterprise locks (mirrors, version allow/block lists, proxies) | [Active Directory](ad) and [registry policies](../guide/deploy/policy/registry) |

For the live list of documented keys on your install:

```powershell
nvm config docs
nvm config docs --json
```
