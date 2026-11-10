---
title: Legacy latest policy
sidebar_label: Legacy latest policy
sidebar_position: 2.5
---

# Legacy latest policy

On Certified Builds with a **Governance** license, administrators can restore the older tip-of-index meaning of the reserved `latest` alias without changing scripts.

By default in v2, `nvm install latest` and `nvm use latest` resolve to the newest **stable** (non-prerelease) Node.js release. That avoids installing alphas that temporarily lead [nodejs.org/dist/index.tab](https://nodejs.org/dist/index.tab).

Some fleets still have automation that expects `latest` to mean “whatever sits at the tip of the catalog,” including prereleases. The Governance policy below keeps those scripts working while logging hosts that still rely on that behavior.

## Policy

| Item | Value |
|------|--------|
| Registry | `HKLM\SOFTWARE\Policies\Author Software\nvm\LatestIncludesPrerelease` |
| Type | `REG_DWORD` |
| Default | `0` (stable `latest`) |
| Enabled | `1` (tip-of-index, including prereleases) |
| Scope | Machine policy only (no HKCU preference) |
| License | Governance |

Deploy with the Governance ADMX (**Use legacy tip-of-index for latest**) or Intune/Registry CSP.

Community Builds ignore this key. Without Governance, the key has no effect.

## Behavior when enabled

1. `latest` resolves to the first non-empty row of the Node.js index, **keeping** any prerelease suffix (for example `27.0.0-alpha.0.0.0`).
2. Scripts keep the same command shape: `nvm install latest`.
3. NVM writes a structured warning: EventName `nvm.resolution.legacy_latest`.
4. Successful installs driven by `latest` under this policy also set `LatestMode=legacy` on `nvm.system.changed`.

Prefer migrating callers to:

```powershell
nvm install alpha
# or
nvm install 26.13.0
```

`alpha` is the explicit reserved alias for the newest `-alpha*` release.

## Interaction with the version firewall

`LatestIncludesPrerelease` does **not** bypass Governance version lists.

If `VersionBlockList` contains `ALPHA`, an install of an alpha (including one reached via legacy `latest`) is still denied locally (**NVM4411**).

See [Version Firewall + Author Mirror](../features/author-mirror) and [Registry Policy Reference](../cfg/enterprise/registry).

## SIEM

Use the SIEM guide queries for:

- Hosts that resolved `latest` under legacy mode (`nvm.resolution.legacy_latest`)
- Installs with `ReleaseType=unstable` or `LatestMode=legacy`

See [SIEM Integration](./siem).

## Related

- [Version Resolution](./version-resolution) — `latest` vs `alpha`
- [Upgrading from v1](./upgrade-from-v1)
- [Registry Policy Reference](../cfg/enterprise/registry)
