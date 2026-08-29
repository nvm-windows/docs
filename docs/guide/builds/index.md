# Choosing an Edition

This guide details the differences between NVM for Windows community builds and certified builds, to help readers choose the option best suited for them.

|Type|Audience|License|Availability|
|:-|:-:|:-:|:-|
|Community&nbsp;Build|Individuals|MIT|[nvm-windows.com](https://nvm-windows.com) or [github.com/nvm-windows](https://github.com/nvm-windows/nvm/releases)|
|Certified&nbsp;Build|Organizations|EULA|September 2026 via [Customer Portal](https://portal.author.io)|

## Community Builds

Community builds are designed for individual developers. They contain the full application with all features. They do not contain capabilities for centralized management. These builds are released using an open source `.exe` installer.

:::warning[Community Builds Are Not Code-Signed]
NVM for Windows v2 *community builds are not code-signed*. They may be subject to the Windows SmartScreen filter. NVM for Windows v1 has maintained a high reputation score with Microsoft for over a decade, but you may still see the SmartScreen filter during installation/upgrade.

_Example:_

![Example SmartScreen Filter](/img/guide_smartscreen.png)
:::

## Certified Builds

Certified builds are designed for teams and organizations who need to centralize software distribution, audit activity, comply with regulations, & enforce usage/security policies. These builds deliver the same application while adding meaningful management capabilities. Distribution will be through the [Customer Portal](https://portal.author.io).

### Key additions

- **EV code-signed binaries**
- **Deployment-ready installers** (Intune/MSI + Powershell Scripts)
- **Financially-backed** (Author Software Inc)

Additional capabilties are available as add-ons:

|Add-on|Capabilities|
|:-|:-|
|**Advanced&nbsp;Logging**|Structured logging for SIEM integration.|
|**Trust&nbsp;Artifacts**|SBOM, provenance, and VEX reports.|
|**Governance**|Central policy management (ADMX/ADML + GPO/Entra scripts), advanced proxy support (IWA, WPAD/PAC), Node.js mirror (mirror.author.io), version firewall, shim-enforced Node.js permissions, unified package manager cooldown (npm/pnpm/yarn), and air-gap/local installations.|

### Code Signing Authority

NVM for Windows is distributed by Author Software Inc. Our EV code signing certificates are issued directly by Microsoft.

:::note[Stewardship Transition]
Early versions of NVM for Windows v1 were code-signed by Ecor Ventures LLC using certificates issued by Sectigo. In January 2025, project stewardship was transitioned to Author Software Inc.

This transition was authorized by Corey Butler, the creator of NVM for Windows. He is the founder & Managing Director of Ecor Ventures LLC and the co-founder of Author Software Inc.
:::

### Auditing & Observability

Both editions have native Windows Application logging with plaintext log entries using generic event codes. While these can be consumed by log aggregators, they are designed for developer reference, not auditing/observability.

The Advanced Logging package for certified builds introduce comprehensive *structured* logging with a dedicated native log. Log entries are specifically designed for direct export to central SIEM systems.

Structured logs allow SIEM systems to capture and query events with far greater precision and predictability. For example, an SIEM query can quickly identify which versions of Node.js are still regularly used by developers/agents in your organization, when unsupported/EOL versions are installed or finally uninstalled, or which npm modules are installed most often.

### Trust Artifacts

The **Trust Artifacts** add-on provides supply-chain materials with certified releases — for example SBOM, provenance, and VEX reports — so security and procurement teams can review what ships in each build without treating those materials as a separate “Compliance” product tier.

### Policy Management

The Governance package for certified builds introduce policy management. With these capabilities, it is possible to enforce security policies. For example:

- Utilize corporate proxies (IWA, PAC/WPAD).
- Block unapproved Node.js Versions (i.e. EOL, vulnerable, or unstable versions).
- Require custom npm/yarn/pnpm cooldown periods.
- Enforce Node.js permission model (`--permission` / `--experimental-permission`) so each `node.exe` starts default-deny; apps must pass `--allow-*` at runtime.
- Freeze V8 intrinsics (`--frozen-intrinsics`) to prevent prototype pollution of built-ins.
- Disallow `eval()` / `new Function()` (`--disallow-code-generation-from-strings`).
- Limit to local installations (airgapping).
- Restrict version installations (ex: lts/non-EOL/non-ALPHA) with the version firewall.

Governance builds ship with ADMX/ADML files and official scripts to support Microsoft Active Directory group policies, Microsoft Entra, and other device management platforms.

:::tip[Policy-Enforced Node.js Mirror]
Certified governance builds include access to Author Software's Node.js mirror/proxy. This service provides policy enforcement at the mirror level, for restricting which Node.js versions can be downloaded by users.

The mirror is only accessible through NVM for Windows, allowing organizations to block nodejs.org/dist while granting gated access to approved versions.
:::

### Enterprise Agreements

Certified custom builds do not provide additional technical capabilites beyond those in the governenace build. Custom agreements are for organizations that need EULA redlining, additional compliance documentation, additional named insured, invoicing, onboarding support, and/or other services. For more information, contact support@author.io.
