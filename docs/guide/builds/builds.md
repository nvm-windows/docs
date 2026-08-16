# Choosing an Edition

This guide details the differences between NVM for Windows community builds and certified builds, to help readers choose the option best suited for them.

|Type|Audience|License|Availability|
|:-|:-:|:-:|:-|
|Community Build|Individuals|MIT|[nvm-windows.com](https://nvm-windows.com) or [github.com/nvm-windows](https://github.com/nvm-windows/nvm/releases)|
|Certified Builds|Organizations|EULA|[Customer Portal](https://portal.author.io)|

## Community Builds

Community builds are designed for individuals. They contain the full application with all features. They do not contain capabilities for centralized management. These builds are released using an open source `.exe` installer.

:::warning[Notice to NVM for Windows v1 Users]
NVM for Windows v2 community builds are *not code-signed*. NVM for Windows has maintained a high reputation score with Microsoft for over a decade, but community users may still see the SmartScreen filter during installation/upgrade.

_Example:_

![Example SmartScreen Filter](/img/guide_smartscreen.png)
:::

## Certified Builds

Certified builds are designed for teams and organizations who need to centralize software distribution, audit activity, comply with regulations, & enforce usage/security policies. These builds deliver the same application while adding meaningful management capabilities. Certified builds are available on [nvm-windows.com](https://nvm-windows.com).

### Capability Comparison

||Distribution|Audit|Governance|Custom|
|:-|:-:|:-:|:-:|:-:|
|**Code Signed**|✓|✓|✓|✓|
|**Auditing & Observability**||✓|✓|✓|
|**Policy Management**|||✓|✓|
|**Enterprise Agreements**||||✓|

All certified builds are distributed as `.msi`/`intunewin` files. These are designed for deploying NVM for Windows through Microsoft Entra, Active Directory (AD), or manually.
{/* Microsoft Endpoint Configuration Manager (MECM) and Google Workspace support are planned. */}

### Code Signing Authority

NVM for Windows is distributed by Author Software Inc. Our EV code signing certificates are issued directly by Microsoft.

:::note[Stewardship Transition]
Early versions of NVM for Windows v1 were code-signed by Ecor Ventures LLC using certificates issued by Sectigo. In January 2025, project stewardship was transitioned to Author Software Inc.

This transition was authorized by Corey Butler, the creator of NVM for Windows. He is the founder & Managing Director of Ecor Ventures LLC and the co-founder of Author Software Inc.
:::

### Auditing & Observability

All editions have native logging, but they are designed with different intended uses. Community and certified distribution builds utilize the native Windows Application log with plaintext log entries. While these can be consumed by log aggregators, basic logs are designed for developer reference, not auditing/observability.

Certified audit builds introduce comprehensive *structured* logging with a dedicated native log. Log entries are specifically designed for direct export to central SIEM systems.

Structured logs allow SIEM systems to capture and query events with far greater precision and predictability. For example, an SIEM query can quickly identify which versions of Node.js are still regularly used by developers/agents in your organization, when unsupported/EOL versions are finally uninstalled, or which npm modules are installed most often.

### Policy Management

Certified governance builds introduce policy management. With these builds, it is possible to enforce security policies. For example:

- Utilize corporate proxies (IWA, PAC/WPAD on Governance; basic/bearer on all certified editions).
- Block unapproved Node.js Versions (i.e. EOL or vulnerable versions).
- Require custom npm/yarn/pnpm cooldown periods.
- Enforce Node.js permission model (`--permission` / `--experimental-permission`) so each `node.exe` starts default-deny; apps must pass `--allow-*` at runtime.
- Freeze V8 intrinsics (`--frozen-intrinsics`) to prevent prototype pollution of built-ins.
- Disallow `eval()` / `new Function()` (`--disallow-code-generation-from-strings`).
- Limit to local installations (airgapping).

Governance builds ship with ADMX/ADML files and official scripts to support Microsoft Active Directory group policies, Microsoft Entra, and other device management platforms.

:::tip[Policy-Enforced Node.js Mirror]
Certified governance builds include access to Author Software's Node.js mirror/proxy. This service provides policy enforcement at the mirror level, for restricting which Node.js versions can be downloaded by users.
:::

### Enterprise Agreements

Certified custom builds do not provide additional technical capabilites beyond those in the governenace build. Custom agreements are for organizations that need EULA redlining, additional compliance documentation, additional named insured, invoicing, onboarding support, and/or other services. For more information, contact support@author.io.
