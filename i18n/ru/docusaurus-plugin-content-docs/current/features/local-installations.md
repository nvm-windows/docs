---
title: Локальные установки
sidebar_position: 9
---

Локальные установки позволяют NVM for Windows ставить Node.js из архивов, уже лежащих на диске, вместо (или до) обращения к зеркалу загрузки. Используйте для изолированных хостов, общих лабораторных зеркал или любой среды, где исходящие загрузки запрещены или нежелательны.

Это отличается от обычного [кэша загрузок](./cache): [`local_dir`](../cfg/registry#available-registry-keys) **заменяет** `.cache/versions` как корень архивов для установки. При [`local_install_only`](../cfg/registry#available-registry-keys) промах никогда не переключается на сеть.

## Настройки

| Опция | Реестр | По умолчанию | Эффект |
|--------|----------|---------|--------|
| [`local_dir`](../cfg/registry#available-registry-keys) | `LocalInstallDir` | _(не задан)_ | Каталог архивов Node.js `.7z` как источник установки |
| [`local_install_only`](../cfg/registry#available-registry-keys) | `LocalInstallOnly` | `false` | Устанавливать только из локального источника; ошибка, если архива нет |

Обе — переопределяемые настройки (часто задаются [политикой машины](../cfg/registry) в certified-парках). Они скрыты из обычного вывода `nvm config docs`, но работают через `nvm config`:

```powershell
nvm config set local_dir=D:\node-archives
nvm config set local_install_only=true
nvm config get local_dir local_install_only
```

:::tip[Политика]
Корпоративные развёртывания обычно фиксируют эти параметры через Administrative Templates / политику реестра, чтобы все машины использовали одну общую шару архивов. См. [`LocalInstallDir` / `LocalInstallOnly`](../cfg/registry).
:::

## Размещение архивов

Положите официальные Windows-архивы Node.js в [`local_dir`](../cfg/registry#available-registry-keys) (или в кэш версий по умолчанию, если [`local_dir`](../cfg/registry#available-registry-keys) не задан):

```text
D:\node-archives\
  node-v24.11.0-win-x64.7z
  SHASUMS256-v24.11.0-win-x64.txt   # опционально, но рекомендуется офлайн
  node-v22.20.0-win-x64.7z
  SHASUMS256-v22.20.0-win-x64.txt
```

- Имя архива: `node-v{version}-win-{x64|arm64}.7z` (архитектура совпадает с машиной).
- Опциональный файл SHASUM рядом с архивом: `SHASUMS256-v{version}-win-{arch}.txt`.

На подключённой машине можно заполнить каталог через [`nvm cache add`](../command/cache/add) и скопировать `.cache/versions` (или указать этот путь как [`local_dir`](../cfg/registry#available-registry-keys) на офлайн-хосте).

## Процесс установки

```powershell
nvm install 24.11.0
```

1. Поиск `node-v24.11.0-win-*.7z` в [`local_dir`](../cfg/registry#available-registry-keys) (или в `.cache/versions`, если [`local_dir`](../cfg/registry#available-registry-keys) не задан).
2. Проверка целостности (verify-cache, локальный SHASUM, доверенный путь политики или живой SHASUM зеркала онлайн).
3. Если найден и валиден → распаковка и установка.
4. Если отсутствует и **[`local_install_only=true`](../cfg/registry#available-registry-keys)** → ошибка `not found in local install directory` (без загрузки).
5. Если отсутствует и локальный режим выключен → загрузка с настроенных зеркал как обычно.

Политика машины с **обоими** `LocalInstallOnly` и `LocalInstallDir` считает архивы в этом каталоге доверенным локальным источником для проверки целостности офлайн (архивы всё равно должны лежать под настроенным корнем).

Пошаговый офлайн-процесс (prefetch → носитель/шара → настройка → установка) см. в [Изолированные установки](../guide/air-gapped-installations).

## См. также

- [Изолированные установки](../guide/air-gapped-installations) — пошаговый офлайн-процесс
- [Кэш загрузок](./cache) — хранилище `.cache/versions` по умолчанию и `--cache` / [`cache_downloads`](../cfg/core#downloads-and-mirrors)
- [`nvm install`](../command/install/) — флаги установки и заметки о локальном источнике
- [Политика реестра](../cfg/registry) — `LocalInstallDir`, `LocalInstallOnly`

:::info[`air_gapped`]
Отдельная настройка [`air_gapped`](../cfg/registry#available-registry-keys) управляет офлайн-проверкой лицензии/JWKS для зеркал Author. Сама по себе она **не** перенаправляет установки Node.js в локальный каталог архивов — для этого используйте [`local_dir`](../cfg/registry#available-registry-keys) / [`local_install_only`](../cfg/registry#available-registry-keys).
:::
