---
title: doctor
sidebar_position: 13
sidebar_label: doctor
tags: [sync]
---

# nvm doctor

Обнаружение и исправление типичных проблем NVM for Windows.

## Использование

```powershell
Usage: nvm doctor [<checks> ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[checks ...]` | Нет | Конкретные имена проверок для запуска. При опускании выполняются все проверки. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--autofix` | | Автоматически применять исправления, где поддерживается. |
| `--list` | | Вывести список доступных проверок без их выполнения. |
| `--json` | | Структурированный JSON-вывод для автоматизации. |

## Поведение

| Деталь | Описание |
|--------|----------|
| Backend | Делегирует `sync.exe doctor` |
| Ошибка | Возникает, если утилита sync отсутствует или не может быть найдена |
| Режимы | Полный запуск проверок, только список или autofix |

## Примеры

```powershell
# run all checks
nvm doctor

# enumerate available checks only
nvm doctor --list

# run selected checks
nvm doctor path proxy

# run fixes where supported
nvm doctor --autofix

# structured output for automation
nvm doctor --json
```

## Пример вывода

```powershell
[OK] PATH layout
[OK] Mirror reachability
[WARN] Cached metadata is stale
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm doctor --help
Usage: nvm doctor [<checks> ...] [flags]

Flags:
  --autofix
  --list
  --json
```

В корпоративных средах запускайте doctor после развёртывания и во время проверок состояния рабочих станций.
