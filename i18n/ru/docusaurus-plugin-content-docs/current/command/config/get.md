---
title: get
sidebar_position: 2
sidebar_label: get
---

# nvm config get

Получить одно или несколько значений конфигурации.

## Использование

```powershell
nvm config get <name> [<name> ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<name> ...` | Да | Имена параметров конфигурации. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Вывести запрошенные ключи в формате JSON. |

## Примеры

```powershell
nvm config get mode
nvm config get mode root auto_install
nvm config get mode root --json
```
