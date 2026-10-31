---
title: Ручное развёртывание
sidebar_label: Ручное развёртывание
sidebar_position: 2
certified: true
---

# Ручное развёртывание

Установите MSI Certified Build на один компьютер или своим скриптом.
Эта процедура не использует установку программ Active Directory.
Эта процедура не использует пакет Intune.

1. Скачайте пакет развёртывания Certified Build из [клиентского портала](https://portal.author.io).
1. Выберите архитектуру целевого компьютера.

Для компьютера amd64 в имени файла стоит `x64`.
Для компьютера arm64 в имени файла стоит `arm64`.

| Файл | Назначение |
|:-|:-|
| `nvm-windows-<version>-certified-<arch>.msi` | Пакет установщика. `<arch>` — это `x64` или `arm64`. |
| `nvm-windows-<version>-certified-<arch>.mst` | Необязательный transform. Transform принимает EULA для тихой установки. |

Сначала выполните [Требования](./requirements).

:::tip[Развёртывание на парк]
Для многих компьютеров используйте [Active Directory](./ad) или [Intune](./intune).
:::

:::info[Повышение прав]
MSI Certified Build устанавливается на компьютер.
Установка, восстановление, обновление и удаление требуют повышенного приглашения или агента в контексте системы.
Файлы устанавливаются в `%ProgramFiles%\Author Software\nvm`.
:::

## Свойства MSI \{#msi-properties}

У MSI Certified Build два открытых свойства для установки.

| Свойство | Обязательно? | Назначение |
|:-|:-|:-|
| `ACCEPT_EULA=1` | **Да** для quiet / reduced UI | Принимает лицензию без мастера. Нужно для `/qn`, `/qb` и same-version repair. |
| `OFFICIALNODE` | Нет | Выбрать, что сделать с существующей официальной установкой Node.js. По умолчанию `copy`. Значения перечислены в [Certified Build](../installers#certified-build). |

Задавайте параметры среды через [Administrative Templates](../../cfg/ad) или [политику реестра](../../cfg/registry).
Не задавайте параметры среды свойствами MSI.

## Частые флаги `msiexec` \{#common-msiexec-flags}

Используйте эти флаги с `msiexec`.

| Флаг | Значение |
|:-|:-|
| `/i <path.msi>` | Установка или обновление |
| `/x {PRODUCT-CODE}` | Удаление. Скопируйте код продукта из MSI, который вы развёртываете. |
| `/qn` | Без UI (quiet) |
| `/norestart` | Не перезагружать автоматически |
| `/L*V <path.log>` | Подробный журнал |
| `TRANSFORMS=<path.mst>` | Применить MST (см. [MST transform](#mst-transform)) |
| `REINSTALL=ALL REINSTALLMODE=amus` | Восстановление той же версии (с `/i`, не `/fa`) |

Для восстановления указывайте **абсолютный** путь к MSI.
Относительный путь может дать ошибку Windows Installer `1619`.
Служба тогда не может снова открыть пакет.

:::warning[Не используйте `/fa` или `/famus`]
`/fa` и `/famus` не сохраняют `ACCEPT_EULA=1` в сеансе восстановления этого пакета.
Используйте `/i` с `REINSTALL=ALL REINSTALLMODE=amus`.
:::

## Интерактивная установка \{#interactive-install}

Дважды щёлкните MSI или выполните:

```powershell
msiexec /i "C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi"
```

Примите EULA в интерфейсе.
Полная установка с интерфейсом не требует свойства `ACCEPT_EULA`.

## Скрипт тихой установки \{#silent-install-script}

Запустите PowerShell с повышенными правами.
Передайте `ACCEPT_EULA=1` или примените MST (см. ниже).

```powershell
# Требуется elevation (Запуск от имени администратора)
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

1. Сохраните скрипт как `Install-NvmWindows.ps1`.
1. Запустите:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Install-NvmWindows.ps1
```

Код выхода `0` означает успех.
Код выхода `3010` означает успех, и компьютеру нужна перезагрузка.

### Восстановление той же версии \{#same-version-repair}

Используйте этот скрипт, чтобы восстановить ту же версию.

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-repair.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" REINSTALL=ALL REINSTALLMODE=amus ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

### Тихое удаление \{#quiet-uninstall}

```powershell
msiexec /x "{PRODUCT-CODE-FROM-DEPLOYED-MSI}" /qn /norestart
```

См. [Удаление](../uninstall), чтобы найти код продукта и удалить продукт через GPO или Intune.

## MST transform \{#mst-transform}

MST — это transform установщика Windows.
Вы применяете MST вместе с MSI.
Разделы ниже показывают, когда нужен transform и как его применить.

### Назначение \{#purpose}

Файл `.mst` Certified Build с портала задаёт **`ACCEPT_EULA=1`**.
Установка программ групповой политики тогда может установить продукт без интерфейса.
Агент, который не может передать свойства MSI, также может установить продукт без интерфейса.

MST не задаёт параметры среды.
Для параметров среды используйте ADMX или политику реестра.
Не изменяйте двоичный файл `.mst`.

### Когда нужен \{#when-you-need-it}

| Сценарий | Нужен MST? |
|:-|:-|
| Ручной или скриптовый `msiexec` с `ACCEPT_EULA=1` в командной строке | Необязательно. Достаточно свойства. |
| Active Directory **GPSI** (вкладка Modifications) | **Да**. Приложите `.mst`. См. [Развёртывание через Active Directory](./ad). |
| Агент устанавливает MSI, но не может передать открытые свойства | **Да**. Используйте `TRANSFORMS=` или список transform агента. |

### Применить через `msiexec` \{#apply-with-msiexec}

Положите MSI и MST в одну папку.
Используйте абсолютные пути.

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.msi'
$mst = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-x64.mst'
$log = Join-Path $env:ProgramData 'Author\nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null

$arguments = "/i `"$msi`" TRANSFORMS=`"$mst`" /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

MST с портала задаёт `ACCEPT_EULA=1`.
Командная строка не требует `ACCEPT_EULA=1`, когда вы применяете этот MST.
Можно передать оба значения.
Установка всё равно завершается успешно.

## Проверка \{#verify}

Подтвердите установку:

```powershell
Get-Item "$env:ProgramFiles\Author Software\nvm\nvm.exe"
nvm version
```

После установки откройте **новый** терминал.
Новый терминал показывает обновлённый `PATH`.

## Связанные материалы \{#related}

| Тема | Документ |
|:-|:-|
| Требования | [Требования](./requirements) |
| GPO + MST | [Развёртывание через Active Directory](./ad) |
| Win32 / Intune | [Развёртывание через Microsoft Intune](./intune) |
| Удаление | [Удаление](../uninstall) |
| Политики после установки | [Administrative Templates](../../cfg/ad) |
