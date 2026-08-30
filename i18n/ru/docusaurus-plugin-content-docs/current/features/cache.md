---
title: Кэш загрузок
sidebar_position: 10
---

NVM for Windows может хранить скачанные архивы Node.js на диске, чтобы последующие установки не обращались к сети, если подходящий архив уже есть. Управляйте хранилищем через [`nvm cache`](../command/cache/) или включите автосохранение через [`cache_downloads`](../cfg/core#downloads-and-mirrors).

Кэш полезен, когда:

- **Частые переустановки**: удаляете и снова ставите ту же версию Node без повторной загрузки.
- **Нестабильная или лимитированная сеть**: локальная копия позволяет установить Node при сбое зеркала или офлайне
- **Подготовка парка/лаборатории**: один раз `nvm cache add`, затем копируете архивы (или общий [`local_dir`](../cfg/registry#available-registry-keys)) на другие машины
- **Изолированные установки**: предзагрузка на подключённом хосте, затем установка офлайн ([Изолированные установки](../guide/air-gapped-installations))

:::info[Локальные установки]
Кэш покрывает простой офлайн-ноутбук. Для команд и общих архивов лучше [Локальные установки](./local-installations) и руководство [Изолированные установки](../guide/air-gapped-installations).
:::

По умолчанию **[`cache_downloads`](../cfg/core#downloads-and-mirrors) = `false`**: обычный `nvm install` **переиспользует** кэшированный архив, если он есть, но **не записывает** новый, пока не передан `--cache` или не включена настройка.

```powershell
nvm install 24 --cache
nvm install 24.11.0   # переиспользует кэшированный архив, если он есть
```

## Где лежат файлы

Под корнем данных NVM (родитель каталога установки; по умолчанию `%LOCALAPPDATA%\Author Software\nvm`):

| Хранилище | Путь | Содержимое |
|-------|------|----------|
| Версии | `.cache/versions` | Архивы Node.js `.7z` (`node-v{version}-win-{x64\|arm64}.7z`) |
| Метаданные | `.cache/metadata` | Метаданные индекса sync/release (не архивы установки) |
| HTTP | `.cache/http` | Кратковременные HTTP-тела (например, загрузки SHASUM) |

Если задан [`local_dir`](../cfg/registry#available-registry-keys) (см. [политику реестра](../cfg/registry)), этот каталог **заменяет** `.cache/versions` как источник архивов для установки.

## Поведение при установке

| Флаг/настройка | Эффект |
|----------------|--------|
| [`nvm install --cache`](../command/install/) | Скачать (при необходимости) и **сохранить** архив |
| [`nvm install --no-cache`](../command/install/) | Не использовать и не писать кэш версий по умолчанию |
| [`cache_downloads=true`](../cfg/core#downloads-and-mirrors) | Всегда сохранять успешные загрузки (если нет `--no-cache`) |
| [`nvm cache add`](../command/cache/add) | Скачать и закэшировать **без** установки |
| [`local_install_only`](../cfg/registry#available-registry-keys) | Без сети: установка только из [`local_dir`](../cfg/registry#available-registry-keys)/попадания в кэш |

При попадании в кэш целостность проверяется до переиспользования (локальный SHASUM рядом с архивом, verify-cache при загрузке или живой SHASUM зеркала онлайн). Плохой архив удаляется, установка продолжается как промах, если сеть разрешена.

## Управление кэшем

```powershell
nvm cache                  # список (алиас: nvm cache list/ls)
nvm cache add 24 lts       # предзагрузка архивов
nvm cache remove version 24.1.0
nvm cache remove metadata
nvm cache remove all
nvm list cached            # список версий из кэшированных архивов
```

[`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors) (по умолчанию `true`) разрешает удаление из кэша. Политика может установить `false`; тогда удаление сообщает, что заблокировано.

При удалении с `--purge` может также удаляться соответствующий кэшированный архив этой версии.

## См. также

- [Изолированные установки](../guide/air-gapped-installations) — пошаговый офлайн-процесс
- [Локальные установки](./local-installations)
- Справка по команде: [`nvm cache`](../command/cache/)
- Настройки: [`cache_downloads`](../cfg/core#downloads-and-mirrors), [`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors)
- Политика: [`LocalInstallDir`/`LocalInstallOnly`](../cfg/registry)
