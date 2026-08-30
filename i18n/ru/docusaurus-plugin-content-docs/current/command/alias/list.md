---
title: list
sidebar_position: 2
sidebar_label: list
---

# nvm alias list

Список настроенных псевдонимов версий.

**Псевдоним:** `ls`

## Использование

```powershell
nvm alias list [alias ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[alias ...]` | Нет | Фильтр вывода по конкретным именам псевдонимов. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Вывести карту псевдонимов в формате JSON. |

## Примеры

```powershell
nvm alias list
nvm alias list legacy stable
nvm alias list --json
```

## Пример вывода

```powershell
legacy -> v20.19.1
```
