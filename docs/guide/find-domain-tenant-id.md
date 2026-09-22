---
title: Find Your AD Domain or Entra Tenant ID
sidebar_label: Find Domain / Tenant ID
sidebar_position: 4
certified:
  edition: governance
---

# Find Your AD Domain or Entra Tenant ID

Governance hosted rules on the [Author mirror](../features/author-mirror#hosted-rules) can match devices by **domain identity**. Use the values below when the portal asks for an Active Directory domain ID or a Microsoft Entra tenant ID.

| Environment | Value to enter | Typical format |
|:-|:-|:-|
| On-premises Active Directory | **Domain SID** | `S-1-5-21-…` |
| Microsoft Entra ID (Azure AD) | **Tenant ID** | GUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) |
| Hybrid joined | Both (as needed) | Domain SID **and** Tenant ID |

:::tip[Which value do I need?]
- **GPO / on-prem AD only** → Domain SID
- **Entra-joined / Intune-only** → Tenant ID
- **Hybrid joined** → often both; enter the ID that matches how you scope the rule
:::

## Active Directory domain ID (Domain SID)

The Author portal expects the **domain security identifier (SID)**, not the DNS name (`contoso.local`) and not the NetBIOS name (`CONTOSO`).

### From a domain-joined Windows PC

Run PowerShell as a domain user (RSAT not required):

```powershell
# Domain SID = user SID without the final RID
$userSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$domainSid = $userSid.Substring(0, $userSid.LastIndexOf('-'))
$domainSid
```

If RSAT Active Directory tools are installed:

```powershell
(Get-ADDomain).DomainSID.Value
```

Other quick checks:

```powershell
# USERDOMAIN is the NetBIOS name — useful to confirm you are on the right domain,
# but do not paste this into the portal as the domain ID
$env:USERDOMAIN

whoami /user
# The SID after the domain\user prefix shares the same S-1-5-21-…-…-… prefix as the domain SID
# (drop the final RID, e.g. -500 for Administrator)
```

### From Active Directory Users and Computers / PowerShell on a DC

1. Open **Active Directory Users and Computers**.
1. Enable **View** → **Advanced Features**.
1. Right-click the domain root → **Properties** → **Attribute Editor**.
1. Find `objectSid` — that is the domain SID.

Or on a domain controller / machine with RSAT:

```powershell
Import-Module ActiveDirectory
(Get-ADDomain).DNSRoot
(Get-ADDomain).DomainSID.Value
```

### Example

```text
S-1-5-21-3623811015-3361044348-30300820
```

Paste the full `S-1-5-21-…` string into the portal domain field.

## Microsoft Entra tenant ID

The Author portal expects the Entra **Directory (tenant) ID** GUID — not the tenant domain name (`contoso.onmicrosoft.com`) and not an application (client) ID.

### From the Microsoft Entra admin center

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. Go to **Identity** → **Overview** (or search for **Tenant properties**).
1. Copy **Tenant ID**.

### From the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open **Microsoft Entra ID** → **Overview**.
1. Copy **Tenant ID**.

### From Microsoft Graph / Azure PowerShell

```powershell
# Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Organization.Read.All"
(Get-MgOrganization).Id

# Azure Az module
Connect-AzAccount
(Get-AzContext).Tenant.Id
```

### From an Entra-joined Windows PC (local registry)

On a device that is Entra-joined (or hybrid joined), Windows caches the tenant ID:

```powershell
$join = Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Control\CloudDomainJoin\JoinInfo' -ErrorAction SilentlyContinue |
  Select-Object -First 1
if ($join) {
  (Get-ItemProperty $join.PSPath).TenantId
}
```

:::note[Permissions]
Reading `CloudDomainJoin\JoinInfo` usually needs local admin (or an elevated session). Prefer the Entra / Azure portal if you do not have admin rights on the device.
:::

### Example

```text
72f988bf-86f1-41af-91ab-2d7cd011db47
```

## Hybrid joined devices

Hybrid joined machines have **both** an on-prem Domain SID and an Entra Tenant ID. Hosted rules can key off either identity depending on how you configure the match.

To confirm join state on a workstation:

```powershell
dsregcmd /status
```

Look under **Device State** for `AzureAdJoined`, `DomainJoined`, and `WorkplaceJoined`.

## Related

| Topic | Doc |
|:-|:-|
| Hosted mirror rules (domain conditions) | [Version Firewall + Author Mirror](../features/author-mirror#hosted-rules) |
| Deploy with Active Directory | [Deploy with Active Directory](../install/enterprise/ad) |
| Deploy with Intune / Entra | [Deploy with Microsoft Intune](../install/enterprise/intune) |
| Governance edition overview | [Choosing an Edition](./builds/) |
