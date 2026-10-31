---
title: Download Mirrors
sidebar_position: 7
---

NVM for Windows downloads Node.js archives from one or more **Node mirrors**, and can fall back to one or more **npm registry** URLs in shim mode. Set these with [`nvm config`](../command/nvm/config) (or machine policy on certified fleets).

This page covers basic mirror URLs for Community Builds and Certified Builds. For HTTP(S) proxies (how traffic leaves the machine), see [HTTP Proxy](./http-proxy). For the Author policy-aware mirror _(Governance)_, see [Author Mirror](./author-mirror). For client version allow/deny lists, see [NVM Firewall](./firewall).

## Node.js mirrors

| Option | Registry | Default |
|--------|----------|---------|
| [`node_mirror`](../cfg/core#downloads-and-mirrors) | `MirrorNode` | https://nodejs.org/dist |

Used when `nvm install` (and related commands) need to fetch a Windows Node.js `.7z` and checksums, after any [local install](./local-installations)/[cache](./cache) miss.

In `nvm config`, pass one URL or a **comma-delimited** list. In the registry, store `MirrorNode` as **`REG_MULTI_SZ`** (one URL per entry).

```powershell
nvm config set node_mirror=https://nodejs.org/dist
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set node_mirror=https://npmmirror.com/mirrors/node,https://nodejs.org/dist
nvm config get node_mirror
```

Install resolution order:

1. Local archive source ([`local_dir`](../cfg/registry#available-registry-keys)/version cache) when present (see [Local Installations](./local-installations) and [Download Cache](./cache)).
2. Walk the ordered [`node_mirror`](../cfg/core#downloads-and-mirrors) list.
3. Stop at the **first successful** response.

Put the preferred mirror first. A public fallback is useful if the primary host is unreachable.

`nvm env` shows the effective mirror list after config and policy merge.

## npm registry mirrors

| Option | Registry | Default |
|--------|----------|---------|
| [`npm_mirror`](../cfg/core#downloads-and-mirrors) | `MirrorNpm` | https://registry.npmjs.org |

[`npm_mirror`](../cfg/core#downloads-and-mirrors) is **not** used to download Node.js installers. In **shim** mode it supplies a fallback npm (and related package-manager) registry URL when the user or project has not already set one.

Same list rules as Node mirrors: comma-delimited in `nvm config`; **`REG_MULTI_SZ`** for `MirrorNpm` in the registry.

```powershell
nvm config set npm_mirror=https://registry.npmjs.org
nvm config set npm_mirror=https://registry.npmmirror.com,https://registry.npmjs.org
nvm config get npm_mirror
```

Keep Node mirrors and npm registries as separate concerns.

## Related

| Topic | Doc |
|-------|-----|
| Full preference table | [Basic Configuration](../cfg/core#downloads-and-mirrors) |
| HTTP(S) proxy | [HTTP Proxy](./http-proxy) |
| Policy/`.reg` types | [Registry Policy Reference](../cfg/registry) |
| Author Mirror | [Author Mirror](./author-mirror) |
| NVM Firewall | [NVM Firewall](./firewall) |
| Offline archives | [Air-gapped Installations](../guide/air-gapped-installations) |
