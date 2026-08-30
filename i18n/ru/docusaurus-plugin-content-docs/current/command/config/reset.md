---
title: reset
sidebar_position: 4
sidebar_label: reset
---

# nvm config reset

Сброс параметра(ов) конфигурации к значениям по умолчанию.

**Псевдоним:** `rm`

## Использование

```powershell
nvm config reset <name> [flags]
nvm config reset all [flags]
```

## Подкоманды

| Подкоманда | Описание |
|------------|----------|
| *(по умолчанию)* | Сброс одного параметра по имени. |
| [`all`](./reset#reset-all) | Сброс всех параметров, кроме защищённых (см. ниже). |

## Аргументы

| Аргумент | Обязательный | Описание |
|----------|--------------|----------|
| `<name>` | Да (одиночный сброс) | Параметр конфигурации для сброса. |

## Флаги

| Флаг | Краткий | Описание |
|------|---------|----------|
| `--quiet` | `-q` | Подавить несущественный вывод (только для `reset all`). |

## Сброс всех параметров \{#reset-all}

`nvm config reset all` удаляет переопределения HKCU, чтобы снова применялись значения по умолчанию.

**Сохраняются (не сбрасываются):**

- [`root`](../../cfg/core#mode-and-install-location) — каталог установки остаётся настроенным
- `active_version` — указатель текущей версии по умолчанию
- `access_token`, `access_key` — значения лицензирования (используйте `nvm license set` / `nvm license clear`)
- Параметры, управляемые политикой — пропускаются со строкой сводки

## Примеры

```powershell
nvm config reset cache_downloads
nvm config reset root --quiet
nvm config reset all
nvm cfg rm all
```

## Пример вывода

```powershell
Reset 18 configuration option(s) to default.
Skipped 1 policy-managed option(s): node_mirror
```

## Проверенная расшифровка (локальный запуск)

```powershell
PS> nvm config reset --help
Usage: nvm config reset (rm) <command> [flags]

Flags:
  -q, --quiet   Suppress non-essential output.

Commands:
  all      Reset all configuration options to defaults except root.
  option   Reset one configuration option to its default (e.g. nvm config reset cache_downloads).
```
