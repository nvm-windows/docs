---
title: Ручное развёртывание
sidebar_label: Ручное развёртывание
sidebar_position: 2
certified: true
---

# Ручное развёртывание

Установка **certified** MSI на один компьютер (или своим скриптом развёртывания) без GPSI Active Directory и без пакета Intune.

Скачайте certified-пакет развёртывания из [клиентского портала](https://portal.author.io). Выберите архитектуру целевой машины (`amd64` или `arm64`):

| Файл | Назначение |
|:-|:-|
| `nvm-windows-<version>-certified-<arch>.msi` | Пакет установщика |
| `nvm-windows-<version>-certified-<arch>.mst` | Необязательный transform (тихое принятие EULA) |

Сначала выполните [Требования](./requirements). Для парка машин предпочтительны [Active Directory](./ad) или [Intune](./intune).

:::info[Повышение прав]
Certified MSI — **per-machine**. Установка, repair, upgrade и uninstall требуют elevated-приглашения или агента в system-контексте. Полезная нагрузка ставится в `%ProgramFiles%\Author Software\nvm`.
:::

## Свойства MSI \{#msi-properties}

| Свойство | Обязательно? | Назначение |
|:-|:-|:-|
| `ACCEPT_EULA=1` | **Да** для quiet / reduced UI | Принимает лицензию без мастера. Нужно для `/qn`, `/qb` и same-version repair. |

Других публичных свойств MSI для каталога Node.js, режима работы или предпочтений нет. Принудительные runtime-настройки задавайте через [Administrative Templates](../../cfg/ad) / [политики реестра](../../cfg/registry), а не через свойства MSI.

## Частые флаги `msiexec` \{#common-msiexec-flags}

| Флаг | Значение |
|:-|:-|
| `/i <path.msi>` | Установка или upgrade |
| `/x {PRODUCT-CODE}` | Удаление (код зависит от сборки — берите из развёрнутого MSI) |
| `/qn` | Без UI (quiet) |
| `/norestart` | Не перезагружать автоматически |
| `/L*V <path.log>` | Подробный лог |
| `TRANSFORMS=<path.mst>` | Применить MST (см. [MST transform](#mst-transform)) |
| `REINSTALL=ALL REINSTALLMODE=amus` | Same-version repair (с `/i`, не `/fa`) |

Для repair указывайте **абсолютный** путь к MSI. Относительные пути могут дать ошибку Windows Installer `1619`, когда служба заново открывает пакет.

:::warning[Не используйте `/fa` или `/famus`]
Эти сокращения repair ненадёжно передают `ACCEPT_EULA=1` в сессию repair для этого пакета. Используйте `/i` с `REINSTALL=ALL REINSTALLMODE=amus`.
:::

## Интерактивная установка \{#interactive-install}

Дважды щёлкните MSI или:

```powershell
msiexec /i "C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi"
```

Примите EULA в UI. Для полной UI-установки свойство `ACCEPT_EULA` не нужно.

## Скрипт тихой установки \{#silent-install-script}

Запускайте elevated PowerShell. Передайте `ACCEPT_EULA=1` (или примените MST — см. ниже).

```powershell
# Требуется elevation (Запуск от имени администратора)
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
$logDir = Join-Path $env:ProgramData 'Author'
$log = Join-Path $logDir 'nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$arguments = "/i `"$msi`" ACCEPT_EULA=1 /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

Сохраните как `Install-NvmWindows.ps1` и запустите:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\Install-NvmWindows.ps1
```

Типичные коды успеха: `0` (успех), `3010` (успех, нужна перезагрузка).

### Same-version repair \{#same-version-repair}

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
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

См. [Удаление](../uninstall) — поиск product code и удаление через GPO/Intune.

## MST transform \{#mst-transform}

### Назначение \{#purpose}

**MST** (Microsoft Transform) — патч, применяемый **вместе** с MSI при установке. Certified `.mst` из портала задаёт **`ACCEPT_EULA=1`**, чтобы Group Policy Software Installation (и другие агенты, которым сложно передать свойства MSI) могли ставить пакет тихо.

MST **не** настраивает runtime-предпочтения. Для этого используйте ADMX / политики. Не редактируйте бинарный `.mst` вручную; при необходимости перегенерируйте его инструментами Author.

### Когда нужен \{#when-you-need-it}

| Сценарий | Нужен MST? |
|:-|:-|
| Ручной / скриптовый `msiexec` с `ACCEPT_EULA=1` в командной строке | Необязательно — достаточно свойства |
| Active Directory **GPSI** (вкладка Modifications) | **Да** — приложите `.mst` (см. [Развёртывание через Active Directory](./ad)) |
| Любой агент, который ставит MSI, но не может передать публичные свойства | **Да** — через `TRANSFORMS=` или список transform агента |

### Применить через `msiexec` \{#apply-with-msiexec}

Держите MSI и MST рядом (одна папка). Предпочтительны абсолютные пути:

```powershell
$msi = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.msi'
$mst = 'C:\Packages\nvm-certified\nvm-windows-<version>-certified-amd64.mst'
$log = Join-Path $env:ProgramData 'Author\nvm-certified-install.log'

New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null

$arguments = "/i `"$msi`" TRANSFORMS=`"$mst`" /qn /norestart /L*V `"$log`\""
$process = Start-Process msiexec.exe -ArgumentList $arguments -Wait -PassThru
exit $process.ExitCode
```

С применённым portal MST отдельно `ACCEPT_EULA=1` в командной строке не нужен (его даёт transform). Указывать оба безопасно.

### Применить в Group Policy \{#apply-in-group-policy}

На вкладке пакета **Modifications** добавьте `.mst` с той же UNC-шары, что и MSI. Полные шаги: [Развёртывание через Active Directory](./ad).

## Проверка \{#verify}

```powershell
Get-Item "$env:ProgramFiles\Author Software\nvm\nvm.exe"
nvm version
```

После установки откройте **новый** терминал, чтобы увидеть обновлённый `PATH`.

## Связанные материалы \{#related}

| Тема | Документ |
|:-|:-|
| Предварительные требования | [Требования](./requirements) |
| GPO + MST | [Развёртывание через Active Directory](./ad) |
| Win32 / Intune | [Развёртывание через Microsoft Intune](./intune) |
| Удаление | [Удаление](../uninstall) |
| Политики после установки | [Administrative Templates](../../cfg/ad) |
