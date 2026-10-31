---
title: Обновление с v1
sidebar_label: Обновление с v1
sidebar_position: 1.5
---

# Обновление с v1

Это руководство описывает переход с NVM for Windows v1 на v2.
Установщик v2 переносит поддерживаемые установки v1 автоматически.

## Поддерживаемые версии \{#supported-versions}

Установщик v2 обновляет существующие установки **v1.1.7 и новее**.
Он обнаруживает предыдущую установку, переносит настройки и объединяет версии Node.js в раскладку v2.

:::warning[Старше v1.1.7]
Удалите NVM for Windows версии старше **1.1.7** перед установкой v2.
Такие версии не переносятся автоматически.
Без резервной копии вы потеряете установки Node.js и настройки.
:::

Встроенный updater v1 **не** устанавливает v2.
Он применяет только минорные и patch-обновления в линейке v1.x.x.
Для перехода на v2 используйте установщик v2 или winget.

## Автоматическое обновление \{#automatic-upgrade}

1. Скачайте community [setup.exe](https://github.com/nvm-windows/nvm/releases) или используйте [winget](#winget).
1. Запустите установщик от имени **обычного пользователя**.
   Не запускайте community-установщик от имени администратора.
1. Следуйте мастеру.

Установщик:

- Обнаруживает предыдущую установку NVM for Windows
- Переносит настройки в хранилище предпочтений v2
- Объединяет версии Node.js в каталог хранения v2 (по умолчанию `%LOCALAPPDATA%\Author Software\nvm\installs`)
- Обновляет PATH и связанные переменные окружения для v2

Экраны мастера показывают ход миграции.
См. [Установщики](../install/installers) для тихих ключей и предупреждений.

:::info[Каталог установки vs хранилище Node.js]
v2 поддерживает **пользовательский каталог хранения Node.js** (`InstallRoot`).
Задайте его в мастере или через `nvm config` после установки.

v2 **не** поддерживает пользовательский каталог **программы** NVM так, как это делал v1.

|Сборка|Каталог программы NVM|
|:-|:-|
|Community|`%LOCALAPPDATA%\Author Software\nvm` (фиксированный)|
|Certified|`%ProgramFiles%\Author Software\nvm` (фиксированный)|

Тихий community `/DIR` на другой путь игнорируется и останавливает установку с [NVM4100](../troubleshooting/error-codes.md).
:::

### Версии Node.js \{#nodejs-versions}

Установленные версии Node.js из поддерживаемой установки v1 объединяются в хранилище v2.
При успешной копии повторная загрузка этих версий не нужна.
После установки откройте **новый** терминал и выполните `nvm list`, чтобы подтвердить версии.

### Резервная копия в ограниченной среде \{#backup-in-restricted-environments}

Во время миграции установщик копирует деревья версий Node.js и связанные файлы.
Некоторые жёстко ограниченные среды блокируют или прерывают эти копии.

:::warning[Сделайте резервную копию перед обновлением]
Если политика, антивирус или DLP могут блокировать копирование файлов, сначала сохраните хранилище Node.js из v1.
Скопируйте корень Node.js v1 (часто под `%NVM_HOME%` или ваш пользовательский путь) в безопасное место.
Восстанавливайте из этой копии только если миграция не удалась.
:::

## Winget \{#winget}

Winget — поддерживаемый путь установки community v2.
ID пакета изменился при переходе проекта в организацию `nvm-windows`.

|Путь установки|ID Winget|
|:-|:-|
|v1 (legacy)|`CoreyButler.NVMforWindows`|
|v2 (текущий)|`AuthorSoftware.NVMWindows` (moniker `nvm-windows`)|

### Первое обновление с установки v1 через winget \{#first-upgrade-from-a-v1-winget-install}

Если v1 ставили через winget, один раз выполните:

```powershell
winget install nvm-windows
```

Эта команда сбрасывает отслеживаемый ID пакета winget с `CoreyButler.NVMforWindows` на `AuthorSoftware.NVMWindows`.
Дальнейшие обновления идут обычным потоком winget upgrade.

```powershell
winget upgrade nvm-windows
```

### Пользователи установщика, которые позже переходят на winget \{#installer-users-who-adopt-winget-later}

Если ставили через setup EXE (не winget), позже всё равно можно выполнить `winget install nvm-windows`.
Дальнейшие обновления тогда работают через стандартные операции winget upgrade.

### Советы \{#tips}

- Для первой установки v2 предпочтите мастер setup EXE, если нужны экраны миграции и параметры хранилища.
- Если после сброса ID основной путь обновления — winget, для обновлений продукта `nvm upgrade` не обязателен.
  Уведомления sync-инструмента по-прежнему могут сообщать о новой версии.
- Не повышайте права для обычной community-установки через winget.
  См. [Установщики](../install/installers#warnings).

## Обновления на весь сайт \{#sitewide-upgrades}

Для парка машин организации используйте **certified**-сборку.
Certified-пакеты поддерживают MSI, Intune Win32 и развёртывание через Active Directory.
Эти каналы — поддерживаемый путь для контролируемых обновлений на весь сайт.

1. Скачайте certified-пакет из [клиентского портала](https://portal.author.io).
1. Разверните через [Ручное развёртывание](../install/enterprise/manual), [Intune](../install/enterprise/intune) или [Active Directory](../install/enterprise/ad).
1. После установки примените лицензию и политики ([Требования](../install/enterprise/requirements), [Administrative Templates](../cfg/ad)).

:::tip[Парки v1 на Intune]
Если организация использовала NVM for Windows **v1.1.7 или новее**, certified MSI переносит существующую установку.
Сначала удалите версии старше 1.1.7.
Если вы создали собственное приложение Intune из v1.1.7 или новее, задайте **Supersedence** для Win32-приложения v2.
См. [Развёртывание через Microsoft Intune](../install/enterprise/intune).
:::

Community winget и community setup EXE рассчитаны на отдельные машины.
Это не плоскость управления парком.
Для развёртывания на весь сайт используйте certified-развёртывание.

## Связанные материалы \{#related}

|Тема|Документ|
|:-|:-|
|Community- и certified-установщики|[Установщики](../install/installers)|
|Тихие ключи community|[Установщики — Тихая установка](../install/installers#silent-install)|
|Ручной certified MSI|[Ручное развёртывание](../install/enterprise/manual)|
|Intune|[Развёртывание через Microsoft Intune](../install/enterprise/intune)|
|Active Directory|[Развёртывание через Active Directory](../install/enterprise/ad)|
|Обновления продукта в приложении|[`nvm upgrade`](../command/nvm/sync-upgrade)|
|Выбор community vs certified|[Выбор сборки](./builds/)|
