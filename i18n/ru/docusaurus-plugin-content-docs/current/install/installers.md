---
sidebar_label: Установщики и пакеты
title: Установщики
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Установщики

NVM for Windows доступен в community- и certified-сборках для устройств amd64 (x64) и arm64. См. [Выбор редакции](../guide/builds/), чтобы понять, какая подходит вам.

## Community Build

<Tabs>
  <TabItem value="native" label="Установщик" default>
    Скачайте и запустите [установщик setup.exe](https://github.com/nvm-windows/nvm/releases) (лицензия MIT).

    :::tip[Рекомендуемый способ]
    Этот способ установки открывает нативный мастер с GUI для настройки сценариев работы с Node.js.
    :::


  </TabItem>
  <TabItem value="winget" label="Winget">
    ```powershell
      winget install nvm # MIT License
    ```

    :::info[Тихая установка]
    Используйте этот вариант для установки без интерфейса с конфигурацией по умолчанию.
    :::
  </TabItem>
  <TabItem value="upgrade" label="Обновление с v1">
    Скачайте и запустите [установщик setup.exe](https://github.com/nvm-windows/nvm/releases) (лицензия MIT). Он автоматически переносит v1 на v2.

    :::warning[Устаревший updater]
    Updater v1 рассчитан на минорные и patch-обновления в линейке v1.x.x. С v2 он не работает.
    :::
  </TabItem>
</Tabs>

## Certified Build

:::info[Доступно с сентября 2026]
Подписанные certified-сборки будут доступны в клиентском портале.
:::

Certified-сборки рассчитаны на удалённую установку через платформы вроде Active Directory и Microsoft Entra, но их можно поставить и на один компьютер через MSI. См. раздел «Корпоративное развёртывание», чтобы развернуть NVM for Windows на многих машинах.

|Файл|Сценарий|
|:-|:-|
|Intune|Развёртывание в организации Microsoft Entra.|
|MSI Installer|Установка на один компьютер или развёртывание на всю площадку.|

## Установка Node.js

После установки NVM for Windows используйте его, чтобы установить одну или несколько версий Node.js.

```powershell title="Пример: установка последней поддерживаемой версии Node.js"
nvm install lts
```

## Предупреждения

:::warning[Не устанавливайте community edition от имени администратора!]
Не пытайтесь установить community edition от имени администратора. В этом случае NVM for Windows настроится для учётной записи администратора, а не для пользователя, который будет запускать Node.js. См. [регистрацию источника событий](/permissions#community-installer-registered-event-source).
:::

:::warning[UAC для журналирования]
Community-установщик пытается зарегистрировать NVM for Windows как системный источник событий, из‑за чего появляется запрос UAC. Если у учётной записи нет прав на это, в Windows Event Viewer в качестве источника события будет «Unknown», а не «NVM for Windows», но нативное журналирование продолжит работать.
:::
