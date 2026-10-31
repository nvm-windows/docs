---
title: Aliases
sidebar_label: Aliases
sidebar_position: 11.5
---

# Aliases

An alias is a short name you invent for a concrete Node.js version.
Instead of typing `20.19.1` everywhere, you can say `legacy` — then use that name with install, use, uninstall, and the other version commands.

Reserved names such as `latest` and `lts` are built into NVM for Windows.
You cannot create an alias with those names.
See [Version Resolution](../guide/version-resolution) for how reserved names and your aliases are resolved.

## Why use aliases

- Give a stable label to the version your team treats as “current LTS for apps” or “legacy CI”
- Retarget the label when you upgrade (`nvm alias add modern 24.11.0`) without rewriting every script
- Keep everyday commands short: `nvm use modern` instead of a full semver

## Create and use an alias

Install a version (if you do not already have it), then name it:

```powershell
nvm install 20.19.1
nvm alias add legacy 20.19.1
```

```text
"legacy" now refers to v20.19.1
```

Use the alias anywhere a version specifier is accepted:

```powershell
nvm use legacy
nvm install legacy
nvm uninstall legacy
```

List what you have defined:

```powershell
nvm alias list
```

```text
legacy -> v20.19.1
```

Update an existing name by adding it again (you may be prompted to confirm; `--silent` skips the prompt):

```powershell
nvm alias add legacy 22.14.0 --silent
```

Remove names you no longer need:

```powershell
nvm alias remove legacy
nvm alias remove legacy modern
```

```text
1 alias removed successfully.
```

Full command reference: [`nvm alias`](../command/nvm/alias/).

## Everyday examples

```powershell
# Name the Node versions you switch between most
nvm alias add apps 22.14.0
nvm alias add tools 24.11.0

nvm use apps
node -v
# v22.14.0

nvm use tools
node -v
# v24.11.0

# Scripts and docs can say "use apps" instead of a pinned semver
nvm use apps
npm test
```

Partial versions are fine when you create the alias — they are stored as a concrete release:

```powershell
nvm alias add next 24
nvm alias list next
```

```text
next -> v24.11.0
```

(Exact patch depends on what was newest matching `24` when you ran `alias add`.)

## Names you cannot use

| Name | Why |
|:-|:-|
| `default`, `current`, `latest`, `lts`, `last` | Built-in command semantics |
| `daily`, `alpha`, `beta`, `prerelease` | Reserved for future use |
| `link`, `shim` | Operating mode names |
| `lts/*` (for example `lts/iron`) | Reserved LTS namespace |

Pick names like `legacy`, `apps`, `ci`, or `stable24` instead.

## Fleet policy (Governance)

On Governance fleets, administrators can set the `Aliases` machine-policy list (`alias=version` per entry).
When that policy is set, it owns the alias map and blocks user-defined aliases from `nvm alias`.

See [Administrative Templates](ad), [Registry Policy Reference](registry), and [Governance](../features/certified-builds/governance).

## Related

- [`nvm alias`](../command/nvm/alias/) — add, list, and remove
- [Version Resolution](../guide/version-resolution) — how aliases, `lts`, and project files resolve
- [Command workflows](../guide/command-workflows) — aliases in day-to-day use
