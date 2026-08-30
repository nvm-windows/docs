---
title: cache
sidebar_position: 9
sidebar_label: cache
---

# nvm cache

Просмотр кэшированных артефактов установки. Поведение по умолчанию при запуске `nvm cache` без подкоманды.

**Псевдоним для list:** `ls`

## Использование

```powershell
nvm cache [name ...] [flags]
nvm cache list [name ...] [flags]
```

## Подкоманды

| Подкоманда | Псевдонимы | Описание |
|------------|------------|----------|
| *(по умолчанию)* / [`list`](./list) | `ls` | Список хранилищ кэша и файлов. |
| [`add`](./add) | — | Загрузить и закэшировать без установки. |
| [`remove`](./remove/) | `rm` | Удалить кэшированные артефакты. |

## Примеры

```powershell
nvm cache
nvm cache list
nvm cache add 24
nvm cache remove version 24.1.0
nvm cache remove all
```

## Примечания

- Удаление может быть заблокировано политикой ([`allow_download_cache_removal=false`](../../cfg/core#downloads-and-mirrors)).

См. [Кэш загрузок](../../features/cache).
