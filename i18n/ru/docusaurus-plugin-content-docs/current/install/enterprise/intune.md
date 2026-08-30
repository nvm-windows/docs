---
title: Развёртывание через Microsoft Intune
sidebar_label: Развёртывание через Microsoft Intune
certified: true
---

# Развёртывание через Microsoft Intune

Развёртывание NVM for Windows с готовыми файлами из загрузки NVM for Windows в [клиентском портале](https://portal.author.io). Файловый сервер не нужен. Установщик запускается от **System** и автоматически принимает EULA (`ACCEPT_EULA=1`).

|Файл|Назначение|
|:-|:-|
|`nvm-windows-<version>-certified-amd64.intunewin`|Загрузка в Intune как пакет Win32-приложения|
|`nvm-windows-<version>-certified-amd64.intune.json`|Справочник по командам установки, правилам обнаружения, кодам возврата и метаданным MSI|

Сначала выполните [Требования](./requirements). После установки перейдите к [настройке политик](../../cfg/ad).

### 1. Загрузка приложения

В [центре администрирования Microsoft Intune](https://go.microsoft.com/fwlink/?linkid=2109431):

1. Перейдите в **Apps** > **All apps** > **Create**.
1. Выберите **Windows app (Win32)**.
1. Укажите файл пакета и загрузите `nvm-windows-<version>-certified-amd64.intunewin` из пакета развёртывания.
1. Дождитесь извлечения и проверки пакета Intune.

### 2. Сведения о приложении

Используйте значения из сопутствующего файла `.intune.json`:

|Поле|Значение|
|:-|:-|
|Name|`NVM for Windows (Certified)`|
|Publisher|`Author Software Inc.`|
|Version|`<version>`|
|Description|Certified-сборка для amd64. Точная строка — в `.intune.json` вашего пакета.|

![App information](/img/install/image.png)

### 3. Параметры программы

|Параметр|Значение|
|:-|:-|
|Install command|`powershell.exe -ExecutionPolicy Bypass -File .\install.ps1`|
|Uninstall command|`msiexec.exe /x "{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}" /qn /norestart`|
|Install behavior|**System**|
|Device restart behavior|**No specific action** (suppress)|

:::info[Product code]
Product code в команде удаления (`{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}`) и прочие метаданные MSI указаны в `msiInformation` вашего `.intune.json`. Используйте значения из манифеста вашей сборки, если они отличаются.
:::

Добавьте коды возврата из `.intune.json`:

|Код|Тип|
|:-|:-|
|`0`|Success|
|`1707`|Success|
|`3010`|Soft reboot|
|`1603`|Retry|
|`1618`|Retry|
|`1619`|Retry|

![Program settings](/img/install/image-2.png)

### 4. Требования

|Параметр|Рекомендация|
|:-|:-|
|Operating system architecture|**x64** или **ARM64**|
|Minimum OS|Windows 11 21H2|

:::info
Выберите только x64 **или** ARM64 для архитектуры ОС. Если нужны оба варианта — создайте отдельные приложения Intune для каждой архитектуры. Для каждой архитектуры есть отдельный `.intunewin`.
:::

![Requirements](/img/install/image-1.png)


### 5. Правила обнаружения

Добавьте правило обнаружения **File**:

|Параметр|Значение|
|:-|:-|
|Path|`%ProgramFiles%\Author Software\nvm`|
|File or folder|`nvm.exe`|
|Detection method|**File or folder exists**|
|Associated with a 32-bit app on 64-bit clients|**No**|

![Detection rules](/img/install/image-3.png)

### 6. Зависимости

Не требуются (пропустить).

### 7. Замещение (Supercedence)

Не требуется (пропустить) при первом развёртывании. При обновлении настройте **Supersedence**, чтобы новый пакет заменил предыдущий.

:::warning[Обновление с NVM for Windows v1]
Если организация использовала NVM for Windows v1.1.7+, v2 выполнит автомиграцию без supercedence. Версии ниже 1.1.7 следует удалить — пользователи потеряют установки и настройки.

Если вы создали собственное приложение Intune из v1.1.7+, его нужно заместить. Подробности — в руководстве по сопровождению.
:::

### 8. Назначения

1. Завершите мастер и **Assign** приложение группам устройств или пользователей.
1. Проверьте статус развёртывания в **Apps** > **Monitor** > **App install status**.
1. Журнал установки пишется в `%ProgramData%\Author\nvm-certified-install.log` на целевом устройстве.
