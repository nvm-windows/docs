# Build from Source

Most users should install a prebuilt package instead — see [Installers](./installers).

:::info[Community only]
This guide covers the open-source/unsigned Inno Setup pipeline. [Certified builds](../guide/builds/) (signed MSI/Intune packs, ADMX, SBOM, etc.) are produced from private tooling and distributed through the [customer portal](https://portal.author.io).
:::

## Prerequisites

|Tool|Notes|
|:-|:-|
|Windows 10/11 (amd64 or arm64)|Host architecture can also cross-build the other arch via `-Architecture`.|
|[Go](https://go.dev/dl/)|Version in `cli/src/go.mod` (currently **1.26.2**).|
|[qgo](https://github.com/quikdev/go)|Go build wrapper used by CLI and sync (`qgo` on `PATH`).|
|[Zig](https://ziglang.org/download/)|Exact version in `shim/.zigversion` (currently **0.15.2**).|
|[Inno Setup](https://jrsoftware.org/isdl.php)|**6.7.1+** with `ISCC.exe` on `PATH` (needed for the setup EXE).|
|[go-winres](https://github.com/tc-hib/go-winres)|Windows resource embedding. The build script installs it with `go install` if missing.|
|Git|Clone with submodules.|
|PowerShell|Run `.\build\main.ps1` from the repo root.|

Ensure `GOBIN`/`GOPATH\bin` is on `PATH` so tools installed by `go install` are found.

## Get the source

The community monorepo wires CLI, common libraries, shims, sync, and the installer as Git submodules:

```
nvm/
├── bin/          # created by the build
├── .dist/        # installer output
├── build/        # community build scripts
├── cli/          # nvm.exe (Go)
├── common/       # shared Go modules
├── shim/         # node/proxy/reshim (Zig)
├── sync/         # sync.exe (Go)
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

## Build

From the repository root:

```powershell
.\build\main.ps1
```

`.\build.ps1` forwards to the same script.

Default behavior:

- Detects host architecture when `-Architecture` is omitted
- Builds CLI → shims → `sync.exe` → Inno Setup installer
- Produces an **unsigned** community build (no Authenticode, no SBOM/SLSA packaging, no ADMX)

### Common options

```powershell
# Explicit architecture
.\build\main.ps1 -Architecture amd64
.\build\main.ps1 -Architecture arm64

# Binaries only (skip Inno Setup)
.\build\main.ps1 -SkipInstaller

# Single component (installer runs only with -Component All)
.\build\main.ps1 -Component Cli
.\build\main.ps1 -Component Shims
.\build\main.ps1 -Component Sync

# Custom output directory (default .\bin)
.\build\main.ps1 -BinRoot D:\out\nvm-bin
```

|Parameter|Values|Purpose|
|:-|:-|:-|
|`-Architecture`|`amd64`, `arm64`|Target CPU. Omit to auto-detect.|
|`-Component`|`All` (default), `Cli`, `Shims`, `Sync`|What to compile. Installer requires `All`.|
|`-SkipInstaller`|switch|Skip the setup EXE.|
|`-BinRoot`|path|Override binary output directory.|

Exit code `0` means success. Non-zero stops at the first failed step.

## Output

A full build writes:

|Artifact|Path|
|:-|:-|
|CLI|`bin\nvm.exe`|
|Node shim|`bin\.shim\node.exe`|
|Helpers|`bin\utils\proxy.exe`, `reshim.exe`, `sync.exe`|
|Installer|`.dist\nvm-<version>-<arch>-setup.exe`|

`<version>` comes from `cli/src/manifest.json`.

:::tip[Sync worker DLLs]
Community builds compile `sync.exe` but **do not** compile sync worker DLLs. Those assets are published by the certified release pipeline to `assets.nvm-windows.com` and are fetched by sync at runtime when needed.
:::

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

|Component|Language|Role|
|:-|:-|:-|
|`cli`|Go|`nvm.exe` — install/use/list/config/cache|
|`shim`|Zig|`node.exe` shim, `proxy.exe`, `reshim.exe` ([operating modes](../features/modes))|
|`sync`|Go|Background update/doctor helper (`sync.exe`)|
|`installer`|Inno Setup|Per-user community setup EXE|

## Troubleshooting

|Symptom|What to check|
|:-|:-|
|`qgo` not found|Install [qgo](https://github.com/quikdev/go) and ensure it is on `PATH`.|
|Wrong Go/Zig version|Match `cli/src/go.mod` and `shim/.zigversion`.|
|Installer step fails|Inno Setup **6.7.1+** (`ISCC.exe` on `PATH`). Confirm `cli/src/manifest.json` has `version`, `appUserModelId`, and `appId`.|
|`go-winres` missing|Build script tries `go install github.com/tc-hib/go-winres@latest`. Put `GOPATH\bin` on `PATH`, then retry.|
|Submodule empty/missing code|`git submodule update --init --recursive`.|
|Dirty `sync/src/go.mod` after a failed sync build|Community sync build temporarily rewrites `go.mod` for stub `mirrorauth` and restores it afterward. Restore the file from git if a crash left it dirty — do not commit that rewrite.|

CI and release wiring for community builds live in the repo at [`build/README.md`](https://github.com/nvm-windows/nvm/blob/main/build/README.md).

## Related

|Topic|Doc|
|:-|:-|
|Prebuilt installers|[Installers](./installers)|
|Community vs certified|[Choosing an Edition](../guide/builds/)|
|Remove an install|[Uninstall](./uninstall)|
|Shim vs link mode|[Operating Modes](../features/modes)|
