---
title: config
sidebar_position: 10
sidebar_label: config
---

# nvm config

Просмотр и управление значениями конфигурации NVM for Windows.

**Псевдоним:** `cfg`

## Использование

```powershell
Usage: nvm config (cfg) <command>
```

## Подкоманды

| Подкоманда | Псевдонимы | Описание |
|------------|------------|----------|
| [`list`](./list) | `ls` | Список всех значений конфигурации (по умолчанию). |
| [`get`](./get) | — | Получить одно или несколько значений. |
| [`set`](./set) | — | Установить одно или несколько значений. |
| [`reset`](./reset) | `rm` | Сбросить одно значение или `reset all` для восстановления значений по умолчанию (сохраняет [`root`](../../cfg/core#mode-and-install-location)). |
| [`docs`](./docs) | — | Показать описания параметров. |

## Форматы значений `config set` {/* #config-set-value-formats */}

| Тип | Допустимые значения | Примеры |
|-----|---------------------|---------|
| Boolean | `true`, `false`, `1`, `0` | [`auto_install=true`](../../cfg/core#project-detection-and-auto-behavior) |
| List | Разделённые запятыми | [`auto_detect=.nvmrc,.node-version,package.json`](../../cfg/core#project-detection-and-auto-behavior) |
| URL | Требуются схема и хост | [`node_mirror=https://nodejs.org/dist`](../../cfg/core#downloads-and-mirrors) |
| Mode | Только `shim` или `link` | [`mode=shim`](../../cfg/core#mode-and-install-location) |

Некоторые параметры управляются политикой; запись блокируется, когда значение контролируется политикой.

## Примечания

- `config set mode=...` использует тот же путь, что и `nvm use shim|link`.
- `config set disable_announcements=...` также обновляет состояние запланированной задачи.
- Секретные значения (например, `access_token`) маскируются в выводе.
