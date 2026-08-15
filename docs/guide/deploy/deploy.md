---
sidebar_position: 2
certified: true
---

# Enterprise Deployment

Certified builds are deployed in five phases. Complete each phase in order for your platform.

|Phase|Guide|What you do|
|:-|:-|:-|
|1. Prerequisites|[Requirements](requirements)|[Download](https://portal.author.io) media, verify OS/proxy/network.|
|2. Install|[Install](install)|Deploy NVM for Windows via Intune, GPO, MECM, Google Workspace, or manually.|
|3. Configure policies|[Configure policies](policy/)|Enforce NVM settings (ADMX, registry CSP, compliance baselines).|
|4. Operate & maintain|[Operate & maintain](operations/)|Monitor logs, manage updates, stay compliant.|
|5. Uninstall|[Uninstall](uninstall)|Remove NVM for Windows from managed devices.|

## Choose your platform

|Platform|Install|Policies|
|:-|:-|:-|
|Microsoft Intune|[Install → Intune](install#using-intune)|[Administrative Templates](policy/administrative-templates#intune-policy-configuration)|
|Active Directory GPO|[Install → GPO](install#active-directory-gpo)|[Administrative Templates](policy/administrative-templates#group-policy-gpo-deployment)|
|Microsoft Endpoint Configuration Manager (MECM)|[Install → MECM](install#microsoft-endpoint-configuration-manager)|[MECM](policy/mecm)|
|Google Workspace|[Install → Google Workspace](install#google-workspace)|[Google Workspace](policy/google-workspace)|
|Manual|[Install → Manual](install#manual-installation)|[Registry reference](policy/registry)|

All policy keys and registry types are documented in the [Central Registry Reference](policy/registry).

Download deployment packs from the [customer portal](https://portal.author.io).
