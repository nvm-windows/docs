---
title: pin
sidebar_position: 4
sidebar_label: pin
---

# nvm pin

Создание или обновление файла run-command (например, `.nvmrc`).

## Использование

```powershell
Usage: nvm pin [<version>] [flags]
```

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `[<version>]` | Нет | [Спецификатор версии](../guide/version-resolution) для разрешения и записи. Если опущен, используется текущая активная версия. Форматы файлов pin: [Селекторы версий](../guide/version-resolution). |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--file` | `-f` | Целевой файл для записи. Должен быть в настроенном списке [`auto_detect`](../cfg/core#project-detection-and-auto-behavior). |
| `--install` | `-i` | Установить целевую версию при отсутствии. |
| `--no-install` | `-n` | Не выполнять автоустановку отсутствующей версии для этой команды. |

## Примеры

```powershell
# write current active version to default detect file
nvm pin

# write explicit version to .nvmrc
nvm pin 24

# write to .node-version
nvm pin 22.14.0 --file=.node-version

# write package.json engines.node/npm
nvm pin 24 --file=package.json

# install if missing before writing
nvm pin 24 --install

# force no-install behavior for this command
nvm pin 24 --no-install
```

## Пример вывода

```powershell
Successfully pinned .nvmrc Node.js version to v24.1.0
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm pin --help
Usage: nvm pin [<version>] [flags]

Flags:
	-f, --file=.nvmrc
	-i, --install
	-n, --no-install
```

## Примечания о поведении

- Для `package.json` команда обновляет `engines.node` и `engines.npm`.
- Для текстовых detect-файлов команда записывает нормализованное содержимое версии Node.js.
- Если `package.json` отсутствует в текущем каталоге, команда завершается ошибкой.

Эта команда фиксирует намерение среды выполнения проекта для автообнаружения в режиме shim.
