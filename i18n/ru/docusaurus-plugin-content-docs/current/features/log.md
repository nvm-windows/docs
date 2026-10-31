---
title: Журналирование событий
sidebar_label: Журналирование событий
sidebar_position: 4
tags: [native-integration]
---

# Журналирование событий

Эта страница про **Community Builds**.
Для Certified Builds, выделенного канала Operational и дополнения Advanced Logging см. [Advanced Logging](./certified-builds/advanced-logging).

Критические события записываются нативно. Это установки, изменения конфигурации и события безопасности. Community Builds пишут текстовые записи в журнал Windows Application.

![1776532731980](/img/features/native/1776532731980.png)

По умолчанию журналируются только критические события изменений.

## Запись каждого запуска \{#record-each-launch\}

Когда вы включаете это, NVM пишет одно событие Windows на каждый запуск `node.exe` через shim. Вы получаете запись каждого вызова Node.

Только в [режиме shim](./modes).

```powershell
nvm config set log_executions=true
node -v
```

Откройте Event Viewer. Откройте **Windows Logs** → **Application**. Фильтр по источнику **NVM for Windows**. Каждый запуск `node.exe` — Event ID **120** (`nodejs.executed`). Event ID **200** не используется.

```powershell
wevtutil qe Application /q:"*[System[Provider[@Name='NVM for Windows'] and (EventID=120)]]" /f:text /c:5
```

Имя события — `nodejs.executed`.
Если allow-флаги были переданы, добавлены или удалены, событие содержит `permission_allow.supplied`, `permission_allow.applied` и `permission_allow.removed`.

См. [конфигурацию](../cfg/core#logging-and-announcements) для ключа `log_executions`.

[Advanced Logging](./certified-builds/advanced-logging) описывает дополнение Certified Builds.
[SIEM](../guide/siem) содержит запросы по парку.

:::warning[Регистрация источника событий]
Обе сборки регистрируют ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` рядом с `nvm.exe`).
Community Builds регистрируют источник **NVM for Windows** в журнале Windows Application.
Certified MSI также регистрирует **NVM for Windows/Operational**. Advanced Logging для этого канала не нужен.

Если установка не может повысить права (UAC отменён / не admin), или журнала нет, запустите `nvm --register-eventlog` из повышенного терминала или переустановите и примите запрос UAC.
:::

## Связанные материалы \{#related\}

- [Advanced Logging](./certified-builds/advanced-logging) — структурированные события Certified Builds
- [SIEM](../guide/siem) — запросы по парку
- [Режимы работы](./modes)
