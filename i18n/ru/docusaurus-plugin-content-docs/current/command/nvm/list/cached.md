---
title: cached
sidebar_position: 3
sidebar_label: cached
---

# nvm list cached

Список версий Node.js, присутствующих в кэше загрузок.

## Использование

```powershell
nvm list cached [majors ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[majors ...]` | Нет | Числовые фильтры по мажорной версии (`18`, `20`). |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--json` | | Структурированный JSON-вывод. |

## Примеры

```powershell
nvm list cached
nvm list cached 20
nvm list cached --json
```
