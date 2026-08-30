---
title: Установки в изолированной среде
sidebar_position: 3
---

# Установки в изолированной среде

Это руководство описывает установку Node.js через NVM for Windows, когда целевая машина не может обращаться к публичным зеркалам загрузки (или не должна).

Контекст функций:

- [Локальные установки](../features/local-installations) — [`local_dir`](../cfg/registry#available-registry-keys)/[`local_install_only`](../cfg/registry#available-registry-keys)
- [Кэш загрузок](../features/cache) — `.cache/versions` и `nvm cache add`

## Выбор схемы

| Схема | Подходит для | Как |
|---------|----------|-----|
| **Предзагрузка в кэш по умолчанию** | Один ноутбук / несколько машин | `nvm cache add` на машине с сетью, копирование `%LOCALAPPDATA%\Author Software\nvm\.cache\versions` |
| **Общий [`local_dir`](../cfg/registry#available-registry-keys)** | Лаборатории, парки машин, USB/внутренние шары | Указать всем offline-хостам одну папку архивов и задать [`local_install_only=true`](../cfg/registry#available-registry-keys) |
| **Политика с локальным источником** | Certified/Governance-парки | Задать `LocalInstallDir` + `LocalInstallOnly` через [политику реестра](../cfg/registry) или ADMX |

Для более чем нескольких человек предпочтительнее общий [`local_dir`](../cfg/registry#available-registry-keys) (или политика), а не копирование личных папок кэша.

## 1. Предзагрузка архивов (машина с сетью)

На машине с доступом в сеть:

```powershell
nvm cache add 24 22 lts
nvm cache list versions
```

Архивы попадают в:

`%LOCALAPPDATA%\Author Software\nvm\.cache\versions\`

как `node-v{version}-win-{x64|arm64}.7z`. При необходимости рядом с каждым архивом храните `SHASUMS256-v{version}-win-{arch}.txt` для offline-проверки целостности.

Можно также вручную скачать Windows `.7z` (и SHASUM) с утверждённого зеркала Node.js и положить в ту же структуру.

## 2. Перенос контента offline

Скопируйте папку архивов на:

- USB / зашифрованный носитель
- Внутреннюю файловую шару
- SCCM/Intune/другую систему распространения контента

Пример структуры на шаре:

```text
\\files\software\node-archives\
  node-v24.11.0-win-x64.7z
  SHASUMS256-v24.11.0-win-x64.txt
  node-v22.20.0-win-x64.7z
  SHASUMS256-v22.20.0-win-x64.txt
```

Используйте архитектуру, соответствующую offline-машинам (`x64` или `arm64`).

## 3. Настройка offline-хоста

### Вариант A — общая папка (`local_dir`)

```powershell
nvm config set local_dir=\\files\software\node-archives
nvm config set local_install_only=true
nvm config get local_dir local_install_only
```

[`local_dir`](../cfg/registry#available-registry-keys) заменяет кэш версий по умолчанию как источник установки. При [`local_install_only=true`](../cfg/registry#available-registry-keys) отсутствующий архив приводит к ошибке вместо загрузки из сети.

### Вариант B — копирование в кэш по умолчанию

Скопируйте архивы в:

`%LOCALAPPDATA%\Author Software\nvm\.cache\versions\`

Затем всё равно задайте [`local_install_only=true`](../cfg/registry#available-registry-keys), если нужно заблокировать сетевой fallback (без [`local_dir`](../cfg/registry#available-registry-keys) установки сначала ищут в этом кэше).

### Вариант C — политика машины (certified)

Задайте в реестре/ADMX:

- `LocalInstallDir` → корень архивов
- `LocalInstallOnly` → `1`

См. [справочник политики реестра](../cfg/registry). Политика также может считать архивы в этом корне доверенным локальным источником целостности, когда оба ключа заданы.

## 4. Установка

```powershell
nvm install 24.11.0
nvm use 24.11.0
node -v
```

Ожидаемый путь: найти архив → проверка целостности → распаковка. Если архива нет и включён local-only, установка останавливается с `not found in local install directory`.

## 5. Обновление версий позже

Повторите предзагрузку на машине с сетью, когда утверждены новые релизы Node, обновите шару или носитель, затем снова выполните `nvm install` на offline-хостах. Менять [`local_dir`](../cfg/registry#available-registry-keys) не нужно, если путь к папке тот же.

## Устранение неполадок

| Симптом | Проверить |
|---------|--------|
| `not found in local install directory` | Точная строка версии; имя архива `node-v…-win-….7z`; arch совпадает с ОС; путь [`local_dir`](../cfg/registry#available-registry-keys) доступен |
| Ошибка целостности/SHASUM | Повреждённая копия; отсутствует или неверный SHASUM sidecar; перекопируйте с машины с сетью |
| Всё ещё пытается сеть | Проверьте [`local_install_only=true`](../cfg/registry#available-registry-keys) (или политику `LocalInstallOnly=1`) |
| Работает на одном ПК, не на другом | Несовпадение arch (`x64` vs `arm64`); другой [`local_dir`](../cfg/registry#available-registry-keys); переопределение политикой |

## Связанные материалы

- [Локальные установки](../features/local-installations)
- [Кэш загрузок](../features/cache)
- [`nvm install`](../command/install/)
- [`nvm cache`](../command/cache/)
- [Политика реестра](../cfg/registry)

:::info[Настройка `air_gapped`]
[`air_gapped`](../cfg/registry#available-registry-keys) управляет offline-поведением лицензии/JWKS для зеркал Author. Она **не** указывает установкам Node локальную папку архивов. Для этого используйте [`local_dir`](../cfg/registry#available-registry-keys)/[`local_install_only`](../cfg/registry#available-registry-keys) (или шаги выше).
:::
