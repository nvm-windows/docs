---
sidebar_label: Build from Source
sidebar_position: 3
---

# Build from Source

[Prebuilt packages](./installers) are recommended unless you have explicit customization needs. Custom builds are not supported. This guide is a courtesy.

:::info[Community Build only]
This page describes the open-source Inno Setup pipeline.
[Certified Builds](../guide/builds/) (MSI and Intune packs, ADMX, SBOM, etc.) are not available to build from source.
:::

## Prerequisites

Install these tools before you build.

|Tool|Notes|
|:-|:-|
|Windows 11 x64/arm64|The host can build the other architecture. Pass `-Architecture`.|
|[Go](https://go.dev/dl/)|Version in `cli/src/go.mod` (currently **1.26.2**).|
|[qgo](https://github.com/quikdev/go)|Go build wrapper for the CLI. Put `qgo` on `PATH`.|
|[Zig](https://ziglang.org/download/)|Exact version in `shim/.zigversion` (currently **0.15.2**).|
|[Inno Setup](https://jrsoftware.org/isdl.php)|**6.7.1+**. Put `ISCC.exe` on `PATH`. The setup EXE needs this tool.|
|[go-winres](https://github.com/tc-hib/go-winres)|Embeds Windows resources. The build script runs `go install` if the tool is missing.|
|Git|Clone with submodules.|
|PowerShell|Run `.\build\main.ps1` from the repository root.|
|Network (for `-DownloadSync`)|Downloads the prebuilt `sync.exe` from the GitHub release.|

Put `GOBIN` or `GOPATH\bin` on `PATH`.
The build must find tools that `go install` writes to that folder.

## Get the source

The public repository links the CLI, common libraries, shims, and the installer as Git submodules.

```
nvm/
├── bin/          # created by the build
├── .dist/        # installer + staged sync release asset
├── build/        # Community Build scripts
├── cli/          # nvm.exe (Go)
├── common/       # shared Go modules
├── shim/         # node/proxy/reshim (Zig)
└── installer/    # Inno Setup
```

```powershell
git clone --recurse-submodules https://github.com/nvm-windows/nvm.git
cd nvm
```

If the clone has no submodules, run:

```powershell
git submodule update --init --recursive
```

:::warning[Private sync repo]
`sync.exe` (`doctor` and `upgrade`) is free to use.
`sync.exe` is not compiled from public source.
`sync.exe` is not part of core nvm operations.
`sync.exe` manages the update and maintenance path for Community Builds and Certified Builds.
That path uses Author service URLs.
A custom build must supply its own upgrade and maintenance program.

Each community GitHub release has two files per architecture:

- `nvm-<version>-<arch>-setup.exe` — Inno Setup installer
- `nvm-<version>-<arch>-sync.exe` — prebuilt sync for a from-source build

Pass **`-DownloadSync`**.
`.\build\main.ps1` then downloads that sync file into `bin\utils\sync.exe` before packaging.
:::

## Build

Select one build procedure below.

### Public full build (recommended)

This procedure compiles the CLI and the shims.
It downloads the prebuilt `sync.exe`.
It builds the Inno Setup installer.

```powershell
.\build\main.ps1 -DownloadSync
```

`.\build.ps1` calls the same script.

The download uses the tag `v` plus the `version` field in `cli/src/manifest.json`.
The repository is `nvm-windows/nvm`.
The asset name is `nvm-<version>-<arch>-sync.exe`.
That release must already exist.
The [community release workflow](https://github.com/nvm-windows/nvm/blob/main/.github/workflows/release.yml) uploads `*-setup.exe` and `*-sync.exe` when it publishes.

### Public component-only

Build one component:

```powershell
.\build\main.ps1 -Component Cli
.\build\main.ps1 -Component Shims
.\build\main.ps1 -Component Sync -DownloadSync
```

### Maintainer / CI

If you can read the private sync submodule, omit `-DownloadSync`.
The script then compiles sync from source.

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
|`-Architecture`|`amd64`, `arm64`|Target CPU. Omit this parameter to auto-detect.|
|`-Component`|`All` (default), `Cli`, `Shims`, `Sync`|What to build. The installer requires `All`.|
|`-DownloadSync`|switch|Fetch release `*-sync.exe`. Do not compile the private sync source.|
|`-SyncReleaseTag`|tag|Override the release tag. The default is `v` plus the CLI manifest version.|
|`-SyncReleaseRepo`|`owner/repo`|Override the download repo. The default is `nvm-windows/nvm`.|
|`-SkipInstaller`|switch|Skip the setup EXE. Use this only with `-Component All`.|
|`-BinRoot`|path|Override the binary output directory.|

Exit code `0` means success.
A non-zero exit code stops the script at the first failed step.

## Output

The build writes these files.

|Artifact|Path|
|:-|:-|
|CLI|`bin\nvm.exe`|
|Node shim|`bin\.shim\node.exe`|
|Helpers|`bin\utils\proxy.exe`, `reshim.exe`, `sync.exe`|
|Installer|`.dist\nvm-<version>-<arch>-setup.exe`|
|Staged sync release asset|`.dist\nvm-<version>-<arch>-sync.exe`|

`<version>` comes from `cli/src/manifest.json`.
Sync worker DLLs are not in the package.
The runtime downloads those DLLs from `assets.nvm-windows.com` when it needs them.

## Install what you built

Run the setup EXE as a **standard user**.
Do not run it as an elevated Administrator.
Follow the [Community Build installer](./installers#community-build) rules.

```powershell
.\.dist\nvm-<version>-<arch>-setup.exe
```

Then install Node.js:

```powershell
nvm install lts
```

To remove a local build later, follow [Uninstall](./uninstall#community-builds).

### Portable/binary-only use

Pass `-SkipInstaller` to run `bin\nvm.exe` from a custom layout during development.
A production install uses the Inno Setup package.
That package registers PATH, preferences, protocol handlers, and uninstall data.

## What each component is

Each component has one role.

|Component|Language|Public source?|Role|
|:-|:-|:-:|:-|
|`cli`|Go|✓|`nvm.exe`. Install, use, list, config, and cache.|
|`shim`|Zig|✓|`node.exe` shim, `proxy.exe`, and `reshim.exe`. See [operating modes](../features/modes).|
|`sync`|Go|—|Background update and doctor helper (`sync.exe`). Use `-DownloadSync` or maintainer source.|
|`installer`|Inno Setup|✓|Per-user Community Build setup EXE.|

## Troubleshooting

Use this table when the build fails.

|Symptom|What to check|
|:-|:-|
|`qgo` not found|Install [qgo](https://github.com/quikdev/go). Put it on `PATH`.|
|Wrong Go/Zig version|Match `cli/src/go.mod` and `shim/.zigversion`.|
|Sync source missing / compile fails|Expected on a public clone. Pass `-DownloadSync`. Or build only `-Component Cli` or `-Component Shims`.|
|`-DownloadSync` 404|Publish a release that contains `nvm-<version>-<arch>-sync.exe`. Match `cli/src/manifest.json`. Or pass `-SyncReleaseTag` for an existing tag.|
|Installer step fails|Install Inno Setup **6.7.1+**. Put `ISCC.exe` on `PATH`. Confirm `cli/src/manifest.json` has `version`, `appUserModelId`, and `appId`.|
|`go-winres` missing|The build script runs `go install github.com/tc-hib/go-winres@latest`. Put `GOPATH\bin` on `PATH`. Run the build again.|
|Submodule empty/missing code|Run `git submodule update --init --recursive`. Public clones include cli, common, and shim. The sync submodule stays private.|

Community CI and release steps are in [`build/README.md`](https://github.com/nvm-windows/nvm/blob/main/build/README.md).

## Related

|Topic|Doc|
|:-|:-|
|Prebuilt installers|[Installers](./installers)|
|Community Build vs Certified Build|[Choosing a Build](../guide/builds/)|
|Remove an install|[Uninstall](./uninstall)|
|Shim vs link mode|[Operating Modes](../features/modes)|
