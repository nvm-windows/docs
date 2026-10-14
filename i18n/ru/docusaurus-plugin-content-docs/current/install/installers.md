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
    :::warning[Скоро!]
    Мы всё ещё настраиваем публикацию в winget.
    :::

    ```powershell
      winget install nvm # MIT License
    ```

    `winget install` запускает community-установщик с `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART`. Дополнительные параметры установщика передавайте через `--custom`. См. [Тихая установка](#silent-install).
  </TabItem>
  <TabItem value="upgrade" label="Обновление с v1">
    Скачайте и запустите [установщик setup.exe](https://github.com/nvm-windows/nvm/releases) (лицензия MIT). Он автоматически переносит v1 на v2.

    :::warning[Устаревший updater]
    Updater v1 рассчитан на минорные и patch-обновления в линейке v1.x.x. С v2 он не работает.
    :::
  </TabItem>
</Tabs>

## Тихая установка \{#silent-install}

Community-установщик использует Inno Setup. Эти ключи работают для `nvm-<version>-x64-setup.exe` и `nvm-<version>-arm64-setup.exe`:

|Ключ|Что делает|
|:-|:-|
|`/VERYSILENT`|Без мастера и без окна прогресса.|
|`/SILENT`|Только окно прогресса. Без страниц мастера.|
|`/SUPPRESSMSGBOXES`|Пропускает диалоговые окна. Используйте вместе с `/SILENT` или `/VERYSILENT`.|
|`/NORESTART`|Не перезагружать компьютер после завершения установки.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
.\nvm-<version>-x64-setup.exe /SILENT /SUPPRESSMSGBOXES /NORESTART
```

Корневой каталог программы остаётся `%LOCALAPPDATA%\Author Software\nvm`. Если в тихом режиме задать другой путь через `/DIR`, установка завершится ошибкой [NVM4100](../troubleshooting/error-codes.md). Хранилище версий Node задаётся через `InstallRoot` (в мастере или `nvm config` после установки), а не через `/DIR`.

Тихая установка пропускает страницу разрешений для хранилища. Если текущий `InstallRoot` не относится к безопасным управляемым путям и проверка ACL завершается ошибкой, установщик переносит хранилище в AppData. Если восстановить ACL всё равно не удаётся, тихая установка останавливается, если не передать `/ALLOWDEGRADEDACLS`.

|Параметр|Допустимые значения|Что делает|
|:-|:-|:-|
|`/ALLOWDEGRADEDACLS`|`1`, `true`, `yes`|Завершает тихую установку, когда ACL хранилища Node нельзя усилить. Устанавливает `RuntimeACLDegraded`. Позже восстановите через `nvm doctor --autofix`.|

```powershell
.\nvm-<version>-x64-setup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /ALLOWDEGRADEDACLS=1
```

Списка задач нет. `/TASKS` не влияет на поведение.

### Winget

Когда пакет будет опубликован, `winget install nvm` использует перечисленные выше ключи very-silent. Передайте пользовательский параметр через `--custom` (он добавляется к этим ключам):

```powershell
winget install nvm --custom "/ALLOWDEGRADEDACLS=1"
```

`--override` заменяет стандартные ключи. Если используете его, добавьте `/VERYSILENT /SUPPRESSMSGBOXES /NORESTART` вручную.

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
