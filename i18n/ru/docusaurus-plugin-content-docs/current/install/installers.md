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

## Тихая установка

Community-установщик использует Inno Setup. Эти ключи работают для `nvm-<version>-x64-setup.exe` и `nvm-<version>-arm64-setup.exe`:

|Ключ|Назначение|
|:-|:-|
|`/VERYSILENT`|Без мастера и без окна прогресса.|
|`/SILENT`|Только окно прогресса, без страниц мастера.|
|`/SUPPRESSMSGBOXES`|Пропускать диалоги. Используйте с `/SILENT` или `/VERYSILENT`.|
|`/NORESTART`|Не перезагружать систему по завершении установки.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
.\nvm-<version>-x64-setup.exe /SILENT /SUPPRESSMSGBOXES /NORESTART
```

Корневой каталог программы остаётся `%LOCALAPPDATA%\Author Software\nvm`. Тихая установка с `/DIR` в другой путь прерывается с [NVM4100](../troubleshooting/error-codes.md). Хранилище версий Node задаётся через `InstallRoot` (в мастере или через `nvm config` после установки), а не через `/DIR`.

Тихая установка пропускает страницу проверки прав для хранилища. Если текущий `InstallRoot` не является безопасным управляемым путём и проверка ACL не проходит, установщик переносит хранилище в AppData. Если восстановление ACL всё равно не удаётся, тихая установка останавливается, если не передан `/ALLOWDEGRADEDACLS`.

|Параметр|Допустимые значения|Назначение|
|:-|:-|:-|
|`/ALLOWDEGRADEDACLS`|`1`, `true`, `yes`|Завершает тихую установку, когда ACL хранилища Node нельзя усилить. Устанавливает `RuntimeACLDegraded`. Позже исправьте через `nvm doctor --autofix`.|
|`/OFFICIALNODE`|`adopt`, `drop`, `ignore`|Что делать с официальной установкой Node.js (не NVM). По умолчанию **`ignore`**: оставить её на диске и поставить NVM выше в PATH. `adopt` копирует эту версию и ваши глобальные модули `%APPDATA%\npm` в хранилище NVM. `drop` удаляет официальную Node.js без копирования (тихий `msiexec /x`, если это MSI).|

Если обнаружена официальная Node.js, мастер показывает строку вроде `Node.js 22.20.0 detected with 14 global modules (128 MB)` и те же три варианта. Тихая установка и winget пропускают эту страницу и используют `/OFFICIALNODE` (по умолчанию `ignore`).

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /ALLOWDEGRADEDACLS=1
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=adopt
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=drop
```

Список задач отсутствует. `/TASKS` не влияет на установку.

### Winget

После публикации пакета `winget install nvm` использует приведённые выше ключи very-silent. Передайте пользовательский параметр через `--custom` (он добавляется к этим ключам):

```powershell
winget install nvm --custom "/ALLOWDEGRADEDACLS=1"
winget install nvm --custom "/OFFICIALNODE=adopt"
```

`--override` заменяет ключи по умолчанию. Если используете его, добавьте `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART` вручную.

## Certified Build

:::info[Доступно с сентября 2026]
Подписанные certified-сборки будут доступны в клиентском портале.
:::

Certified-сборки рассчитаны на удалённую установку через платформы вроде Active Directory и Microsoft Entra, но их можно поставить и на один компьютер через MSI. См. [корпоративное развёртывание](./enterprise/requirements), чтобы развернуть NVM for Windows на многих машинах.

|Файл|Сценарий|
|:-|:-|
|[Ручное развёртывание](./enterprise/manual)|Установка MSI (или скриптом) на один компьютер.|
|[Intune](./enterprise/intune)|Развёртывание в организации Microsoft Entra.|
|[Active Directory](./enterprise/ad)|Развёртывание на сайте через GPO Software Installation.|

:::note[Обновление с v1 или community v2]
Сертифицированный MSI устанавливается в Program Files и обновляет системные `NVM_HOME` / PATH. Существующие версии Node остаются в LocalAppData. При первом запуске `nvm` устаревшие бинарники приложений из AppData удаляются, а `installs` сохраняются. MSI не запускает community-деинсталлятор. Он также регистрирует ETW Event Provider и очищает legacy SYSTEM env во время установки. Скрипты в `Remediation/` (`machine-startup.ps1`, `Register-EventLogSource.ps1`, `Remove-LegacySystemEnv.ps1`) — только резервные, не добавляйте их в GPO startup.
:::

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
