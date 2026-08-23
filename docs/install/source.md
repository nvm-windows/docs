# Build from Source

Most users should install a prebuilt package instead — see [Installers](./installers).

:::info[Community Build only]
This guide covers the open-source/unsigned Inno Setup pipeline. [Certified builds](../guide/builds/) (signed MSI/Intune packs, ADMX, SBOM, etc.) are produced from private tooling and distributed through the [customer portal](https://portal.author.io).
:::

## Prerequisites

|Tool|Notes|
|:-|:-|
|Windows 10/11 (amd64 or arm64)|Host architecture can also cross-build the other arch via `-Architecture`.|
|[Go](https://go.dev/dl/)|Version in `cli/src/go.mod` (currently **1.26.2**).|
|[qgo](https://github.com/quikdev/go)|Go build wrapper used by the CLI (`qgo` on `PATH`).|
|[Zig](https://ziglang.org/download/)|Exact version in `shim/.zigversion` (currently **0.15.2**).|
|[Inno Setup](https://jrsoftware.org/isdl.php)|**6.7.1+** with `ISCC.exe` on `PATH` (needed for the setup EXE).|
|[go-winres](https://github.com/tc-hib/go-winres)|Windows resource embedding. The build script installs it with `go install` if missing.|
|Git|Clone with submodules.|
|PowerShell|Run `.\build\main.ps1` from the repo root.|
|Network (for `-DownloadSync`)|Fetches prebuilt `sync.exe` from the GitHub Release.|

Ensure `GOBIN`/`GOPATH\bin` is on `PATH` so tools installed by `go install` are found.

## Get the source

The public community monorepo wires CLI, common libraries, shims, and the installer as Git submodules:

```
nvm/
├── bin/          # created by the build
├── .dist/        # installer + staged sync release asset
├── build/        # community build scripts
├── cli/          # nvm.exe (Go)
├── common/       # shared Go modules
├── shim/         # node/proxy/reshim (Zig)
└── installer/    # Inno Setup
```

```powershell
git clone --recurse-submodules https://github.com/nvm-windows/nvm.git
cd nvm
```

If you already cloned without submodules:

```powershell
git submodule update --init --recursive
```

:::warning[Private sync repo]
`sync.exe` (`doctor` & `upgrade`) is freely available, but is **not** compiled from public source. It is not part of core nvm operations. It manages the **update and maintenance distribution path** used across community and certified builds, which is bound to Author service URLs and services. Custom-built versions should consider implementing their own upgrade/maintenance sidecar application.

Community GitHub releases contain **two** assets per architecture:

- `nvm-<version>-<arch>-setup.exe` — Inno Setup installer
- `nvm-<version>-<arch>-sync.exe` — prebuilt sync for from-source builds

Pass **`-DownloadSync`** so `.\build\main.ps1` fetches that sync asset into `bin\utils\sync.exe` before packaging.
:::

## Build

### Public full build (recommended)

Compiles CLI + shims, downloads prebuilt `sync.exe`, then builds the Inno Setup installer:

```powershell
.\build\main.ps1 -DownloadSync
```

`.\build.ps1` forwards to the same script.

The download uses tag `v` + `cli/src/manifest.json` `version` from repo `nvm-windows/nvm`, asset `nvm-<version>-<arch>-sync.exe`. That release must already exist — the [community release workflow](https://github.com/nvm-windows/nvm/blob/main/.github/workflows/release.yml) uploads both `*-setup.exe` and `*-sync.exe` when it publishes.

### Public component-only

```powershell
.\build\main.ps1 -Component Cli
.\build\main.ps1 -Component Shims
.\build\main.ps1 -Component Sync -DownloadSync
```

### Maintainer / CI

With private sync submodule access, omit `-DownloadSync` to compile sync from source:

```powershell
.\build\main.ps1
```

### Common options

```powershell
# Explicit architecture
.\build\main.ps1 -Architecture amd64 -DownloadSync
.\build\main.ps1 -Architecture arm64 -DownloadSync

# Pin sync to another published release
.\build\main.ps1 -DownloadSync -SyncReleaseTag v2.0.0

# Binaries only (skip Inno Setup)
.\build\main.ps1 -DownloadSync -SkipInstaller

# Custom output directory (default .\bin)
.\build\main.ps1 -DownloadSync -BinRoot D:\out\nvm-bin
```

|Parameter|Values|Purpose|
|:-|:-|:-|
|`-Architecture`|`amd64`, `arm64`|Target CPU. Omit to auto-detect.|
|`-Component`|`All` (default), `Cli`, `Shims`, `Sync`|What to build. Installer requires `All`.|
|`-DownloadSync`|switch|Fetch release `*-sync.exe` instead of compiling private sync source.|
|`-SyncReleaseTag`|tag|Override release tag (default: `v` + CLI manifest version).|
|`-SyncReleaseRepo`|`owner/repo`|Override download repo (default: `nvm-windows/nvm`).|
|`-SkipInstaller`|switch|Skip the setup EXE (only with `-Component All`).|
|`-BinRoot`|path|Override binary output directory.|

Exit code `0` means success. Non-zero stops at the first failed step.

## Output

|Artifact|Path|
|:-|:-|
|CLI|`bin\nvm.exe`|
|Node shim|`bin\.shim\node.exe`|
|Helpers|`bin\utils\proxy.exe`, `reshim.exe`, `sync.exe`|
|Installer|`.dist\nvm-<version>-<arch>-setup.exe`|
|Staged sync release asset|`.dist\nvm-<version>-<arch>-sync.exe`|

`<version>` comes from `cli/src/manifest.json`. Sync worker DLLs are not packaged; they are fetched at runtime from `assets.nvm-windows.com` when needed.

## Install what you built

Run the generated setup EXE as a **standard user** (not elevated Administrator), same rules as the public [community installer](./installers#community-build):

```powershell
.\.dist\nvm-<version>-<arch>-setup.exe
```

Then install Node.js:

```powershell
nvm install lts
```

To remove a local build later, follow [Uninstall](./uninstall#community-builds).

### Portable/binary-only use

With `-SkipInstaller`, you can run `bin\nvm.exe` from a custom layout for development. Production installs should still use the Inno Setup package so PATH, preferences, protocol handlers, and uninstall metadata are registered correctly.

## What each component is

|Component|Language|Public source?|Role|
|:-|:-|:-:|:-|
|`cli`|Go|✓|`nvm.exe` — install/use/list/config/cache|
|`shim`|Zig|✓|`node.exe` shim, `proxy.exe`, `reshim.exe` ([operating modes](../features/modes))|
|`sync`|Go|—|Background update/doctor helper (`sync.exe`); use `-DownloadSync` or maintainer source|
|`installer`|Inno Setup|✓|Per-user community setup EXE|

## Troubleshooting

|Symptom|What to check|
|:-|:-|
|`qgo` not found|Install [qgo](https://github.com/quikdev/go) and ensure it is on `PATH`.|
|Wrong Go/Zig version|Match `cli/src/go.mod` and `shim/.zigversion`.|
|Sync source missing / compile fails|Expected on public clones. Pass `-DownloadSync`, or build only `-Component Cli` / `-Component Shims`.|
|`-DownloadSync` 404|Need a published release with `nvm-<version>-<arch>-sync.exe`. Bump/match `cli/src/manifest.json`, or pass `-SyncReleaseTag` to an existing tag.|
|Installer step fails|Inno Setup **6.7.1+** (`ISCC.exe` on `PATH`). Confirm `cli/src/manifest.json` has `version`, `appUserModelId`, and `appId`.|
|`go-winres` missing|Build script tries `go install github.com/tc-hib/go-winres@latest`. Put `GOPATH\bin` on `PATH`, then retry.|
|Submodule empty/missing code|`git submodule update --init --recursive` (public: cli/common/shim; sync stays private).|

CI and release wiring for community builds live in the repo at [`build/README.md`](https://github.com/nvm-windows/nvm/blob/main/build/README.md).

## Related

|Topic|Doc|
|:-|:-|
|Prebuilt installers|[Installers](./installers)|
|Community vs certified|[Choosing an Edition](../guide/builds/)|
|Remove an install|[Uninstall](./uninstall)|
|Shim vs link mode|[Operating Modes](../features/modes)|
