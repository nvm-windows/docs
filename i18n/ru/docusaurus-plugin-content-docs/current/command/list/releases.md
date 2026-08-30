---
title: releases
sidebar_position: 2
sidebar_label: releases
---

# nvm list releases

Список доступных для загрузки релизов Node.js с настроенных зеркал.

## Использование

```powershell
nvm list releases [majors ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[majors ...]` | Нет | Числовые фильтры по мажорной версии (`18`, `20`). |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--limit` | `-l` | Максимальное число строк (по умолчанию: `20`). |
| `--no-limit` | | Вывести все подходящие релизы. |
| `--json` | | Структурированный JSON-вывод. |

## Примеры

```powershell
nvm list releases
nvm list releases --no-limit
nvm list releases --limit 50
nvm list releases 22 --json
```

**Примечание:** `list-remote` / `ls-remote` перенаправляются сюда.
