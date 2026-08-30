---
slug: /cfg/registry
sidebar_label: Registry Policy Reference
sidebar_position: 2
certified:
  edition: governance
---

# Registry Policy Reference

This reference contains the registry keys and values used to manage, secure, and configure NVM for Windows in enterprise environments.

All administrative policies should be enforced within the **HKEY_LOCAL_MACHINE (HKLM)** hive. Settings applied here are mandatory and will override any conflicting preferences configured by individual users within the local application interface.

:::tip[Policy Override Behavior]
The application evaluates settings in the following order of priority:
1. `HKLM\Software\Policies\Author Software\nvm` (Enforced Admin Policy)
2. `HKCU\Software\Author Software\Preferences\nvm` (User-defined Preferences)
:::

## Available Registry Keys

See [Administrative Templates](ad) for GPO and Intune deployment. Download ADMX/ADML from the [customer portal](https://portal.author.io). ADMX/ADML ship with the **Governance** pack; Distro/Audit can still set shared keys via Registry CSP/OMA-URI or `.reg`.

**Overridable** in a description means users may also set the equivalent preference (`nvm config` / HKCU). Machine policy under `HKLM\Software\Policies\Author Software\nvm` always wins.

|Name|Key|Description|
|:-|:-|:-|
|**Air-gapped license verify**|`AirGapped`|**Edition: Distro+.** Skip live JWKS fetch from `licensing.author.io`. Verify `AccessToken` only against the COSE-signed offline JWKS store (`JwksCose` or `nvm-jwks.cose` next to `nvm.exe`). Independent of `LocalInstallOnly`.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Version aliases**|`Aliases`|**Overridable.** Centrally managed aliases (e.g. `stable=24.9.0`). Blocks user-defined aliases when set by policy.<br /><br />`alias=version` per entry<br /><br />`REG_MULTI_SZ`|
|**Allow cache deletion**|`AllowDownloadCacheDelete`|**Overridable** (`allow_download_cache_removal`). Whether cached downloads may be removed (`nvm cache remove`).<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allow insecure downloads**|`AllowInsecureDownloads`|**Overridable** (`allow_insecure_downloads`). Permit downloads when TLS certificates are expired or invalid.<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Allow install root change**|`AllowRootDirChange`|**Overridable.** Whether users may change the install root.<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allow native tool install**|`AllowToolInstall`|**Overridable.** Allow `nvm install native-tools` (Python, VS Build Tools, etc.) (shim-only).<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allowed code signers**|`AllowedSigners`|**Overridable** (`allowed_signers`). Additional trusted `node.exe` signers. OpenJS Foundation, Node.js Foundation, and Author Software are always trusted (shim-only). One signer name per entry.<br /><br />`REG_MULTI_SZ`|
|**Allowed thumbprints**|`AllowedThumbprints`|**Overridable** (`allowed_thumbprints`). Optional SHA-1 Authenticode leaf thumbprints (hex; separators optional). When non-empty, `node.exe` must match a pin after org allowlist. Empty disables pinning.<br /><br />`REG_MULTI_SZ`|
|**Authenticode revocation**|`AuthenticodeRevocation`|**Overridable** (`authenticode_revocation`). CRL/OCSP mode for Authenticode:<br /><br />- `online` = network retrieval (install/sign/seed only; default)<br />- `cached` = local URL cache only<br />- `disabled` = no revocation checks<br /><br />Shim runtime never uses `online` (clamped to `cached`). `AirGapped` forces `cached` when `online` would apply.<br /><br />Default: `online`<br /><br />`REG_SZ`|
|**Auto-detect files**|`AutoDetect`|**Overridable** (`auto_detect`). Project files scanned for version pins (shim-only). Overrides defaults.<br /><br />Default:<br/>&nbsp;&nbsp;`.nvmrc`<br/>&nbsp;&nbsp;`.node-version`<br/>&nbsp;&nbsp;`package.json`<br /><br />`REG_MULTI_SZ`|
|**Auto-install missing version**|`AutoInstall`|**Overridable** (`auto_install`). Auto-install missing detected versions (shim mode).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Auto-install global modules**|`AutoInstallModuleList`|**Overridable** (`auto_installed_modules`). Global npm modules installed with each new Node.js version. One module name per entry.<br /><br />`REG_MULTI_SZ`|
|**Prompt before auto-install**|`AutoInstallPrompt`|**Overridable** (`auto_install_prompt`). Confirm before auto-installing (shim mode).<br /><br />- `0` = no prompt<br />- `1` = prompt<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Auto-use detected version**|`AutoUse`|**Overridable** (`auto_use`). Auto-switch to detected version when running commands (shim mode).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Cache downloads**|`CacheDownloads`|**Overridable** (`cache_downloads`). Cache downloaded Node.js versions for offline reuse.<br /><br />- `0` = off/false<br />- `1` = on/true<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Default detect file**|`DefaultDetectFile`|**Overridable** (`default_detect_file`). File written when pinning a version (`nvm pin`) (shim-only).<br /><br />Default: `.nvmrc`<br /><br />`REG_SZ`|
|**Disable announcements**|`DisableAnnouncements`|**Overridable** (`disable_announcements`). Suppress project and release announcements.<br /><br />- `0` = shown<br />- `1` = hidden<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disallow eval/string code gen**|`DisableEvalAndStringExecution`|**Overridable** (`disable_eval_and_string_execution`). Shim prepends `--disallow-code-generation-from-strings`, blocking `eval()` and `new Function()` (shim-only). Does not affect `node:vm`.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disable NVM upgrades**|`DisableUpgrade`|**Overridable.** Block in-app NVM upgrades (does not block AD/GPO package deployment).<br /><br />- `0` = allowed<br />- `1` = blocked<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disable version management**|`Enabled`|**Overridable** (`nvm on`/`nvm off`). Forces version management on or off. When off, NVM does not manage or redirect Node.js commands.<br /><br />- `0` = off (`nvm off`)<br />- `1` = on<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Enforce permission model**|`EnforcePermissionModel`|**Overridable** (`enforce_permission_model`). Shim prepends Node permission-model flag on every `node.exe` launch (shim-only). Default-deny FS/network unless the process passes `--allow-*` at runtime. NVM does not inject `--allow-*` grants.<br /><br />- Node 23+: `--permission`<br />- Node 20–22: `--experimental-permission`<br />- Node &lt;20: no flag (unsupported)<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Freeze V8 global objects**|`FreezeV8GlobalObjects`|**Overridable** (`freeze_v8_global_objects`). Shim prepends `--frozen-intrinsics` so built-in prototypes cannot be patched (shim-only; Node.js 12+). Adds measurable startup cost.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Install root**|`InstallRoot`|**Overridable** (`root`). Directory where Node.js versions are stored. Overrides machine and user preferences.<br /><br />Default: `%LOCALAPPDATA%\Author Software\nvm\installs`<br /><br />`REG_SZ`|
|**Local install source**|`LocalInstallDir`|**Overridable** (`local_dir`). Alternate local directory for Node.js archives (air-gapped mirrors). Overrides cache.<br /><br />`REG_SZ`|
|**Local install only**|`LocalInstallOnly`|**Overridable** (`local_install_only`). Restrict installs to `LocalInstallDir` only.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Audit logging**|`LogExecutions`|**Overridable** (`log_executions`). Log every Node.js invocation to the Windows Event Log (shim-only). Most useful on **Audit+** (structured ETW).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Node.js download mirrors**|`MirrorNode`|**Overridable** (`node_mirror`). Ordered mirror list; first successful response wins. See [Download Mirrors](../../features/mirrors). Author `*.author.io` mirrors need Governance licensing — see [Version Firewall + Author Mirror](../../features/author-mirror).<br /><br />Default: `https://nodejs.org/dist`<br /><br />`REG_MULTI_SZ`|
|**npm registry mirrors**|`MirrorNpm`|**Overridable** (`npm_mirror`). Ordered npm registry list. Used as shim registry fallback.<br /><br />Default: `https://registry.npmjs.org`<br /><br />`REG_MULTI_SZ`|
|**Operating mode**|`OperatingMode`|**Overridable** (`mode`). How NVM for Windows manages Node.js versions.<br /><br />**Shim** (recommended) uses signed shims to intercept `node`, `npm`, `npx`, `yarn`, and `pnpm`. Required for runtime policies (audit logging, auto-detect, ACL).<br /><br />**Link** uses NTFS junctions/symlinks on PATH.<br /><br />Default: `shim`<br /><br />`REG_SZ`|
|**Package manager mismatch action**|`PackageManagerMismatchAction`|**Overridable** (`pm_mismatch_action`). Behavior when npm/pnpm/yarn version mismatches Node during install or use (shim-only).<br /><br />- `ignore`<br />- `warn`<br />- `error`<br /><br />Default: `error`<br /><br />`REG_SZ`|
|**Proxy URL**|`Proxy`|**Overridable** (`proxy`). Proxy for downloads. Basic and Bearer work on all certified editions. See [Download Mirrors](../../features/mirrors#http-proxies).<br /><br />`REG_SZ`|
|**Proxy auth value**|`ProxyAuth`|**Overridable** (`proxy_auth`). Credentials or bearer token (stored in plain text).<br /><br />- `user:pass`<br />- `Bearer YOUR_TOKEN`<br /><br />`REG_SZ`|
|**Proxy auth type**|`ProxyAuthType`|**Overridable** (`proxy_auth_type`). Authentication scheme for the configured proxy.<br /><br />- `basic`, `bearer` — all certified editions<br />- `ntlm`, `negotiate`, `ntlm,negotiate` — **Governance only** (IWA); PAC/WPAD also Governance-only<br /><br />`REG_SZ`|

## Governance Keys

These keys are part of the **Governance** feature set. They appear in the Governance ADMX pack.

|Name|Key|Description|
|:-|:-|:-|
|**Verbose mirror license metadata**|`ApplyVerboseLicenseMetadata`|When on, Author mirror license JWTs include identity claims (`idp_username`, `idp_machine_name`, `idp_machine_id`). Does not set `AccessToken`/`AccessKey`.<br /><br />- `0` = omit claims<br />- `1` = include claims<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**npm module minimum age**|`NpmModuleMinimumAge`|Minimum package publish age (cooldown), in minutes, for package manager installs (shim mode). Auto-converts for npm/pnpm/yarn.<br /><br />Default: `0` (disabled)<br /><br />`REG_DWORD`|
|**Allowed Node.js versions**|`VersionAllowList`|Allow list for installs. Invalid entries fail enforcement. Allow wins over block. Also feeds Author-mirror JWT version claims (magic tokens such as `EOL`, `ALPHA`, `MAINTENANCE`, `ALL`).<br /><br />Supports exact semver, wildcards (e.g. `20.x`), aliases, and `NOT`/`!` negation (one rule per line).<br /><br />`REG_SZ`|
|**Blocked Node.js versions**|`VersionBlockList`|Block list for installs. Same rule formats as `VersionAllowList`.<br /><br />`REG_SZ`|

:::info[License secrets]
`AccessToken`, `AccessKey`, and `JwksCose` are **not** ADMX policies. Deploy with portal scripts (`Set-NvmWindowsAccessToken.ps1` on stock certified build; `Set-NvmWindowsLicensing.ps1` for governance builds, which also sets `AccessKey` for Author mirrors) or `nvm license`.
:::

:::tip[GPO vs registry values]
Several ADMX policies use inverted GPO labels (e.g. **Disable automatic version detection** writes `AutoUse=0` when enabled). The tables document the **registry value** admins should deploy via GPO, Intune (imported ADMX or Registry CSP), or Entra custom OMA-URI.
{/* MECM support is planned. */}
:::

## Registry Import Example

Save as `nvm-policy.reg`, replace placeholder paths and URLs for your environment, then double-click or run `reg import nvm-policy.reg` from an elevated command prompt.

:::warning[`REG_MULTI_SZ` keys]
`MirrorNode`, `MirrorNpm`, `Aliases`, `AutoDetect`, `AutoInstallModuleList`, `AllowedSigners`, and `AllowedThumbprints` are **`REG_MULTI_SZ`** (one string per entry). A `.reg` line like `"MirrorNode"="url1,url2"` creates a wrong **`REG_SZ`**. Set those with ADMX, Registry CSP, or PowerShell (below) — not comma-joined `REG_SZ` values.
:::

```powershell
Windows Registry Editor Version 5.00

; =============================================================================
; NVM for Windows — machine policy (HKLM)
; Path: HKLM\SOFTWARE\Policies\Author Software\nvm
; =============================================================================

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Author Software\nvm]

; --- Core / environment ---
"OperatingMode"="shim"
"Enabled"=dword:00000001
"InstallRoot"="%LOCALAPPDATA%\\Author Software\\nvm\\installs"
"AllowRootDirChange"=dword:00000000
"LocalInstallDir"="D:\\Node\\local_mirror"
"LocalInstallOnly"=dword:00000000
"AirGapped"=dword:00000000

; --- Version ACL (Governance) ---
"VersionAllowList"="20.x\r\n22.x"
"VersionBlockList"="!20.17.0"

; --- Network / downloads (SZ / DWORD only here; MULTI_SZ via PowerShell below) ---
"Proxy"="http://proxy.example.corp:8080"
"ProxyAuthType"="ntlm"
; "ProxyAuth"="service-account:password"
; "ProxyAuth"="Bearer YOUR_TOKEN_HERE"
"CacheDownloads"=dword:00000001
"AllowDownloadCacheDelete"=dword:00000000
"AllowInsecureDownloads"=dword:00000000
"ApplyVerboseLicenseMetadata"=dword:00000000
"DisableUpgrade"=dword:00000001
"DisableAnnouncements"=dword:00000001

; --- Shim runtime (requires OperatingMode=shim) ---
"DefaultDetectFile"=".nvmrc"
"AutoUse"=dword:00000001
"AutoInstall"=dword:00000000
"AutoInstallPrompt"=dword:00000001
"AllowToolInstall"=dword:00000000
"PackageManagerMismatchAction"="error"
"LogExecutions"=dword:00000001
"EnforcePermissionModel"=dword:00000001
"FreezeV8GlobalObjects"=dword:00000001
"DisableEvalAndStringExecution"=dword:00000001
"NpmModuleMinimumAge"=dword:000005a0
```

After importing the `.reg` (or instead of it for list values), set multi-string keys elevated:

```powershell
$policy = 'HKLM:\SOFTWARE\Policies\Author Software\nvm'

New-ItemProperty -Path $policy -Name MirrorNode -PropertyType MultiString -Force -Value @(
  'https://mirror.author.io/runtime/nodejs'
  'https://nodejs.org/dist'
) | Out-Null

New-ItemProperty -Path $policy -Name MirrorNpm -PropertyType MultiString -Force -Value @(
  'https://npm.example.corp'
  'https://registry.npmjs.org'
) | Out-Null

New-ItemProperty -Path $policy -Name Aliases -PropertyType MultiString -Force -Value @(
  'stable=24.9.0'
  'lts=22.17.0'
) | Out-Null

New-ItemProperty -Path $policy -Name AutoDetect -PropertyType MultiString -Force -Value @(
  '.nvmrc'
  '.node-version'
  'package.json'
) | Out-Null

New-ItemProperty -Path $policy -Name AutoInstallModuleList -PropertyType MultiString -Force -Value @(
  'typescript'
  'eslint'
  'prettier'
) | Out-Null

New-ItemProperty -Path $policy -Name AllowedSigners -PropertyType MultiString -Force -Value @(
  'Contoso Ltd.'
) | Out-Null
```
