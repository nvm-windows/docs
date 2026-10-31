---
title: remove
sidebar_position: 3
sidebar_label: remove
---

# nvm cache remove

Удаление кэшированных артефактов.

**Псевдоним:** `rm`

## Подкоманды

| Подкоманда | Описание |
|------------|----------|
| [`version`](./version) | Удалить кэшированные архивы Node.js (по умолчанию). |
| [`metadata`](./metadata) | Удалить кэшированные файлы метаданных. |
| [`all`](./all) | Очистить кэши метаданных, версий, меток malware и `malware.db`. |
| [`malware`](./malware) | Удалить метки скана malware или `malware.db`, если передан этот путь. |

## Примечания

Удаление может быть заблокировано, когда [`allow_download_cache_removal=false`](../../../../cfg/core#downloads-and-mirrors).
