---
title: version
sidebar_position: 1
sidebar_label: version
---

# nvm cache remove version

Удаление кэшированных архивов загрузки Node.js. Поведение по умолчанию при передаче аргументов версии в `nvm cache remove`.

## Использование

```powershell
nvm cache remove version [version ...] [flags]
nvm cache remove [version ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[version ...]` | Нет* | [Спецификаторы версии](../../../guide/version-resolution) для удаления. С `--all` каждый токен — префикс major или major.minor. *Обязателен, если не используется `--prompt`. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--all` | `-a` | Удалить все кэшированные версии, совпадающие с каждым токеном как префикс. |
| `--prompt` | `-p` | Интерактивный выбор артефактов (GUI). |

## Примеры

```powershell
nvm cache remove version 24.1.0
nvm cache remove 20 22
nvm cache remove version 20.1 --all
nvm cache remove version --prompt
```
