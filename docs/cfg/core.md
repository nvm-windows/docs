# Basic Configuration

User preferences live in the Windows registry. Manage them with [`nvm config`](../command/config) (alias: `nvm cfg`).

```powershell
nvm config list
nvm config get mode auto_use
nvm config set auto_install=true
nvm config reset auto_install
nvm config docs
```

On certified fleets, machine policy can override these values. See [Administrative Templates](ad) and the [registry policy reference](registry).

:::tip[Live docs]
`nvm config docs` (or `nvm cfg docs`) prints the same help text the CLI ships with. Prefer that when this page and your install disagree. Use `nvm config docs --json` for machine-readable metadata.
:::

## Value types

| Type | Accepted values |
|------|-----------------|
| Boolean | `true`, `false`, `1`, `0` |
| List | Comma-delimited strings |
| Enum | Only values listed for that option |

## Mode and install location

| Option | Default | Values | Description |
|--------|---------|--------|-------------|
| `mode` | `shim` | `shim`, `link` | Specifies how Node.js commands and versions are managed, either through shim-based routing or direct junction/symlink linking. Same as `nvm use shim`/`nvm use link`. See [Operating Modes](../features/modes). |
| `root` | `%LOCALAPPDATA%\Author Software\nvm\installs` | Directory path | Root directory where Node.js versions are installed. Changing this does not move existing installs; migrate files yourself or reinstall versions. |

## Downloads and mirrors

| Option | Default | Values | Description |
|--------|---------|--------|-------------|
| `node_mirror` | `https://nodejs.org/dist` | One or more URLs (comma-delimited) | Mirror URL(s) for downloading Node.js. Accepts a comma-delimited list. |
| `npm_mirror` | `https://registry.npmjs.org` | One or more URLs (comma-delimited) | Mirror URL(s) for downloading npm. Accepts a comma-delimited list. |
| `cache_downloads` | `false` | Boolean | Whether to cache downloaded files for offline use. |
| `allow_download_cache_removal` | `true` | Boolean | Allow removing cached downloads. |
| `allow_insecure_downloads` | `false` | Boolean | Allow expired/invalid SSL certificates when downloading assets. |
| `auto_installed_modules` | _(none)_ | Comma-delimited npm package names | Comma-delimited list of global npm modules to automatically install with new Node.js versions. |

```powershell
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set cache_downloads=true
nvm config set auto_installed_modules=typescript,prettier
```

Proxy keys (`proxy`, `proxy_auth`, `proxy_auth_type`) are hidden from everyday `cfg docs` output. On certified builds they are usually set by policy — see [registry reference](registry).

## Project detection and auto behavior

These options apply primarily in **shim** mode (and related `nvm rc` workflows).

| Option | Default | Values | Description |
|--------|---------|--------|-------------|
| `auto_detect` | `.nvmrc,.node-version,package.json` | Comma-delimited filenames | Project files to inspect for version (shim-only). |
| `default_detect_file` | `.nvmrc` | Filename | The default file to write to when saving/pinning a version to a project. |
| `auto_use` | `true` | Boolean | Automatically switch to auto-detected version to run the specified scripts without modifying the system version (shim-only). |
| `auto_install` | `false` | Boolean | Automatically install missing auto-detected version (rc/shim-only). |
| `auto_install_prompt` | `true` | Boolean | Prompt before automatically installing missing auto-detected version (rc/shim-only). |

```powershell
nvm config set auto_install=true auto_install_prompt=false
nvm config set auto_detect=.nvmrc,.node-version
```

## Package managers

| Option | Default | Values | Description |
|--------|---------|--------|-------------|
| `pm_mismatch_action` | `error` | `ignore`, `warn`, `error` | Action to take when a mismatch between npm and Node.js versions is detected during install or use: ignore, warn, or error. |

- `error` — stop the operation (safest default)
- `warn` — continue after a warning
- `ignore` — stay silent

## Logging and announcements

| Option | Default | Values | Description |
|--------|---------|--------|-------------|
| `log_executions` | `false` | Boolean | Whether to log every Node.js invocation (ex: `node file.js`). (shim-only) |
| `disable_announcements` | `false` | Boolean | Whether to disable project and release announcements. License expiry warnings still run. |

```powershell
nvm config set log_executions=true
nvm config set disable_announcements=true
```

:::tip[See also]
OS-level install and symlink privileges are separate. See [Permissions](../permissions).
:::

## Related settings

_(not listed in `cfg docs`)_

| Topic | Where |
|-------|--------|
| Version aliases (`stable=24.x`, etc.) | Prefer [`nvm alias`](../command/alias); values are stored as `aliases` |
| Turn version management on/off | [`nvm on`](../command/on)/[`nvm off`](../command/off) (writes `enabled`) |
| Active/last version | Managed by [`nvm use`](../command/use) (`active_version`, `last_version`) |
| Shim security/V8 flags | [Registry reference](registry) (`EnforcePermissionModel`, `FreezeV8GlobalObjects`, `DisableEvalAndStringExecution`) |
| Enterprise locks (mirrors, version allow/block lists, proxies) | [Administrative Templates](ad) and [registry policies](registry) |

```powershell
nvm config docs
nvm config docs --json
```
