---
certified:
  edition: governance
---

# Download Mirror & Firewall

NVM for Windows provides a local firewall and download  proxy for limiting which versions of Node.js can be downloaded. This enables organizations to block end-of-life Node.js versions, vulnerable versions, or limit access to approved legacy versions.

## Firewall

The NVM for Windows local firewall honors version Allow/Deny lists defined in your organization's security policies (see [governance edition registry keys](/cfg/registry#governance-edition-keys)). These policies are enforced locally, before the version download begins, whenever `nvm install <version>` is executed.

The local firewall works in airgapped environments.

## Secure Mirror

The secure mirror, available at `https://mirror.author.io/runtime/nodejs`, adds another layer of protection against unapproved Node.js downloads. The mirror enforces *dynamic policies* through rules, complementary to local allow/block lists.

:::warning[Connected Environments Only]
The secure mirror is not available in airgapped environments.
:::

### Dynamic Policies

Dynamic policies are rules with aliases representing a range of versions. For example, the `EOL` (end-of-life) alias automatically determines whether the requsted Node.js version is maintained or not.

There are two (combinable) ways to enforce these policies.

### 1. Hosted Rules

Hosted rules are configured through the customer portal:

<img src="/img/features/proxy/mirror_ruleset_form.png" alt="Mirror Rulesets" style={{ display: 'block', width: '100%', height: 'auto', margin: '0 auto' }} />

These rules can be applied conditionally based on:

- IP Address Range(s)
- Geographic Location
- Domains (e.g. Active Directory Domain ID, Entra ID)
- User account/SID
- Assigned Access Key (License Group)

Rules matching your prefered conditions are applied to each request, proving fine-grained control over which versions are allowed to be downloaded.

:::tip[Working in a Regulated Environment?]
Organizations whose policies prevent storing any organization data on hosted services can disable hosted rules without impacting local rules processed by the mirror. Do this via the [Node Mirror configuration page](https://portal.author.io/nvm-windows/config).

**Highly regulated organizations, or those with very strict compliance policies, can request this feature be removed entirely.** [Contact us](https://portal.author.io/contact) if you wish to remove hosted rules entirely.
:::

### 2. Local Rules

Local rules are defined in your custom policies (see [governance edition registry keys](/cfg/registry#governance-edition-keys)). These rules are hosted within your own environment, not the mirror server.

Dynamic aliases (like `EOL`) can be included in local policies, but are only enforced on the author.io mirror servers.

For example, if a user attempts to install Node.js version 16, the local firewall may

## Firewall

NVM for Windows certified governance edition provides a local firewall

NVM for Windows downloads Node.js archives from one or more **mirrors**, optionally through an HTTP **proxy**. On certified Governance builds, Author Software also hosts a policy-aware mirror that can restrict which versions your fleet may fetch.

For firewall allow-lists, see [Requirements](../install/enterprise/requirements#proxy-exceptions). Full key types live in the [registry policy reference](../cfg/registry) and [basic configuration](../cfg/core).

## How Node.js mirrors work

When you run `nvm install` (or other commands that need a remote dist index), NVM for Windows:

1. Checks the local download cache / [`LocalInstallDir`](../cfg/registry) first (if configured).
2. Otherwise walks the ordered **Node mirror** list.
3. For each mirror, requests checksums and the Windows `.7z` (or uses `index.tab` when listing/resolving versions).
4. Stops at the **first successful** mirror response.

|Config|Registry|Default|
|:-|:-|:-|
|`node_mirror`|`MirrorNode`|`https://nodejs.org/dist`|

Mirrors are comma-delimited (user config) or multi-string (policy). Example policy value:

```text
https://mirror.author.io/runtime/nodejs
https://nodejs.org/dist
```

Put the preferred mirror first. A public fallback is useful if the primary host is unreachable.

:::info[Community vs certified]
Community builds use public/third-party mirrors only (for example `nodejs.org` or a corporate cache you host yourself). They do not send Author Software license headers.

Certified builds can use Author `*.author.io` mirrors. Those hosts expect licensing credentials (below).
:::

### Author Software Node.js mirror

Governance (and Custom) editions can point `MirrorNode` at Author’s Node distribution service (`https://mirror.author.io/runtime/nodejs`).

That mirror can enforce **which Node.js versions** your license/org may download — complementary to local allow/block lists (`VersionAllowList` / `VersionBlockList`).

Allow outbound HTTPS to:

- `licensing.author.io` — license and verification keys
- `mirror.author.io` — Node archives (if you use the Author mirror)

On Author hosts, NVM may send:

|Credential|Registry|Purpose|
|:-|:-|:-|
|Access token|`AccessToken`|`Authorization: Bearer …` on Author downloads; also used for license verification|
|Access key|`AccessKey`|Signs a short-lived mirror JWT (`X-Author-License`) on Governance|

Set these with portal scripts / policy — not everyday `nvm config docs` keys. If the only configured mirror is Author and auth fails, install fails with an authorization error. With multiple mirrors, NVM can fall through to the next URL after a failed attempt (unless the failure is a hard auth denial on a solo Author mirror).

Optional: `ApplyVerboseLicenseMetadata` includes machine/user identity claims in mirror JWTs for auditing.

### Local / air-gapped installs

|Config|Registry|Role|
|:-|:-|:-|
|`local_dir`|`LocalInstallDir`|Directory of pre-staged Node archives (+ checksums). Preferred over network when present.|
|`local_install_only`|`LocalInstallOnly`|If on, **never** download; fail when the version is missing locally.|

`AirGapped` is separate: it only forces **offline license JWKS** verification (`licensing.author.io` skipped). It does **not** by itself block Node downloads — use `LocalInstallOnly` (and/or remove remote mirrors) for install air-gaps.

## How HTTP proxies work

Corporate networks often require an HTTP(S) proxy between NVM and the mirror. Resolve order:

1. Explicit `proxy` / `Proxy` setting (policy or config)
2. Process environment (`HTTP_PROXY`, `HTTPS_PROXY`, etc.)
3. Internet Explorer / WinINET system proxy settings

|Config|Registry|Notes|
|:-|:-|:-|
|`proxy`|`Proxy`|Proxy URL, e.g. `http://proxy.example.corp:8080`|
|`proxy_auth`|`ProxyAuth`|`user:pass` or `Bearer YOUR_TOKEN` — stored **in plain text**|
|`proxy_auth_type`|`ProxyAuthType`|`basic`, `bearer`, `ntlm`, `negotiate`, or `ntlm,negotiate`|

|Capability|Community|Certified (Distribution/Audit)|Governance|
|:-|:-:|:-:|:-:|
|Proxy URL|✓|✓|✓|
|Basic / Bearer auth|limited*|✓|✓|
|IWA (NTLM / Negotiate, current user)|—|—|✓|
|PAC / WPAD (WinHTTP)|—|—|✓|

\*Community may embed credentials in the proxy URL; dedicated `ProxyAuth*` injection is a certified path.

:::warning[ProxyAuth in the registry]
`ProxyAuth` is plain text under policy/preferences. Prefer IWA (`ntlm` / `negotiate`) on Governance when regulations disallow stored passwords.
:::

No Digest auth. No interactive SAML/OIDC browser login for captive portals. For verbose proxy diagnostics, set `NVM_VERBOSE_LOGS=true`.

## npm registry mirrors

|Config|Registry|Default|
|:-|:-|:-|
|`npm_mirror`|`MirrorNpm`|`https://registry.npmjs.org`|

`npm_mirror` is **not** used to download Node.js `.7z` installers. In shim mode it supplies a fallback npm (and related) registry URL when the user/project has not already set one. Keep Node mirrors and npm registries as separate concerns.

## Related

|Topic|Doc|
|:-|:-|
|User-facing config keys|[Basic Configuration](../cfg/core)|
|Policy keys and `.reg` sample|[Registry Policy Reference](../cfg/registry)|
|Firewall exceptions|[Requirements](../install/enterprise/requirements)|
|Edition capabilities|[Choosing an Edition](../guide/builds/)|
|Inspect mirrors/proxy|[`nvm env`](../command/env)|
