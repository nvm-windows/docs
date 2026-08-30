---
title: env
sidebar_position: 8
sidebar_label: env
---

# nvm env

Вывод сведений об окружении, используемых NVM for Windows.

## Использование

```powershell
Usage: nvm env [flags]
```

## Аргументы

Эта команда не принимает аргументов.

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Полный диагностический отчёт в формате JSON. |

## Разделы отчёта

| Раздел | Содержимое |
|--------|------------|
| Computer | Версия/сборка Windows, оболочка, режим администратора и разработчика |
| Installation | Версия NVM, путь установки, политика обновления |
| Version management | Режим, активная версия, корни установки/кэша, размеры и количество |
| Mirrors | URL зеркал Node и npm и их доступность |
| License | Необязательная сводка лицензии при наличии |

## Примеры

```powershell
# human-readable diagnostics
nvm env

# machine-readable report for tooling/support
nvm env --json

# save to file for ticket attachment
nvm env --json > nvm-env.json
```

## Пример вывода

```powershell
NVM For Windows
├─ Version            : v2.0.0-alpha.1
├─ Status             : on
├─ Operating Mode     : shim
└─ Installed Versions : 4
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm env --help
Usage: nvm env [flags]

Flags:
  --json    Output in JSON format.
```

Используйте эту команду при устранении неполадок с путями, корнем и поведением среды выполнения.
