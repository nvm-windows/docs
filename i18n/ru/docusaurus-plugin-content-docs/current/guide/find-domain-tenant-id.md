---
title: Как найти AD Domain ID или Entra Tenant ID
sidebar_label: Domain / Tenant ID
sidebar_position: 4
certified:
  edition: governance
---

# Как найти AD Domain ID или Entra Tenant ID

Hosted-правила Governance на [зеркале Author](../features/author-mirror#hosted-rules) могут сопоставлять устройства по **идентичности домена**. Используйте значения ниже, когда портал запрашивает Active Directory Domain ID или Microsoft Entra Tenant ID.

| Среда | Что вводить | Типичный формат |
|:-|:-|:-|
| Локальный Active Directory | **Domain SID** | `S-1-5-21-…` |
| Microsoft Entra ID (Azure AD) | **Tenant ID** | GUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) |
| Hybrid joined | Оба (по необходимости) | Domain SID **и** Tenant ID |

:::tip[Какое значение нужно?]
- **Только GPO / on-prem AD** → Domain SID
- **Только Entra / Intune** → Tenant ID
- **Hybrid joined** → часто оба; укажите ID, соответствующий области правила
:::

## Active Directory Domain ID (Domain SID) \{#active-directory-domain-id-domain-sid}

Портал Author ожидает **SID домена** (security identifier), а не DNS-имя (`contoso.local`) и не NetBIOS-имя (`CONTOSO`).

### С доменного ПК Windows \{#from-a-domain-joined-windows-pc}

Запустите PowerShell от имени пользователя домена (RSAT не нужен):

```powershell
# SID домена = SID пользователя без конечного RID
$userSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$domainSid = $userSid.Substring(0, $userSid.LastIndexOf('-'))
$domainSid
```

Если установлены средства RSAT Active Directory:

```powershell
(Get-ADDomain).DomainSID.Value
```

Другие быстрые проверки:

```powershell
# USERDOMAIN — NetBIOS-имя: полезно убедиться, что вы в нужном домене,
# но не вставляйте его в портал как Domain ID
$env:USERDOMAIN

whoami /user
# SID после префикса domain\user имеет тот же префикс S-1-5-21-…-…-…, что и SID домена
# (уберите конечный RID, например -500 для Administrator)
```

### Из Active Directory Users and Computers / PowerShell на DC \{#from-active-directory-users-and-computers--powershell-on-a-dc}

1. Откройте **Active Directory Users and Computers**.
1. Включите **View** → **Advanced Features**.
1. ПКМ по корню домена → **Properties** → **Attribute Editor**.
1. Найдите `objectSid` — это SID домена.

Или на контроллере домена / машине с RSAT:

```powershell
Import-Module ActiveDirectory
(Get-ADDomain).DNSRoot
(Get-ADDomain).DomainSID.Value
```

### Пример \{#example-ad}

```text
S-1-5-21-3623811015-3361044348-30300820
```

Вставьте полную строку `S-1-5-21-…` в поле домена портала.

## Microsoft Entra Tenant ID \{#microsoft-entra-tenant-id}

Портал Author ожидает GUID **Directory (tenant) ID** Entra — не имя домена тенанта (`contoso.onmicrosoft.com`) и не application (client) ID.

### Из Microsoft Entra admin center \{#from-the-microsoft-entra-admin-center}

1. Войдите в [Microsoft Entra admin center](https://entra.microsoft.com/).
1. Перейдите в **Identity** → **Overview** (или найдите **Tenant properties**).
1. Скопируйте **Tenant ID**.

### Из портала Azure \{#from-the-azure-portal}

1. Войдите в [портал Azure](https://portal.azure.com/).
1. Откройте **Microsoft Entra ID** → **Overview**.
1. Скопируйте **Tenant ID**.

### Из Microsoft Graph / Azure PowerShell \{#from-microsoft-graph--azure-powershell}

```powershell
# Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Organization.Read.All"
(Get-MgOrganization).Id

# Модуль Azure Az
Connect-AzAccount
(Get-AzContext).Tenant.Id
```

### С Entra-joined ПК Windows (локальный реестр) \{#from-an-entra-joined-windows-pc-local-registry}

На устройстве, присоединённом к Entra (или hybrid joined), Windows кэширует Tenant ID:

```powershell
$join = Get-ChildItem 'HKLM:\SYSTEM\CurrentControlSet\Control\CloudDomainJoin\JoinInfo' -ErrorAction SilentlyContinue |
  Select-Object -First 1
if ($join) {
  (Get-ItemProperty $join.PSPath).TenantId
}
```

:::note[Права]
Чтение `CloudDomainJoin\JoinInfo` обычно требует локального администратора (или elevated-сессии). Если прав на устройстве нет, предпочитайте портал Entra / Azure.
:::

### Пример \{#example-entra}

```text
72f988bf-86f1-41af-91ab-2d7cd011db47
```

## Hybrid joined устройства \{#hybrid-joined-devices}

У hybrid joined машин есть **и** on-prem Domain SID, **и** Entra Tenant ID. Hosted-правила могут опираться на любую идентичность в зависимости от настройки сопоставления.

Чтобы проверить состояние присоединения на рабочей станции:

```powershell
dsregcmd /status
```

В разделе **Device State** смотрите `AzureAdJoined`, `DomainJoined` и `WorkplaceJoined`.

## Связанные материалы \{#related}

| Тема | Документ |
|:-|:-|
| Hosted-правила зеркала (условия по домену) | [Version Firewall + Author Mirror](../features/author-mirror#hosted-rules) |
| Развёртывание через Active Directory | [Развёртывание через Active Directory](../install/enterprise/ad) |
| Развёртывание через Intune / Entra | [Развёртывание через Microsoft Intune](../install/enterprise/intune) |
| Обзор edition Governance | [Выбор edition](./builds/) |
