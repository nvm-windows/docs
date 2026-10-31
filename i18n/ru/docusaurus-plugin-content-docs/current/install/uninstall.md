---
sidebar_label: Удаление
sidebar_position: 4
---

# Удаление

Удалите NVM for Windows с компьютера или удалите только версии Node.js.

:::tip[NVM for Windows ≠ Node.js]
Удаление NVM for Windows (приложения) с компьютера — не то же самое, что [`nvm uninstall`](../command/nvm/uninstall): эта команда удаляет только установленные версии Node.js, оставляя NVM for Windows.
:::

:::warning[Сохраните установки Node.js]
Скопируйте каталог хранения Node.js до удаления, если эти версии понадобятся позже.
Путь по умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs`.
См. [Базовая конфигурация](../cfg/core#mode-and-install-location).

Удаление Community Build снимает управляемые версии Node.js и глобальные модули этого пользователя.
Удаление Certified Build удаляет `%LOCALAPPDATA%\Author Software\nvm` для пользователя, который запускает удаление.
Другие профили на том же компьютере могут сохранить свои каталоги.

Выберите раздел для вашей [сборки](../guide/builds/).
:::

## Community Builds \{#community-builds}

Community Builds устанавливаются для пользователя в `%LOCALAPPDATA%\Author Software\nvm`.
Пакет — это открытый setup EXE.
См. [Установщики](./installers#community-build).

### Через деинсталлятор

1. Откройте **Параметры** → **Приложения** → **Установленные приложения**.
   Можно также открыть **Панель управления** → **Программы и компоненты**.
1. Выберите **NVM for Windows**.
1. Выберите **Удалить**.
1. Завершите мастер.

Можно также выполнить:

```powershell
winget uninstall nvm-windows
```

Или запустите `unins000.exe` из `%LOCALAPPDATA%\Author Software\nvm`.

Деинсталлятор Community Build удаляет:

- Файлы приложения в `%LOCALAPPDATA%\Author Software\nvm`
- Версии Node.js в настроенном корне установки (по умолчанию `%LOCALAPPDATA%\Author Software\nvm\installs`)
- Пользовательские настройки в `HKCU\Software\Author Software\Preferences\nvm`
- Пользовательскую переменную окружения `NVM_HOME` и связанные записи `PATH`
- Запланированную задачу **NVM for Windows Sync**
- Записи Apps по версиям (см. [Приложения Windows](/features/windows-apps))
- Per-user пакет sparse identity `AuthorSoftware.NVMWindows` (коллекции уведомлений)

Откройте **новый** терминал после удаления.
Новый терминал читает обновлённый `PATH`.

### Ручное удаление

Используйте эту процедуру только если деинсталлятор отсутствует или не работает.

1. Закройте терминалы и процессы, которые используют `node`, `npm` или `nvm`.
1. Удалите задачу sync, если она есть:

   ```powershell
   schtasks /Delete /TN "NVM for Windows Sync" /F
   ```

1. Удалите пакет sparse identity, если он ещё зарегистрирован:

   ```powershell
   Get-AppxPackage -Name AuthorSoftware.NVMWindows* | Remove-AppxPackage
   ```

1. Удалите `%LOCALAPPDATA%\Author Software\nvm`.
   В этом каталоге лежат файлы приложения, установки, кэш и shim.
   Если вы задали свой [`root`](../cfg/core#mode-and-install-location) или `InstallRoot`, удалите и этот каталог.
   См. [Базовая конфигурация](../cfg/core) и [справочник реестра](../cfg/registry).
1. Уберите остатки из пользовательского окружения:
   - Удалите `NVM_HOME` из **пользовательских** переменных окружения.
   - Удалите устаревший `NVM_SYMLINK`, если он есть.
   - Уберите из `PATH` записи на каталог NVM, путь shim `.nodejs` или устаревшие папки symlink `nvm` и `nodejs`.
1. Удалите остатки в реестре текущего пользователя:
   - `HKCU\Software\Author Software\Preferences\nvm`
   - `HKCU\Software\Classes\nvm` (обработчик протокола)
   - `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\nvm4w-node-v*` (записи Apps по версиям)
   - Ключ деинсталляции Inno Setup в `HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\` (имя заканчивается на `_is1` для NVM for Windows)
1. Выйдите из сеанса или откройте новый терминал.
1. Убедитесь, что `nvm`, `node` и `npm` больше не находятся.

:::tip[Переустановка позже]
Повторная установка Community Build использует [стандартный установщик или winget](./installers#community-build).
Восстановленный каталог installs работает только на том же пути [`root`](../cfg/core#mode-and-install-location), который ожидает новая установка.
:::

## Certified Builds

Certified Builds устанавливаются на компьютер в `%ProgramFiles%\Author Software\nvm`.
Пакет — это MSI или пакет Intune Win32.
Предпочтительно удаление через MDM или GPO.
Правила обнаружения и назначения тогда остаются согласованными.
См. [Требования](./enterprise/requirements), [Intune](./enterprise/intune), [Active Directory](./enterprise/ad) и [Установщики](./installers#certified-build).

:::warning[Объём удаления]
MSI удаляет `%LOCALAPPDATA%\Author Software\nvm` для пользователя, который запускает удаление.
В этом каталоге лежат версии Node.js и глобальные модули этого пользователя.
Другие профили на том же компьютере могут сохранить свои каталоги.
Скопируйте каталог этого пользователя до удаления продукта с парка.
См. предупреждение в [Развёртывание через Active Directory](./enterprise/ad).
:::

### Удаление через GPO или Microsoft Entra (Intune)

Используйте процедуру, которая соответствует исходному развёртыванию.

#### Active Directory GPO

Используйте эту процедуру, если NVM for Windows развёрнут через Software Installation.

1. Откройте GPO, которая назначает MSI.
   См. [Развёртывание через Active Directory](./enterprise/ad).
1. Снимите назначение пакета.
   Или оставьте **Uninstall this application when it falls out of the scope of management**, если этот параметр был включён при развёртывании.
1. Уберите компьютеры или пользователей из фильтра безопасности GPO или из OU.
   Пакет тогда больше не применяется.
1. На каждом клиенте выполните `gpupdate /force`.
   Перезапустите компьютер, если пакет был назначен компьютеру.
   Выйдите и войдите снова, если пакет был назначен пользователю.
1. Убедитесь, что приложения нет в **Приложениях**.

Не включайте автоматическое удаление при выходе компьютера из области, пока не прочитаете [влияние на управляемые установки Node.js](./enterprise/ad).

#### Microsoft Intune/Entra

Используйте эту процедуру для приложения Win32.
См. [Развёртывание через Intune](./enterprise/intune).

1. В [центре администрирования Intune](https://go.microsoft.com/fwlink/?linkid=2109431) откройте **NVM for Windows (Certified)**.
1. Задайте назначение **Uninstall** для целевых групп.
   Или снимите назначение установки и назначьте удаление этим группам.
1. Откройте **Apps** → **Monitor** → **App install status**.
1. Дождитесь, пока устройства сообщат об удалении.

Команда удаления находится в пакете развёртывания (`.intune.json`):

```powershell
msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
```

Используйте `productCode` из `msiInformation` в `.intune.json` вашей сборки.
Пример кода продукта в руководстве Intune может отличаться по релизам.

{/* #### MECM

Remove or retire the application deployment in Configuration Manager so clients run the MSI uninstall. See [Deploy with MECM](./enterprise/mecm) when that guide is complete.
*/}

### Ручное удаление

Используйте эту процедуру для одного устройства.
Используйте её для лабораторного компьютера, аварийного доступа или установки без MDM.

1. Откройте **Параметры** → **Приложения** → **NVM for Windows (Certified)** → **Удалить**.
   Или выполните:

   ```powershell
   msiexec.exe /x "{PRODUCT-CODE}" /qn /norestart
   ```

   Код продукта указан в MSI портала или в `.intune.json` (`msiInformation.productCode`).
1. Убедитесь, что `%ProgramFiles%\Author Software\nvm` удалён.
   Intune использует этот путь для обнаружения.
1. Убедитесь, что данные пользователя удалены.
   MSI удаляет `%LOCALAPPDATA%\Author Software\nvm` для пользователя, который запускает удаление.
   Если AppData остался у другого пользователя на том же ПК, войдите как этот пользователь и удалите `%LOCALAPPDATA%\Author Software\nvm` этого профиля.
   Или запустите скрипт с повышенными правами для каждого профиля.
   Переход с Community Builds снимает регистрацию `AuthorSoftware.NVMWindows` до удаления этих файлов.
   Первый запуск Certified Builds повторяет очистку, если MSI шёл от SYSTEM.
   Обратный переход на Community Builds снимает `AuthorSoftware.NVMWindows.Certified` после удаления Program Files `nvm.exe`.
   Первый запуск Community Builds повторяет, если deprovision MSI шёл от SYSTEM.
   Снять leftover identity сразу:

   ```powershell
   Get-AppxPackage -Name AuthorSoftware.NVMWindows* | Remove-AppxPackage
   ```
1. Необязательно: удалите политику, которую MSI не удаляет:
   - Очистите или отвяжите политики ADMX в **Author Software** → **NVM for Windows** ([Административные шаблоны](../cfg/ad)).
   - Удалите остатки в `HKLM\Software\Policies\Author Software\nvm`, если вы задали их через registry CSP или OMA-URI ([справочник реестра](../cfg/registry)).
1. Необязательно: удалите `%ProgramData%\Author\nvm-certified-install.log`, если файл есть.
1. Откройте новый терминал.
1. Убедитесь, что `nvm` нет в `PATH`.

:::info[Политики и продукт]
Удаление MSI снимает продукт.
Профили конфигурации Group Policy и Intune могут по-прежнему записывать ключи в `HKLM\Software\Policies\Author Software\nvm`, пока вы не отключите эти политики.
:::

### См. также

|Тема|Документ|
|:-|:-|
|Какая у вас сборка|[Выбор сборки](../guide/builds/)|
|Установить снова|[Установщики](./installers)|
|Требования enterprise|[Требования](./enterprise/requirements)|
|Команда удаления Intune|[Развёртывание через Intune](./enterprise/intune)|
|Удаление ПО через GPO|[Развёртывание через Active Directory](./enterprise/ad)|
|Удалить только версии Node.js|[`nvm uninstall`](../command/nvm/uninstall)|
|Ключи политик|[Справочник реестра](../cfg/registry)|
