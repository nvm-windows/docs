---
title: HTTP Proxy
sidebar_label: HTTP Proxy
sidebar_position: 9.5
---

Corporate networks often require an HTTP(S) proxy between NVM for Windows and the internet.
The proxy applies to download traffic: Node.js archives, catalogs, and related HTTPS calls.
It is separate from [Download Mirrors](./mirrors), which set *where* archives come from.

Community Builds and Certified Builds support a basic proxy URL.
Basic and Bearer auth are Certified Builds paths.
IWA (NTLM/Negotiate) and PAC/WPAD need the [Governance](./certified-builds/governance) add-on.

## Resolve order

1. Explicit [`proxy`](../cfg/core#proxy) / `Proxy` setting (policy or config)
1. Process environment (`HTTP_PROXY`, `HTTPS_PROXY`, and related variables)
1. Internet Explorer / WinINET system proxy settings

## Configuration

| Config | Registry | Notes |
|:-|:-|:-|
| [`proxy`](../cfg/core#proxy) | `Proxy` | Proxy URL, e.g. `http://proxy.example.corp:8080` |
| [`proxy_auth`](../cfg/registry#available-registry-keys) | `ProxyAuth` | `user:pass` or `Bearer YOUR_TOKEN` — stored **in plain text** |
| [`proxy_auth_type`](../cfg/registry#available-registry-keys) | `ProxyAuthType` | `basic`, `bearer`, `ntlm`, `negotiate`, or `ntlm,negotiate` |

```powershell
nvm config set proxy=http://proxy.example.corp:8080
nvm config get proxy
```

On Certified Builds fleets, set proxy keys with machine policy. See [Registry Policy Reference](../cfg/registry).

## Capabilities by license \{#capabilities-by-license}

| Capability | Community Builds | Certified Builds | Governance |
|:-|:-:|:-:|:-:|
| Proxy URL | ✓ | ✓ | ✓ |
| Basic/Bearer auth | limited* | ✓ | ✓ |
| IWA (NTLM/Negotiate, current user) | :x: | :x: | ✓ |
| PAC/WPAD (WinHTTP) | :x: | :x: | ✓ |

\*Community Builds may embed credentials in the proxy URL. Dedicated `ProxyAuth*` injection is a Certified Builds path.

:::warning[ProxyAuth in the registry]
`ProxyAuth` is plain text under policy and preferences. Use IWA (`ntlm` / `negotiate`) when regulations disallow stored passwords.
:::

:::info[No Digest or browser proxies]
Digest auth is not supported. Requirements are large and real-world use is rare.

NVM for Windows has no interactive SAML/OIDC browser login for captive portals. Use PAC when that is the corporate path.
:::

## Related

- [Download Mirrors](./mirrors) — Node.js and npm registry URLs
- [Author Mirror](./author-mirror) — Governance policy-aware download host
- [Basic Configuration](../cfg/core#proxy) — `proxy` preference
- [Registry Policy Reference](../cfg/registry) — `Proxy`, `ProxyAuth`, `ProxyAuthType`
- [Governance](./certified-builds/governance) — IWA and PAC/WPAD
- [Enterprise requirements](../install/enterprise/requirements#proxy-exceptions) — outbound allow-lists
