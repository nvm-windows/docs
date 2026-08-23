---
title: Download Mirrors
sidebar_position: 9
---

NVM for Windows downloads Node.js archives from one or more **Node mirrors**, and can fall back to one or more **npm registry** URLs in shim mode. Set these with [`nvm config`](../command/config) (or machine policy on certified fleets).

This page covers basic mirror URLs and HTTP proxies available to Community and certified builds. For the Author policy-aware mirror and version firewall _(Governance)_, see [Version Firewall + Author Mirror](./author-mirror).

## Node.js mirrors

| Option | Registry | Default |
|--------|----------|---------|
| `node_mirror` | `MirrorNode` | https://nodejs.org/dist |

Used when `nvm install` (and related commands) need to fetch a Windows Node.js `.7z` and checksums, after any [local install](./local-installations)/[cache](./cache) miss.

In `nvm config`, pass one URL or a **comma-delimited** list. In the registry, store `MirrorNode` as **`REG_MULTI_SZ`** (one URL per entry).

```powershell
nvm config set node_mirror=https://nodejs.org/dist
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set node_mirror=https://npmmirror.com/mirrors/node,https://nodejs.org/dist
nvm config get node_mirror
```

Install resolution order:

1. Local archive source (`local_dir`/version cache) when present (see [Local Installations](./local-installations) and [Download Cache](./cache)).
2. Walk the ordered `node_mirror` list.
3. Stop at the **first successful** response.

Put the preferred mirror first. A public fallback is useful if the primary host is unreachable.

`nvm env` shows the effective mirror list after config and policy merge.

## npm registry mirrors

| Option | Registry | Default |
|--------|----------|---------|
| `npm_mirror` | `MirrorNpm` | https://registry.npmjs.org |

`npm_mirror` is **not** used to download Node.js installers. In **shim** mode it supplies a fallback npm (and related package-manager) registry URL when the user or project has not already set one.

Same list rules as Node mirrors: comma-delimited in `nvm config`; **`REG_MULTI_SZ`** for `MirrorNpm` in the registry.

```powershell
nvm config set npm_mirror=https://registry.npmjs.org
nvm config set npm_mirror=https://registry.npmmirror.com,https://registry.npmjs.org
nvm config get npm_mirror
```

Keep Node mirrors and npm registries as separate concerns.

## HTTP proxies

Corporate networks often require an HTTP(S) proxy between NVM and the mirror. Resolve order:

1. Explicit `proxy`/`Proxy` setting (policy or config)
2. Process environment (`HTTP_PROXY`, `HTTPS_PROXY`, etc.)
3. Internet Explorer/WinINET system proxy settings

| Config | Registry | Notes |
|:-|:-|:-|
| `proxy` | `Proxy` | Proxy URL, e.g. `http://proxy.example.corp:8080` |
| `proxy_auth` | `ProxyAuth` | `user:pass` or `Bearer YOUR_TOKEN` — stored **in plain text** |
| `proxy_auth_type` | `ProxyAuthType` | `basic`, `bearer`, `ntlm`, `negotiate`, or `ntlm,negotiate` |

| Capability | Community | Certified (Distribution/Audit) | Governance |
|:-|:-:|:-:|:-:|
| Proxy URL | ✓ | ✓ | ✓ |
| Basic/Bearer auth | limited* | ✓ | ✓ |
| IWA (NTLM/Negotiate, current user) | — | — | ✓ |
| PAC/WPAD (WinHTTP) | — | — | ✓ |

\*Community may embed credentials in the proxy URL; dedicated `ProxyAuth*` injection is a certified path.

:::warning[ProxyAuth in the registry]
`ProxyAuth` is plain text under policy/preferences. Use IWA (`ntlm`/`negotiate`) when regulations disallow stored passwords.
:::

:::info[No Digest or Browser Proxies]
Digest auth is not supported due to its extensive requirements and minimal real-world usage.

No interactive SAML/OIDC browser login capabilities exist for captive portals. Consider using PAC instead.
:::

## Related

| Topic | Doc |
|-------|-----|
| Full preference table | [Basic Configuration](../cfg/core#downloads-and-mirrors) |
| Policy/`.reg` types | [Registry Policy Reference](../cfg/registry) |
| Author mirror & version firewall | [Version Firewall + Author Mirror](./author-mirror) |
| Offline archives | [Air-gapped Installations](../guide/air-gapped-installations) |
