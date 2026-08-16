---
sidebar_position: 1
certified:
  edition: governance
---

# Configure Policies

Phase 3: enforce NVM for Windows settings after the application is [installed](../../../install/installers).

Common policy goals:

- Corporate proxies (IWA/PAC/WPAD on Governance; basic/bearer on all certified editions) for Node.js downloads
- Block unapproved or EOL Node.js versions
- npm/yarn/pnpm package cooldown periods
- Shim-only controls (audit logging, auto-detect, code signer trust)
- Air-gapped installs via local mirrors

## By platform

|Platform|Guide|
|:-|:-|
|Microsoft Intune / Entra|[Administrative Templates](../../../cfg/ad#intune-policy-configuration)|
|Active Directory GPO|[Administrative Templates](../../../cfg/ad#group-policy-gpo-deployment)|
{/* |Microsoft Endpoint Configuration Manager|[MECM](mecm)| */}
{/* |Google Workspace|[Google Workspace](google-workspace)| */}


![alt text](/img/guide/deploy/policy/image.png)
## Reference

|Resource|Guide|
|:-|:-|
|All registry keys and values|[Central Registry Reference](../../../cfg/registry)|
|ADMX policy tree (GPO and Intune)|[Administrative Templates](../../../cfg/ad)|

Policy values deploy to `HKLM\Software\Policies\Author Software\nvm` unless noted in the registry reference.
