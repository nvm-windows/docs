---
title: default
sidebar_position: 7
sidebar_label: default
---

# nvm default

Показать текущую версию Node.js по умолчанию.

## Использование

```powershell
Usage: nvm default [flags]
```

## Аргументы

Эта команда не принимает аргументов.

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Вывести `default` и необязательный `last` в формате JSON. |

## Вывод

| Формат | Поля |
|--------|------|
| Text | `Default` (текущая активная версия или `none`), `Last` (предыдущая версия по умолчанию при наличии) |
| JSON | `default`, необязательный `last` |

## Примеры

```powershell
nvm default
nvm default --json
```

## Пример вывода

```powershell
Default : v24.1.0
Last    : v22.14.0
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm default --help
Usage: nvm default [flags]

Flags:
	--json    Output in JSON format.
```
