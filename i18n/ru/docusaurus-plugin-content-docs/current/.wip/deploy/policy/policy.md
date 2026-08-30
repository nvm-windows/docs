---
sidebar_position: 1
certified:
  edition: governance
---

# Настройка политик

Этап 3: примените политики NVM for Windows после [установки приложения](../../../install/installers).

Типовые цели политики:

- Корпоративные прокси (IWA/PAC/WPAD в Governance; basic/bearer во всех certified-редакциях) для загрузки Node.js
- Блокировка неподтверждённых или EOL-версий Node.js
- Периоды ожидания (cooldown) для npm/yarn/pnpm пакетов
- Контроли только для shim-режима (аудит-логи, автоопределение, доверенные подписанты)
- Установки в изолированной среде через локальные зеркала

## По платформам

|Платформа|Руководство|
|:-|:-|
|Microsoft Intune / Entra|[Административные шаблоны](../../../cfg/ad#intune-policy-configuration)|
|Active Directory GPO|[Административные шаблоны](../../../cfg/ad#group-policy-gpo-deployment)|
{/* |Microsoft Endpoint Configuration Manager|[MECM](mecm)| */}
{/* |Google Workspace|[Google Workspace](google-workspace)| */}


![Диаграмма развёртывания политик](/img/guide/deploy/policy/image.png)
## Справка

|Ресурс|Руководство|
|:-|:-|
|Все ключи и значения реестра|[Центральный справочник реестра](../../../cfg/registry)|
|Дерево политик ADMX (GPO и Intune)|[Административные шаблоны](../../../cfg/ad)|

Значения политик применяются в `HKLM\Software\Policies\Author Software\nvm`, если в справочнике реестра не указано иное.
