---
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

See [Administrative Templates](ad) for GPO and Intune deployment. Download ADMX/ADML from the [customer portal](https://portal.author.io).

|Name|Key|Description|
|:-|:-|:-|
|**Air-gapped license verify**|`AirGapped`|Skip live JWKS fetch from `licensing.author.io`. Verify `AccessToken` only against the COSE-signed offline JWKS store (`JwksCose` or `nvm-jwks.cose` next to `nvm.exe`). Independent of `LocalInstallOnly`.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Version aliases**|`Aliases`|Centrally managed aliases (e.g. `stable=24.9.0`). Blocks user-defined aliases.<br /><br />`alias=version` per entry<br /><br />`REG_MULTI_SZ`|
|**Allow cache deletion**|`AllowDownloadCacheDelete`|Whether cached downloads may be removed (`nvm cache remove`).<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allow insecure downloads**|`AllowInsecureDownloads`|Permit downloads when TLS certificates are expired or invalid.<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Allow install root change**|`AllowRootDirChange`|Whether users may change the install root.<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allow native tool install**|`AllowToolInstall`|Allow `nvm install native-tools` (Python, VS Build Tools, etc.) (shim-only).<br /><br />- `0` = blocked<br />- `1` = allowed<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Allowed code signers**|`AllowedSigners`|Additional trusted `node.exe` signers. OpenJS Foundation, Node.js Foundation, and Author Software are always trusted (shim-only). One signer name per entry.<br /><br />`REG_MULTI_SZ`|
|**Verbose mirror license metadata**|`ApplyVerboseLicenseMetadata`|When on, mirror license JWTs include identity claims (`idp_username`, `idp_machine_name`, `idp_machine_id`). Does not set `AccessToken` / `AccessKey`.<br /><br />- `0` = omit claims<br />- `1` = include claims<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Auto-detect files**|`AutoDetect`|Project files scanned for version pins (shim-only). Overrides defaults.<br /><br />Default:<br/>&nbsp;&nbsp;`.nvmrc`<br/>&nbsp;&nbsp;`.node-version`<br/>&nbsp;&nbsp;`package.json`<br /><br />`REG_MULTI_SZ`|
|**Auto-install missing version**|`AutoInstall`|Auto-install missing detected versions (shim mode).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Auto-install global modules**|`AutoInstallModuleList`|Global npm modules installed with each new Node.js version. One module name per entry.<br /><br />`REG_MULTI_SZ`|
|**Prompt before auto-install**|`AutoInstallPrompt`|Confirm before auto-installing (shim mode).<br /><br />- `0` = no prompt<br />- `1` = prompt<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Auto-use detected version**|`AutoUse`|Auto-switch to detected version when running commands (shim mode).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Cache downloads**|`CacheDownloads`|Cache downloaded Node.js versions for offline reuse.<br /><br />- `0` = off/false<br />- `1` = on/true<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Default detect file**|`DefaultDetectFile`|File written when pinning a version (`nvm rc`) (shim-only).<br /><br />Default: `.nvmrc`<br /><br />`REG_SZ`|
|**Disable announcements**|`DisableAnnouncements`|Suppress project and release announcements.<br /><br />- `0` = shown<br />- `1` = hidden<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disallow eval / string code gen**|`DisableEvalAndStringExecution`|Shim prepends `--disallow-code-generation-from-strings`, blocking `eval()` and `new Function()` (shim-only). Does not affect `node:vm`.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disable NVM upgrades**|`DisableUpgrade`|Block in-app NVM upgrades (does not block AD/GPO package deployment).<br /><br />- `0` = allowed<br />- `1` = blocked<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Disable version management**|`Enabled`|Forces version management on or off. Equivalent to `nvm on` / `nvm off`. When off, NVM does not manage or redirect Node.js commands.<br /><br />- `0` = off (`nvm off`)<br />- `1` = on<br /><br />Default: `1`<br /><br />`REG_DWORD`|
|**Enforce permission model**|`EnforcePermissionModel`|Shim prepends Node permission-model flag on every `node.exe` launch (shim-only). Default-deny FS/network unless the process passes `--allow-*` at runtime. NVM does not inject `--allow-*` grants.<br /><br />- Node 23+: `--permission`<br />- Node 20–22: `--experimental-permission`<br />- Node &lt;20: no flag (unsupported)<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Freeze V8 global objects**|`FreezeV8GlobalObjects`|Shim prepends `--frozen-intrinsics` so built-in prototypes cannot be patched (shim-only; Node.js 12+). Adds measurable startup cost.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Install root**|`InstallRoot`|Directory where Node.js versions are stored. Overrides machine and user preferences.<br /><br />Default: `%LOCALAPPDATA%\Author Software\nvm\installs`<br /><br />`REG_SZ`|
|**Local install source**|`LocalInstallDir`|Alternate local directory for Node.js archives (air-gapped mirrors). Overrides cache.<br /><br />`REG_SZ`|
|**Local install only**|`LocalInstallOnly`|Restrict installs to `LocalInstallDir` only.<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Audit logging**|`LogExecutions`|Log every Node.js invocation to the Windows Event Log (shim-only).<br /><br />- `0` = off<br />- `1` = on<br /><br />Default: `0`<br /><br />`REG_DWORD`|
|**Node.js download mirrors**|`MirrorNode`|Ordered mirror list; first successful response wins.<br /><br />Default: `https://nodejs.org/dist`<br /><br />`REG_MULTI_SZ`|
|**npm registry mirrors**|`MirrorNpm`|Ordered npm registry list. Used as shim registry fallback.<br /><br />Default: `https://registry.npmjs.org`<br /><br />`REG_MULTI_SZ`|
|**npm module minimum age**|`NpmModuleMinimumAge`|Minimum package publish age (cooldown period), in minutes, for package manager module installations (shim mode). This feature auto-converts the value for use with whichever package manager (npm, pnpm, and yarn) is used.<br /><br />Default: `0` (disabled)<br /><br />`REG_DWORD`|
|**Operating mode**|`OperatingMode`|How NVM for Windows manages Node.js versions.<br /><br />**Shim** (recommended) uses signed shims to intercept `node`, `npm`, `npx`, `yarn`, and `pnpm`. Required for runtime policies (audit logging, auto-detect, ACL).<br /><br />**Link** uses NTFS junctions/symlinks on PATH.<br /><br />Default: `shim`<br /><br />`REG_SZ`|
|**Package manager mismatch action**|`PackageManagerMismatchAction`|Behavior when npm/pnpm/yarn version mismatches Node during install or use (shim-only).<br /><br />- `ignore`<br />- `warn`<br />- `error`<br /><br />Default: `error`<br /><br />`REG_SZ`|
|**Proxy URL**|`Proxy`|Proxy for downloads. Basic and Bearer in all certified editions. IWA and PAC/WPAD require Governance.<br /><br />`REG_SZ`|
|**Proxy auth value**|`ProxyAuth`|Credentials or bearer token (stored in plain text).<br /><br />- `user:pass`<br />- `Bearer YOUR_TOKEN`<br /><br />`REG_SZ`|
|**Proxy auth type**|`ProxyAuthType`|Authentication scheme for the configured proxy.<br /><br />- `basic`<br />- `ntlm`<br />- `negotiate`<br />- `ntlm,negotiate`<br />- `bearer`<br /><br />`REG_SZ`|
|**Allowed Node.js versions**|`VersionAllowList`|Allow list for installs. Invalid entries fail enforcement. Allow wins over block.<br /><br />Supports exact semver version, wildcards (e.g. `20.x`), aliases, and `NOT`/`!` negation (one rule per line).<br /><br />`REG_SZ`|
|**Blocked Node.js versions**|`VersionBlockList`|Block list for installs. Same rule formats as `VersionAllowList`<br /><br />`REG_SZ`|

:::tip[GPO vs registry values]
Several ADMX policies use inverted GPO labels (e.g. **Disable automatic version detection** writes `AutoUse=0` when enabled). The table documents the **registry value** admins should deploy via GPO, Intune (imported ADMX or Registry CSP), or Entra custom OMA-URI.
{/* MECM support is planned. */}
:::

## Registry Import Example

Save as `nvm-policy.reg`, replace placeholder paths and URLs for your environment, then double-click or run `reg import nvm-policy.reg` from an elevated command prompt.

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
"Aliases"="stable=24.9.0,lts=22.17.0"

; --- Version ACL (enhanced build) ---
"VersionAllowList"="20.x\r\n22.x"
"VersionBlockList"="!20.17.0"

; --- Network / downloads ---
"Proxy"="http://proxy.example.corp:8080"
"ProxyAuthType"="ntlm"
; "ProxyAuth"="service-account:password"
; "ProxyAuth"="Bearer YOUR_TOKEN_HERE"
"MirrorNode"="https://download.author.io/runtime/node,https://nodejs.org/dist"
"MirrorNpm"="https://npm.example.corp,https://registry.npmjs.org"
"CacheDownloads"=dword:00000001
"AllowDownloadCacheDelete"=dword:00000000
"AllowInsecureDownloads"=dword:00000000
"ApplyVerboseLicenseMetadata"=dword:00000000
"DisableUpgrade"=dword:00000001
"DisableAnnouncements"=dword:00000001

; --- Shim runtime (requires OperatingMode=shim) ---
"AutoDetect"=".nvmrc,.node-version,package.json"
"DefaultDetectFile"=".nvmrc"
"AutoUse"=dword:00000001
"AutoInstall"=dword:00000000
"AutoInstallPrompt"=dword:00000001
"AutoInstallModuleList"="typescript,eslint,prettier"
"AllowToolInstall"=dword:00000000
"PackageManagerMismatchAction"="error"
"AllowedSigners"="Contoso Ltd."
"LogExecutions"=dword:00000001
"EnforcePermissionModel"=dword:00000001
"FreezeV8GlobalObjects"=dword:00000001
"DisableEvalAndStringExecution"=dword:00000001
"NpmModuleMinimumAge"=dword:000005a0
```