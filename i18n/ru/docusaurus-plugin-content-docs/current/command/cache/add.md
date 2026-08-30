---
title: add
sidebar_position: 1
sidebar_label: add
---

# nvm cache add

Загрузка и кэширование архивов Node.js без установки.

## Использование

```powershell
nvm cache add <version> [<version> ...] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<version> ...` | Да | Один или несколько [спецификаторов версии](../../guide/version-resolution). |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--insecure` | | Принимать недействительные SSL-сертификаты от источников загрузки. |

## Примеры

```powershell
nvm cache add 24
nvm cache add lts
nvm cache add 24 --insecure
```
