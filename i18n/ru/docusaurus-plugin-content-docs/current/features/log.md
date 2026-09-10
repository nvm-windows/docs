---
title: Журналирование событий
sidebar_position: 4
tags: [native-integration]
---

Критические события — установки, изменения конфигурации, события безопасности — записываются нативно в Windows Event Viewer. Community и Certified Builds получают operational-события; корпоративные SIEM/audit-пайплайны обычно дополняют Event Viewer дополнением Advanced Logging (ниже).

![1776532731980](/img/features/native/1776532731980.png)

По умолчанию журналируются только критические события изменений. Дополнительное журналирование доступно через [конфигурацию](../cfg/core#logging-and-announcements). Можно логировать каждый вызов `node.exe` / `npm` / `npx` (и других основных менеджеров пакетов).

:::warning[Регистрация источника событий]
Community и Certified Builds регистрируют ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` рядом с `nvm.exe`). Смотрите **Applications and Services Logs → NVM for Windows/Operational**, а не только классический Application log.

Если установка не может повысить права для `nvm --register-eventlog` (UAC отменён / не admin), регистрация пропускается. Запустите эту команду позже из повышенного терминала или переустановите и примите запрос UAC.
:::

:::tip[Certified Builds — Advanced Logging]
Дополнение **Advanced Logging** (Certified Builds, доступно с сентября 2026) пишет структурированные записи с известными SIEM event codes в отдельный нативный лог NVM for Windows (не Application log). Используйте для интеграции SIEM на флоте и audit-запросов.
:::
