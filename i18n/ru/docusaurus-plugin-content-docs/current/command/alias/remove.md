---
title: remove
sidebar_position: 3
sidebar_label: remove
---

# nvm alias remove

Удаление одного или нескольких псевдонимов версий.

**Псевдоним:** `rm`

## Использование

```powershell
nvm alias remove <alias> [<alias> ...]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<alias> ...` | Да | Одно или несколько имён псевдонимов для удаления. |

## Примеры

```powershell
nvm alias remove legacy
nvm alias remove legacy stable
```

## Пример вывода

```powershell
1 alias removed successfully.
```
