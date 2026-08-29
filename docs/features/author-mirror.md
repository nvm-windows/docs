---
title: Version Firewall + Author Mirror
certified:
  edition: governance
---

# Version Firewall + Author Mirror

Governance builds can limit which Node.js versions install via a **local firewall** (static allow/block lists) and Author Software's **policy-aware Node.js mirror** at `https://mirror.author.io/runtime/nodejs` (lifecycle rules such as blocking end-of-life releases).

For everyday [`node_mirror`](../cfg/core#downloads-and-mirrors)/[`npm_mirror`](../cfg/core#downloads-and-mirrors) URLs and HTTP proxies, see [Download Mirrors](./mirrors).

## Firewall

The NVM for Windows local firewall honors version allow/block lists defined in your organization's security policies (see [governance edition registry keys](/cfg/registry#governance-keys)). **Static** entries are enforced on the client before any download starts whenever `nvm install <version>` runs. That local check works in air-gapped environments.

Lifecycle aliases such as `EOL` are not expanded by the local firewall; they are enforced when installs use the Author mirror (below).

For outbound firewall allow-lists, see [Requirements](../install/enterprise/requirements#proxy-exceptions). Full key types live in the [registry policy reference](../cfg/registry) and [basic configuration](../cfg/core).

## Author Mirror

The Author mirror adds another layer of protection against unapproved Node.js downloads. It enforces *dynamic policies* through rules, complementary to local allow/block lists.

:::warning[Connected Environments Only]
The Author mirror is not available in air-gapped environments.
:::

Point [`node_mirror`](../cfg/core#downloads-and-mirrors) / `MirrorNode` at Author's mirror service: `https://mirror.author.io/runtime/nodejs`

Allow outbound HTTPS to:

- `licensing.author.io` — license and verification keys
- `mirror.author.io` — Node archives

On Author hosts, NVM may send:

| Credential | Registry | Purpose |
|:-|:-|:-|
| Access token | `AccessToken` | `Authorization: Bearer …` on Author downloads; also used for license verification |
| Access key | `AccessKey` | Signs a short-lived mirror JWT (`X-Author-License`) on Governance |

Set these with portal scripts/policy, not everyday `nvm config docs` keys. If the only configured mirror is Author and auth fails, install fails with an authorization error. With multiple mirrors, NVM can fall through to the next URL after a failed attempt (unless the failure is a hard auth denial on a solo Author mirror).

:::warning[Fallback skips Author policy]
If `nodejs.org` (or another non-Author host) is later in [`node_mirror`](../cfg/core#downloads-and-mirrors), a failed Author request can fall through and download **without** Author lifecycle rules (`EOL`, hosted rulesets). Put Author first and omit public fallbacks when those rules must always apply.
:::

Optional: `ApplyVerboseLicenseMetadata` includes machine/user identity claims in mirror JWTs for auditing.

## Enforce Dynamic Policies

Dynamic policies are lifecycle aliases (i.e. `EOL`) that classify a range of versions. The Author mirror evaluates them when serving downloads. The same machine-policy lists that feed the [local firewall](#firewall) can also **seed** those aliases into the Author license JWT.

There are two (combinable) ways to enforce dynamic policies on the Author mirror.

### 1. From machine policy (JWT claims)

`VersionAllowList` / `VersionBlockList` (see [Governance registry keys](/cfg/registry#governance-keys)) do double duty:

- **Static entries** — enforced by the local firewall (above), before any download.
- **Dynamic aliases** (`EOL`, `ALPHA`, `MAINTENANCE`) — ignored by the local firewall; included in the short-lived license JWT sent only to `mirror.author.io`. The mirror applies those lifecycle rules when serving the archive.

| Policy entry | Local client | Author mirror (`mirror.author.io`) | Public mirror (`nodejs.org`) |
|:-|:-|:-|:-|
| `16.x` on block list | Denied before download | Not reached | Not reached |
| `EOL` on block list | Allowed locally (alias ignored) | Denied if version is end-of-life | No Author JWT — not enforced |
| Allow `20.x` only (no magic) | Non-20 denied locally | — | — |


```ini title="Example: Refuse end-of-life downloads via the Author mirror"
# Registry Keys
VersionBlockList=EOL
VersionAllowList=20.x
                 22.x
```

What this does:

1. **Locally:** `20.x` / `22.x` match the allow list. `EOL` is not expanded, so an end-of-life release is **not** stopped on the client by that alias alone. Because a dynamic alias is present, the allow list is also **not** treated as exclusive: other versions can still pass the local check.
1. **On `mirror.author.io`:** the client sends a license claim derived from these lists (including `NOT EOL`). The mirror rejects end-of-life archives.
1. **On `nodejs.org` (or any non-Author mirror):** no Author JWT — `EOL` does nothing. Put Author first in [`node_mirror`](../cfg/core#downloads-and-mirrors), or add static blocks (for example `16.x`) if you must enforce without the Author mirror.

Air-gapped/[`local_install_only`](../cfg/registry#available-registry-keys) installs never hit the mirror, so `EOL` is not enforced in local environments. Use static allow/block lists (or stage only approved archives).


### 2. Hosted Rules

Hosted rules are configured through the customer portal:

<img src="/img/features/proxy/mirror_ruleset_form.png" alt="Mirror Rulesets" style={{ display: 'block', width: '100%', height: 'auto', margin: '0 auto' }} />

These rules can be applied conditionally based on:

- IP Address Range(s)
- Geographic Location
- Domains (e.g. Active Directory Domain ID, Entra ID)
- User account/SID
- Assigned Access Key (License Group)

Rules matching your preferred conditions are applied to each request, providing fine-grained control over which versions are allowed to be downloaded.

:::tip[Working in a Regulated Environment?]
Organizations whose policies prevent storing any organization data on hosted services can disable hosted rules without impacting local rules processed by the mirror. Do this via the [Node Mirror configuration page](https://portal.author.io/nvm-windows/config).

**Highly regulated organizations, or those with very strict compliance policies, can request this feature be removed entirely.** [Contact us](mailto:support@author.io) if you wish to remove hosted rules entirely.
:::

## Local (and air-gapped) installs

| Config | Registry | Role |
|:-|:-|:-|
| [`local_dir`](../cfg/registry#available-registry-keys) | `LocalInstallDir` | Directory of pre-staged Node archives (+ checksums). Preferred over network when present. |
| [`local_install_only`](../cfg/registry#available-registry-keys) | `LocalInstallOnly` | If on, **never** download; fail when the version is missing locally. |

`AirGapped` is separate: it only forces **offline license JWKS** verification (`licensing.author.io` skipped). It does **not** by itself block Node downloads — use `LocalInstallOnly` (and/or remove remote mirrors) for install air-gaps. See [Local Installations](./local-installations) and [Air-gapped Installations](../guide/air-gapped-installations).

## Related

| Topic | Doc |
|:-|:-|
| Basic [`node_mirror`](../cfg/core#downloads-and-mirrors) / [`npm_mirror`](../cfg/core#downloads-and-mirrors) | [Download Mirrors](./mirrors) |
| HTTP proxies | [Download Mirrors](./mirrors#http-proxies) |
| User-facing config keys | [Basic Configuration](../cfg/core) |
| Policy keys and `.reg` sample | [Registry Policy Reference](../cfg/registry) |
| Firewall exceptions | [Requirements](../install/enterprise/requirements) |
| Edition capabilities | [Choosing an Edition](../guide/builds/) |
| Inspect mirrors/proxy | [`nvm env`](../command/env) |
