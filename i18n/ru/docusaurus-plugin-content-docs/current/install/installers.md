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

Community-установщик — Inno Setup. Эти ключи работают для `nvm-<version>-x64-setup.exe` и `nvm-<version>-arm64-setup.exe`:

|Ключ|Что делает|
|:-|:-|
|`/VERYSILENT`|Без мастера и без окна прогресса.|
|`/SILENT`|Только окно прогресса. Без страниц мастера.|
|`/SUPPRESSMSGBOXES`|Пропускает окна сообщений. Используйте с `/SILENT` или `/VERYSILENT`.|
|`/NORESTART`|Не перезагружает компьютер после установки.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
.\nvm-<version>-x64-setup.exe /SILENT /SUPPRESSMSGBOXES /NORESTART
```

Корень программы остаётся `%LOCALAPPDATA%\Author Software\nvm`. Тихий `/DIR` в другое место останавливает установку с [NVM4100](../troubleshooting/error-codes.md). Хранилище версий Node — `InstallRoot` (мастер или `nvm config` после установки), не `/DIR`.

Каталоги runtime (`.shim`, `.nodejs`, `.sync`, `.cache`, `.verify`, `proxy.exe`) всегда живут в корне программы. Пользовательский `InstallRoot` хранит только деревья версий — NVM никогда не создаёт эти runtime-каталоги рядом с пользовательским хранилищем (например, выбор `D:\nvm` не должен создавать `D:\.shim`).

Тихая установка пропускает страницу прав хранилища. Если текущий `InstallRoot` небезопасен и проверка ACL не проходит, установщик переносит хранилище в AppData. Если ремонт ACL всё равно не проходит, тихая установка останавливается, пока не передадите `/ALLOWDEGRADEDACLS`.

|Параметр|Допустимые значения|Что делает|
|:-|:-|:-|
|`/ALLOWDEGRADEDACLS`|`1`, `true`, `yes`|Завершает тихую установку, когда ACL хранилища Node нельзя усилить. Ставит `RuntimeACLDegraded`. Позже восстановите через `nvm doctor --autofix`.|
|`/OFFICIALNODE`|`adopt` (по умолчанию), `drop`|Что делать с официальной установкой Node.js (не NVM). `adopt` копирует эту версию и глобальные модули `%APPDATA%\npm` в хранилище NVM, затем удаляет официальную Node.js. `drop` удаляет официальную Node.js. Не копирует эту установку.|

Если официальная Node.js есть, мастер показывает строку вроде `Node.js 22.20.0 detected with 14 global modules (128 MB)`. Дальше только **Adopt** и **Drop**. Тихая установка и winget пропускают эту страницу. Они используют `/OFFICIALNODE`. Для community значение по умолчанию — `adopt`. Любое другое значение, включая `copy`, `keep` и `ignore`, обрабатывается как `adopt`.

Community-установщик не может оставить официальную Node.js. Каталог Node.js в system PATH перекрывает user PATH NVM. `copy` и `keep` есть только у [certified MSI](#certified-build).

Если установщик не может удалить официальную Node.js, тихая установка останавливается. Код выхода не 0. Удалите эту установку Node.js и запустите установщик снова.

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /ALLOWDEGRADEDACLS=1
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=adopt
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /OFFICIALNODE=drop
```

Списка задач нет. `/TASKS` не влияет на поведение.

### Winget

Когда пакет опубликован, `winget install nvm` использует ключи very-silent выше. Пользовательский параметр передайте через `--custom` (добавляется к этим ключам):

```powershell
winget install nvm --custom "/ALLOWDEGRADEDACLS=1"
winget install nvm --custom "/OFFICIALNODE=adopt"
```

`--override` заменяет стандартные ключи. Если используете его, добавьте `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART` вручную.

## Certified Build

:::info[Доступно с сентября 2026]
Подписанные certified-сборки будут доступны в клиентском портале.
:::

Certified-сборки рассчитаны на удалённую установку через платформы вроде Active Directory и Microsoft Entra, но их можно поставить и на один компьютер через MSI. См. [корпоративное развёртывание](./enterprise/requirements), чтобы развернуть NVM for Windows на многих машинах.

Тихая установка требует повышения прав. Свойства MSI передавайте после пути к пакету.

|Свойство|Допустимые значения|Что делает|
|:-|:-|:-|
|`ACCEPT_EULA`|`1`|Принять EULA без мастера. Нужно для `/qn` и `/qb`.|
|`OFFICIALNODE`|`copy` (по умолчанию), `adopt`, `keep`, `drop`|Что делать с официальной установкой Node.js (не NVM). `copy` копирует эту версию и глобальные модули `%APPDATA%\npm` в NVM. Оставляет официальную установку на диске. Ставит NVM первым в system PATH. `adopt` копирует те же файлы, затем удаляет официальную Node.js. `keep` не копирует официальную Node.js. Оставляет её на диске. Ставит NVM первым в system PATH. `drop` удаляет официальную Node.js. Не копирует эту установку.|

`adopt-keep` значит `copy`. `adopt-drop` значит `adopt`. `ignore-keep` и `ignore` значат `keep`. `ignore-drop` значит `drop`. Любое другое значение становится `copy`. Голый `adopt` удаляет официальную Node.js после копирования. Это не синоним `copy`.

```powershell
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=copy /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=adopt /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=keep /qn /norestart
msiexec /i "C:\path\to\nvm-windows-<version>-certified-x64.msi" ACCEPT_EULA=1 OFFICIALNODE=drop /qn /norestart
```

NVM первым значит `%LOCALAPPDATA%\Author Software\nvm\.nodejs`, затем `C:\Program Files\Author Software\nvm`, затем официальная Node.js.
Если копирование или удаление не удалось, установка останавливается.
Удалите существующую установку Node.js и запустите установщик снова.

Мастер показывает **Copy**, **Adopt**, **Keep** и **Drop**. По умолчанию **Copy**.

|Файл|Сценарий|
|:-|:-|
|[Ручное развёртывание](./enterprise/manual)|Установка MSI (или скриптом) на один компьютер.|
|[Intune](./enterprise/intune)|Развёртывание в организации Microsoft Entra.|
|[Active Directory](./enterprise/ad)|Развёртывание на сайте через GPO Software Installation.|

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
