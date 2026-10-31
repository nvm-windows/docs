---
title: Развёртывание через Microsoft Intune
sidebar_label: Развёртывание через Microsoft Intune
certified: true
---

# Развёртывание через Microsoft Intune

Разверните Certified Build файлами из загрузки [клиентского портала](https://portal.author.io).
Файловый сервер не нужен.
Установщик запускается от **System**.
Установщик принимает EULA (`ACCEPT_EULA=1`).

|Файл|Назначение|
|:-|:-|
|`nvm-windows-<version>-certified-amd64.intunewin`|Загрузите этот файл в Intune как пакет Win32-приложения.|
|`nvm-windows-<version>-certified-amd64.intune.json`|Используйте этот файл для команд установки, правил обнаружения, кодов возврата и метаданных MSI.|
|`nvm-windows-<version>-certified-x64.defender-exclusions.csv`|Импортируйте этот файл в политику Microsoft Defender Antivirus exclusions.|

Сначала выполните [Требования](./requirements).
После установки перейдите к [настройке политик](../../cfg/ad).

### 1. Загрузка приложения

В [центре администрирования Microsoft Intune](https://go.microsoft.com/fwlink/?linkid=2109431):

1. Перейдите в **Apps** > **All apps** > **Create**.
1. Выберите **Windows app (Win32)**.
1. Выберите файл пакета приложения.
1. Загрузите `nvm-windows-<version>-certified-amd64.intunewin` из пакета развёртывания.
1. Дождитесь, пока Intune извлечёт и проверит пакет.

### 2. Сведения о приложении

Скопируйте эти значения из сопутствующего файла `.intune.json`.

|Поле|Значение|
|:-|:-|
|Name|`NVM for Windows (Certified)`|
|Publisher|`Author Software Inc.`|
|Version|`<version>`|
|Description|Certified Build для amd64. Точную строку см. в `.intune.json` вашего пакета.|

![App information](/img/install/image.png)

### 3. Параметры программы

Задайте поля программы этими значениями.

|Параметр|Значение|
|:-|:-|
|Install command|`powershell.exe -ExecutionPolicy Bypass -File .\install.ps1`|
|Uninstall command|`msiexec.exe /x "{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}" /qn /norestart`|
|Install behavior|**System**|
|Device restart behavior|**No specific action** (suppress)|

:::info[Product code]
Product code удаления (`{DEFC7F94-F44C-4439-B5E7-AC274D576A8F}`) указан в `msiInformation` вашего `.intune.json`.
Остальные метаданные MSI находятся в том же объекте.
Если манифест отличается, используйте значения из этого манифеста.
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

Задайте поля требований этими значениями.

|Параметр|Рекомендация|
|:-|:-|
|Operating system architecture|**x64** или **ARM64**|
|Minimum OS|Windows 11 21H2|

:::info
Выберите **x64** или **ARM64**.
Не выбирайте оба варианта в одном приложении.
Если нужны обе архитектуры, создайте одно приложение Intune для каждой архитектуры.
У каждой архитектуры свой установщик `.intunewin`.
:::

![Requirements](/img/install/image-1.png)

### 5. Правила обнаружения

Добавьте правило обнаружения **File**.

|Параметр|Значение|
|:-|:-|
|Path|`%ProgramFiles%\Author Software\nvm`|
|File or folder|`nvm.exe`|
|Detection method|**File or folder exists**|
|Associated with a 32-bit app on 64-bit clients|**No**|

![Detection rules](/img/install/image-3.png)

### 6. Зависимости

Пропустите этот шаг.
Зависимости не требуются.

### 7. Supersedence

Пропустите этот шаг при первом развёртывании.
Supersedence не требуется.
Для обновления задайте **Supersedence** у этого Win32-приложения.
Новый пакет тогда заменяет предыдущий пакет.

:::warning[Обновление с NVM for Windows v1]
Если организация использовала NVM for Windows v1.1.7 или новее, v2 переносит существующую установку.
Для этого переноса supersedence не нужен.
Сначала удалите версии старше 1.1.7.
После этого пользователи теряют существующие установки и настройки.

Если вы создали собственное приложение Intune из v1.1.7 или новее, замещайте это приложение.
См. руководство по сопровождению.
:::

### 8. Назначения

1. Завершите мастер.
1. **Assign** приложение группам устройств или пользователей.
1. Откройте **Apps** > **Monitor** > **App install status**.
1. Подтвердите статус развёртывания.

Журнал установки находится в `%ProgramData%\Author\nvm-certified-install.log` на целевом устройстве.

### 9. Исключения Microsoft Defender

Win32-приложение не добавляет исключения антивируса. `install.ps1` только запускает MSI. Tamper Protection блокирует `Add-MpPreference` на устройстве, в том числе когда приложение работает как System.

Создайте отдельную политику Endpoint security. Назначьте её тем же устройствам, что и Win32-приложение.

1. Откройте **Endpoint security** > **Antivirus** > **Create Policy**.
1. Установите **Platform** в **Windows**.
1. Установите **Profile** в **Microsoft Defender Antivirus exclusions**.
1. В **Excluded processes** выберите **Import**.
1. Выберите `nvm-windows-<version>-certified-x64.defender-exclusions.csv` из пакета развёртывания.

   Файл содержит эти пути:
   - `C:\Program Files\Author Software\nvm\nvm.exe`
   - `C:\Program Files\Author Software\nvm\utils\reshim.exe`
1. Назначьте политику тем же группам, что и приложение.

Этот параметр указывает Defender игнорировать файлы, которые открывают эти две программы. Не исключайте `%APPDATA%\Microsoft\Crypto\Keys`. Не помещайте эти пути в политику NVM ADMX.

Arctic Wolf, CrowdStrike и SentinelOne игнорируют эту политику Defender. Задайте исключение в консоли этого продукта.
