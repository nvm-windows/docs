---
title: lts
sidebar_position: 2
sidebar_label: lts
---

# nvm use lts

Использовать последний LTS-релиз или именованную линейку LTS.

## Использование

```powershell
nvm use lts [alias]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[alias]` | Нет | Кодовое имя LTS (например, `iron`). Преобразуется в `lts/<alias>`. Пропустите для последнего LTS. |

## Примеры

```powershell
nvm use lts
nvm use lts iron
```

Эквивалентно `nvm use lts/iron`, когда указано кодовое имя.
