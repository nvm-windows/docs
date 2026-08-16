# Active Directory Configuration

Certified builds can lock settings with **machine policy** (ADMX/GPO or Intune administrative templates). Policy always wins over user preferences from [`nvm config`](../command/config).

| Layer | Location |
|-------|----------|
| Enforced policy | `HKLM\SOFTWARE\Policies\Author Software\nvm` |
| User preferences | `HKCU\SOFTWARE\Author Software\Preferences\nvm` |

Priority: **HKLM Policies** → user preferences. See also [Core Configuration](core) for the local/`nvm config` view of the same knobs.

:::info[Certified only]
ADMX templates and version ACL policies ship with certified (Governance) builds from the [customer portal](https://portal.author.io). Community builds use [Core Configuration](core) only.
:::

For import and deployment steps (GPO / Intune), see [Administrative Templates](../guide/deploy/policy/administrative-templates). Full registry value types are in the [Central Registry Reference](../guide/deploy/policy/registry).

---

## GPO tree

After importing `NVMWindows.admx` + `en-US\NVMWindows.adml`:

**Computer Configuration → Administrative Templates → Author Software → NVM for Windows**

```
NVM for Windows
├── Network
├── Environment
│   └── Shim mode
└── Security
    └── Shim mode
```

**Shim mode** child folders only apply when operating mode is `shim`. In link mode those registry values are ignored.

:::warning[Inverted GPO labels]
Several policies use “Disable …” display names. **Enabled** in the GPO editor often writes `0` to the registry (feature off). Tables below list both the **GPO label** and the **registry value** that actually lands.
:::

---

## Top level (NVM for Windows)

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Disable Node.js version management | `Enabled` | `enabled` (via `nvm on`/`nvm off`) | **GPO Enabled** → `Enabled=0` (`nvm off`). **GPO Disabled** → `Enabled=1` (`nvm on`). Does not uninstall Node.js. |
| Configure Node.js storage directory | `InstallRoot` | `root` | Path string. Default `%LOCALAPPDATA%\Author Software\nvm\installs`. |
| Allow users to change the Node.js storage directory | `AllowRootDirChange` | `allow_root_dir_change` | `1` allow / `0` block. |
| Configure local Node.js installation mirror source directory | `LocalInstallDir` | `local_dir` | Local folder of Node archives (air-gap / controlled media). Overrides cache. |
| Use local mirror for all Node.js installations | `LocalInstallOnly` | `local_install_only` | `1` = install only from `LocalInstallDir`. |

---

## Environment

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Set operating mode | `OperatingMode` | `mode` | `shim` (recommended) or `link`. Shim required for shim-only policies below. |
| Configure custom version aliases | `Aliases` | `aliases` | One `alias=version` per line (e.g. `stable=24.9.0`). Blocks user-defined aliases. |
| Configure auto-installed global npm modules | `AutoInstallModuleList` | `auto_installed_modules` | One npm package name per line. |

### Environment → Shim mode

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Configure automatic version detection files | `AutoDetect` | `auto_detect` | One filename per line, priority order. Default: `.nvmrc`, `.node-version`, `package.json`. JSON files use `engines` / `devEngines`. |
| Configure default auto-detect file | `DefaultDetectFile` | `default_detect_file` | File written by `nvm rc`. Default `.nvmrc`. |
| Disable automatic version detection | `AutoUse` | `auto_use` | **GPO Enabled** → `AutoUse=0`. **GPO Disabled** → `AutoUse=1`. |
| Disable automatic version installation | `AutoInstall` | `auto_install` | **GPO Enabled** → `AutoInstall=0`. **GPO Disabled** → `AutoInstall=1`. |
| Always prompt before automatic installation | `AutoInstallPrompt` | `auto_install_prompt` | **GPO Enabled** → `1` (prompt). **GPO Disabled** → `0`. |
| Disable native tool installation | `AllowToolInstall` | `allow_tool_install` | **GPO Enabled** → `AllowToolInstall=0` (block `nvm install native-tools`). **GPO Disabled** → `1`. Native tools pull large third-party installers (Python, VS Build Tools). |
| Configure package manager mismatch action | `PackageManagerMismatchAction` | `pm_mismatch_action` | `error` (default), `warn`, or `ignore`. |

---

## Network

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Configure proxy server address | `Proxy` | `proxy` | Proxy URL. Basic/Bearer in all certified editions; IWA and PAC/WPAD need Governance. |
| Configure proxy authentication type | `ProxyAuthType` | `proxy_auth_type` | `basic`, `ntlm`, `negotiate`, `ntlm,negotiate`, or `bearer`. |
| Configure proxy authentication value | `ProxyAuth` | `proxy_auth` | Single string: `user:pass` or `Bearer <token>` (stored in plain text). |
| Configure Node.js download mirror(s) | `MirrorNode` | `node_mirror` | One URL per line; first success wins. Default `https://nodejs.org/dist`. |
| Configure npm registry mirror(s) | `MirrorNpm` | `npm_mirror` | One URL per line. Default `https://registry.npmjs.org`. |
| Always cache downloads | `CacheDownloads` | `cache_downloads` | **GPO Enabled** → `1`. **GPO Disabled** → `0`. |
| Disable removal of cached downloads | `AllowDownloadCacheDelete` | `allow_download_cache_removal` | **GPO Enabled** → `AllowDownloadCacheDelete=0` (block delete). **GPO Disabled** → `1`. |
| Disable NVM for Windows upgrades | `DisableUpgrade` | `disable_upgrade` | **GPO Enabled** → `1` (block in-app upgrades). Does not block AD/Intune package rollout. |
| Disable project and release announcements | `DisableAnnouncements` | `disable_announcements` | **GPO Enabled** → `1`. License expiry notices still run. |

---

## Security

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Configure allowed Node.js versions | `VersionAllowList` | _(policy only)_ | One rule per line. Exact semver, wildcards (`20.x`), aliases, `!` / `NOT` negation. Invalid rules fail closed. Allow wins over block. Magic keywords (`EOL`, `ALPHA`, `MAINTENANCE`) are enforced via Author mirrors. |
| Configure blocked Node.js versions | `VersionBlockList` | _(policy only)_ | Same rule grammar as allow list. |
| Disable insecure downloads | `AllowInsecureDownloads` | `allow_insecure_downloads` | **GPO Enabled** → `AllowInsecureDownloads=0` (block bad TLS). **GPO Disabled** → `1` (allow). |
| Include verbose identity metadata in mirror license tokens | `ApplyVerboseLicenseMetadata` | _(policy only)_ | **GPO Enabled** → include `idp_username`, `idp_machine_name`, `idp_machine_id` in mirror JWTs. Default off. Does **not** set `AccessToken` / `AccessKey`. |
| Skip live license JWKS (air-gapped JWT verify) | `AirGapped` | `air_gapped` | **GPO Enabled** → verify AccessToken only against offline JWKS (`JwksCose` or `nvm-jwks.cose`). Independent of `LocalInstallOnly`. |

### Security → Shim mode

| GPO policy | Registry value | `nvm config` key | Values / notes |
|------------|----------------|------------------|----------------|
| Enable audit logging | `LogExecutions` | `log_executions` | **GPO Enabled** → log every `node` invocation to Windows Event Log. |
| Enforce Node.js permission model | `EnforcePermissionModel` | `enforce_permission_model` | Shim prepends `--permission` (Node 23+) or `--experimental-permission` (20–22). Default-deny; apps must pass `--allow-*`. |
| Prevent modification of global JavaScript prototypes | `FreezeV8GlobalObjects` | `freeze_v8_global_objects` | Shim prepends `--frozen-intrinsics` (Node 12+). Adds latency. |
| Disallow dynamic code generation from strings | `DisableEvalAndStringExecution` | `disable_eval_and_string_execution` | Shim prepends `--disallow-code-generation-from-strings` (blocks `eval` / `new Function()`). |
| Configure approved vendors (trusted code signers) | `AllowedSigners` | `allowed_signers` | Extra Authenticode `O=` names allowed for `node.exe`. Always trusted: OpenJS Foundation, Node.js Foundation, Author Software. One signer per line. |
| Configure npm package minimum release age | `NpmModuleMinimumAge` | _(policy only)_ | Minutes since publish before npm/pnpm/yarn may install a package. `0` or not configured = off. Mapped to each package manager’s min-release-age setting. |

---

## Not in ADMX (deploy separately)

Licensing secrets are **not** ADMX policies. Deploy with startup/remediation scripts or elevated `nvm license`:

| Registry value | Purpose |
|----------------|---------|
| `AccessToken` | Author license JWT (`Authorization: Bearer …`) |
| `AccessKey` | Mirror auth secret (Governance) |
| `JwksCose` | Offline JWKS blob for air-gapped token verify |

See the certified policy bundle README and [Administrative Templates](../guide/deploy/policy/administrative-templates) for `Set-NvmWindowsLicensing.ps1` / `Set-NvmWindowsAccessToken.ps1`.

---

## Quick map: inverted “Disable …” policies

| GPO says **Enabled** | Registry result |
|----------------------|-----------------|
| Disable Node.js version management | `Enabled=0` |
| Disable automatic version detection | `AutoUse=0` |
| Disable automatic version installation | `AutoInstall=0` |
| Disable native tool installation | `AllowToolInstall=0` |
| Disable removal of cached downloads | `AllowDownloadCacheDelete=0` |
| Disable insecure downloads | `AllowInsecureDownloads=0` |
| Disable NVM for Windows upgrades | `DisableUpgrade=1` |
| Disable project and release announcements | `DisableAnnouncements=1` |

When in doubt, check the live value:

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Policies\Author Software\nvm'
nvm config list
```
