---
title: list
sidebar_position: 2
sidebar_label: list
---

# nvm cache list

Список хранилищ кэша и их файлов.

**Псевдоним:** `ls`

## Использование

```powershell
nvm cache list [name ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[name ...]` | Нет | Фильтр по имени кэша (например, `versions`, `metadata`). |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Корни кэша, количество файлов и списки файлов в формате JSON. |

## Примеры

```powershell
nvm cache list
nvm cache list --json
```

## Пример вывода

```powershell
Versions : node-v24.1.0-win-x64.7z
Metadata : index.tab
```
