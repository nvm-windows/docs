---
sidebar_label: Удаление
sidebar_position: 4
---

# Удаление

:::tip[NVM for Windows ≠ Node.js]
Удаление NVM for Windows (приложения) с компьютера — не то же самое, что [`nvm uninstall`](../command/uninstall): эта команда удаляет только установленные версии Node.js, оставляя NVM for Windows.
:::

:::warning[Сохраните установки Node.js!]
Удаление NVM for Windows удаляет все управляемые версии Node.js и их глобальные модули. Сначала сохраните каталог хранения Node.js, если версии могут понадобиться позже. По умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs` (см. [Базовая конфигурация](../cfg/core#mode-and-install-location)).

Выберите раздел, соответствующий вашей [редакции](../guide/builds/).
:::

## Community-сборки \{#community-builds}

Community-сборки устанавливаются per-user в `%LOCALAPPDATA%\Author Software\nvm` через открытый setup EXE. См. [Установщики](./installers#community-build).

### Через деинсталлятор

1. Откройте **Параметры** → **Приложения** → **Установленные приложения** (или **Панель управления** → **Программы и компоненты**).
1. Выберите **NVM for Windows** → **Удалить**.
1. Завершите мастер установки.

Или:

```powershell
winget uninstall nvm
```

Либо запустите `unins000.exe` из каталога установки (`%LOCALAPPDATA%\Author Software\nvm`).

Community-деинсталлятор удаляет:

- Файлы приложения в `%LOCALAPPDATA%\Author Software\nvm`
- Версии Node.js в настроенном корне установки (по умолчанию `%LOCALAPPDATA%\Author Software\nvm\installs`)
- Пользовательские настройки в `HKCU\Software\Author Software\Preferences\nvm`
- Пользовательскую переменную окружения `NVM_HOME` и связанные записи `PATH`
- Запланированную задачу **NVM for Windows Sync**
- Записи Apps по версиям (см. [Приложения Windows](/features/windows-apps))

Откройте **новый** терминал после удаления, чтобы применились изменения `PATH` и окружения.

### Ручное удаление

Используйте только если деинсталлятор отсутствует или не работает.

1. Закройте терминалы и процессы, использующие `node`, `npm` или `nvm`.
1. Удалите задачу sync (если есть):

   ```powershell
   schtasks /Delete /TN "NVM for Windows Sync" /F
   ```

1. Удалите `%LOCALAPPDATA%\Author Software\nvm` (файлы приложения, установки, кэш, shim). Если меняли [`root`](../cfg/core#mode-and-install-location)/`InstallRoot`, удалите и этот каталог (см. [Базовая конфигурация](../cfg/core) и [справочник реестра](../cfg/registry)).
1. Уберите остатки из пользовательского окружения:

   - Удалите `NVM_HOME` (и устаревший `NVM_SYMLINK`, если есть) из **пользовательских** переменных окружения.
   - Уберите из `PATH` записи на каталог NVM, путь shim `.nodejs` или устаревшие папки symlink `nvm`/`nodejs`.
1. Удалите остатки в реестре текущего пользователя:

   - `HKCU\Software\Author Software\Preferences\nvm`
   - `HKCU\Software\Classes\nvm` (обработчик протокола)
   - `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\nvm4w-node-v*` (записи Apps по версиям)
   - Ключ деинсталляции Inno Setup в `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\` (имя заканчивается на `_is1` для NVM for Windows)
1. Выйдите из сеанса или откройте новый терминал и убедитесь, что `nvm`, `node` и `npm` больше не находятся.

:::tip[Переустановка позже]
Переустановка community — через [стандартный установщик или winget](./installers#community-build). Восстановление сохранённой папки installs работает только если она лежит по тому же пути [`root`](../cfg/core#mode-and-install-location), который ожидает новая установка.
:::

## Certified-сборки

Certified-сборки устанавливаются machine-wide в `%ProgramFiles%\Author Software\nvm` как MSI/Intune Win32. Предпочтительно удаление через MDM или GPO, чтобы detection и назначения оставались согласованными. См. [требования enterprise](./enterprise/requirements), [Intune](./enterprise/intune), [Active Directory](./enterprise/ad) и [Установщики](./installers#certified-build).

:::warning[Объём удаления]
Удаление certified NVM for Windows удаляет версии Node.js, управляемые для этого пользователя (хранилище по умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs`), и может затронуть все учётные записи на устройстве, использовавшие machine-wide установку. Сохраните installs перед массовым удалением. См. предупреждение GPO в [Развёртывание через Active Directory](./enterprise/ad).
:::

### Удаление через GPO или Microsoft Entra (Intune)

#### Active Directory GPO

Если NVM for Windows развёрнут через Software Installation:

1. Откройте GPO, назначающий MSI (см. [Развёртывание через Active Directory](./enterprise/ad)).
1. Снимите назначение пакета или используйте **Uninstall this application when it falls out of the scope of management**, если эта опция была включена при развёртывании.
1. Уберите компьютеры/пользователей из фильтра безопасности GPO или OU, чтобы пакет больше не применялся.
1. На клиентах выполните `gpupdate /force` (или дождитесь следующего обновления политики), затем проверьте, что приложения нет в **Приложениях**.

Не включайте автоматическое удаление при выходе из области управления без понимания [влияния на управляемые установки Node.js](./enterprise/ad).

#### Microsoft Intune/Entra

При развёртывании как Win32-приложение (см. [Развёртывание через Intune](./enterprise/intune)):

1. В [центре администрирования Intune](https://go.microsoft.com/fwlink/?linkid=2109431) откройте приложение **NVM for Windows (Certified)**.
1. Измените назначения так, чтобы целевые группы получили **Uninstall**, или снимите назначение установки и назначьте удаление этим группам.
1. Отслеживайте **Apps** → **Monitor** → **App install status**, пока устройства не сообщат об удалении.

Команда удаления пакета совпадает с вашим deployment pack (из `.intune.json`):

```powershell
msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
```

Используйте `productCode` из `msiInformation` в `.intune.json`, поставляемом с вашей сборкой. Пример кода продукта в руководстве Intune может отличаться по релизам.

{/* #### MECM

Remove or retire the application deployment in Configuration Manager so clients run the MSI uninstall. See [Deploy with MECM](./enterprise/mecm) when that guide is complete.
*/}

### Ручное удаление

Для одного устройства (лабораторная машина, аварийный сценарий или установка без MDM):

1. Предпочтительно **Параметры** → **Приложения** → **NVM for Windows (Certified)** → **Удалить**, или:

   ```powershell
   msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
   ```

   Код продукта указан в MSI/`.intune.json` портала (`msiInformation.productCode`).
1. Убедитесь, что `%ProgramFiles%\Author Software\nvm` удалён (путь detection для Intune).
1. Проверьте удаление per-user данных. MSI выполняет очистку и удаляет `%LOCALAPPDATA%\Author Software\nvm` для пользователя, выполнившего удаление. Если AppData остался (например, другой профиль на том же ПК), удалите `%LOCALAPPDATA%\Author Software\nvm` этого профиля под этим пользователем или скриптом с повышенными правами для каждого профиля.
1. Опциональная очистка политик (**не** выполняется автоматически при удалении MSI):

   - Очистите или отвяжите политики ADMX в **Author Software** → **NVM for Windows** ([Административные шаблоны](../cfg/ad)).
   - Удалите остатки в `HKLM\Software\Policies\Author Software\nvm`, если применяли registry CSP/OMA-URI напрямую ([справочник реестра](../cfg/registry)).
1. Опционально: удалите логи установки в `%ProgramData%\Author\nvm-certified-install.log`, если есть.
1. Откройте новый терминал и убедитесь, что `nvm` больше нет в `PATH`.

:::info[Политики vs продукт]
Удаление MSI снимает продукт. **Конфигурационные** профили Group Policy/Intune могут продолжать пушить ключи в `HKLM\Software\Policies\Author Software\nvm`, пока вы не отключите эти политики.
:::

### См. также

|Тема|Документ|
|:-|:-|
|Какая у вас редакция|[Выбор редакции](../guide/builds/)|
|Установить снова|[Установщики](./installers)|
|Требования enterprise|[Требования](./enterprise/requirements)|
|Команда удаления Intune|[Развёртывание через Intune](./enterprise/intune)|
|Удаление ПО через GPO|[Развёртывание через Active Directory](./enterprise/ad)|
|Удалить только версии Node.js|[`nvm uninstall`](../command/uninstall)|
|Ключи политик|[Справочник реестра](../cfg/registry)|
