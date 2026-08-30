---
title: upgrade
sidebar_position: 14
sidebar_label: upgrade
tags: [sync]
---

# nvm upgrade

Обновление NVM for Windows.

## Использование

```powershell
Usage: nvm upgrade [flags]
```

## Аргументы

Эта команда не принимает аргументов.

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--check` | | Проверить наличие обновлений без выполнения обновления. |

## Поведение

| Деталь | Описание |
|--------|----------|
| Backend | Делегирует `sync.exe upgrade` |
| `--check` | Запускает sync upgrade в режиме только проверки |
| Policy | Выполнение обновления блокируется при [`disable_upgrade=true`](../cfg/registry#available-registry-keys); проверка без обновления по-прежнему разрешена |

## Примеры

```powershell
# check only
nvm upgrade --check

# perform upgrade flow
nvm upgrade
```

## Пример вывода

```powershell
Checking for updates...
No updates available.
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm upgrade --help
Usage: nvm upgrade [flags]

Flags:
  --check    Check for updates without performing the upgrade.
```

Используйте `--check` в скриптах или задачах мониторинга, когда нужен только статус доступности.
