---
title: Журналирование событий
sidebar_position: 4
tags: [native-integration]
---

Критические события — установки, изменения конфигурации, события безопасности — записываются нативно и доступны в Windows Event Viewer. Это даёт организациям наблюдаемость и аудит инструментами, которые им уже знакомы.

![1776532731980](/img/features/native/1776532731980.png)

По умолчанию журналируются только критические события изменений. Дополнительное журналирование доступно через [конфигурацию](../cfg/core#logging-and-announcements). Можно логировать каждый вызов `node.exe` / `npm` / `npx` (и других основных менеджеров пакетов).

:::warning[Регистрация источника событий]
Community и certified-сборки регистрируют ETW provider (`NVMWindows.Events.man` + `NVMWindows.Events.dll` рядом с `nvm.exe`). Смотрите **Applications and Services Logs → NVM for Windows/Operational**, а не только классический Application log.

Если установка не может повысить права для `nvm --register-eventlog` (UAC отменён / не admin), регистрация пропускается. Запустите эту команду позже из повышенного терминала или переустановите и примите запрос UAC.
:::

:::tip[SIEM/Audit Logging]
Дополнение **Advanced Logging** будет доступно в сентябре 2026. Оно пишет структурированные записи с известными SIEM event codes в отдельный нативный лог NVM for Windows (не Application log). Это упрощает интеграцию с SIEM и запросы.
:::
