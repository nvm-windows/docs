---
sidebar_position: 2
certified: true
---

# Enterprise Deployment

Certified builds are deployed in five phases. Complete each phase in order for your platform.

|Phase|Guide|What you do|
|:-|:-|:-|
|1. Prerequisites|[Requirements](../../install/enterprise/requirements)|[Download](https://portal.author.io) media, verify OS/proxy/network.|
|2. Install|[Installers](../../install/installers)|Deploy NVM for Windows via Intune, GPO, or manually.|
|3. Configure policies|[Configure policies](policy/)|Enforce NVM settings (ADMX, registry CSP, compliance baselines).|
|4. Operate & maintain|[Operate & maintain](operations/)|Monitor logs, manage updates, stay compliant.|
|5. Uninstall|[Uninstall](../../install/uninstall)|Remove NVM for Windows from managed devices.|

## Choose your platform

|Platform|Install|Policies|
|:-|:-|:-|
|Microsoft Intune|[Install → Intune](../../install/enterprise/intune)|[Administrative Templates](../../cfg/ad#intune-policy-configuration)|
|Active Directory GPO|[Install → GPO](../../install/enterprise/ad)|[Administrative Templates](../../cfg/ad#group-policy-gpo-deployment)|
{/* |Microsoft Endpoint Configuration Manager (MECM)|[Install → MECM](../../install/enterprise/mecm)|[MECM](policy/mecm)| */}
{/* |Google Workspace|[Install → Google Workspace](install#google-workspace)|[Google Workspace](policy/google-workspace)| */}
|Manual|[Install → Manual](../../install/installers)|[Registry reference](../../cfg/registry)|

All policy keys and registry types are documented in the [Central Registry Reference](../../cfg/registry).

Download deployment packs from the [customer portal](https://portal.author.io).
