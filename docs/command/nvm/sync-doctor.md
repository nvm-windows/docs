---
title: doctor
sidebar_position: 13
tags: [sync]
---

# nvm doctor

Detect and fix common NVM for Windows issues.

## Usage

```powershell
Usage: nvm doctor [<checks> ...] [flags]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `[checks ...]` | No | Specific check names to run. When omitted, all checks run. |

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--autofix` | | Apply fixes automatically when supported. |
| `--list` | | List available checks without running them. |
| `--json` | | Structured JSON output for automation. |
| `--measure-deadlines` | | Time each download source and print the minimum, average, and maximum. |
| `--measure-count` | | Repeat each measurement this many times. The default is 3. This flag does not apply to `--auto-deadlines`. |
| `--auto-deadlines` | | Measure each download source 59 times and save the slowest sample as your deadlines. |

## Behavior

| Detail | Description |
|--------|-------------|
| Backend | Delegates to `sync.exe doctor` |
| Failure | Occurs if sync utility is missing or cannot be resolved |
| Modes | Full check run, list-only, or autofix |

## Examples

```powershell
# run all checks
nvm doctor

# enumerate available checks only
nvm doctor --list

# run selected checks
nvm doctor path proxy

# run fixes where supported
nvm doctor --autofix

# structured output for automation
nvm doctor --json

# save network deadlines from 59 attempts per source
nvm doctor --auto-deadlines
```

## Automatic network deadlines

`nvm doctor --auto-deadlines` measures how long your download sources actually take, then writes deadlines into your settings from the **slowest** successful sample.

### Why 59 attempts

Network time jumps around. One or two probes can look fine and still miss the slow cases that later make installs hit **NVM4501**.

Auto-deadlines targets the **95th percentile** of request latency (most requests finish faster; only about one in twenty is slower). Doctor takes the **maximum** of the samples as that estimate.

For that maximum to be a **95% confident** upper bound on the 95th percentile, you need enough independent samples. The count is:

\[
n = \lceil \ln(1 - 0.95) / \ln(0.95) \rceil = 59
\]

In plain terms: after 59 independent attempts, there is about a 95% chance that at least one sample was as slow as (or slower than) the true 95th percentile. Saving that slowest time as the deadline leaves a buffer for typical variation without waiting forever.

Six attempts run at a time (about 10 rounds). Each attempt opens its own TCP connection, so they do not share one socket. Doctor prints one line after each round, for example `[OK] reachability https://nodejs.org/dist/index.tab 1/10`. A failed attempt prints `[FAIL]` and the error.

`nvm doctor --auto-deadlines --json` omits those progress lines. The JSON contains the finished measurements and the saved deadlines.

Doctor saves that slowest time in your settings. Doctor does not save a value below the default for that setting.

| Setting | Slowest sample | Default |
|---------|----------------|---------|
| `TimeoutReachabilityMs` | Reachability checks | 1500 ms |
| `TimeoutCatalogMs` | Catalog fetch | 3000 ms |
| `TimeoutCatalogMirrorMs` | Catalog fetch | 800 ms |
| `TimeoutDownloadMs` | Catalog fetch | 30000 ms |

If an attempt fails, doctor does not save deadlines. If machine policy already sets a value, your saved value does not change the deadline that NVM for Windows uses.

## Sample output

```powershell
[OK] PATH layout
[OK] Mirror reachability
[WARN] Cached metadata is stale
```

## Verified transcript (local run)

```powershell
PS> nvm doctor --help
Usage: nvm doctor [<checks> ...] [flags]

Flags:
  --autofix
  --list
  --json
```

In enterprise environments, run doctor after rollout and during workstation health checks.
