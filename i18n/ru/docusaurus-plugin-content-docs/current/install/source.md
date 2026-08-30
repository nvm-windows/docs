---
sidebar_label: Сборка из исходников
sidebar_position: 3
---

# Сборка из исходников

Большинству пользователей достаточно готового пакета — см. [Установщики](./installers).

:::info[Только Community Build]
Это руководство по открытому/неподписанному пайплайну Inno Setup. [Certified-сборки](../guide/builds/) (подписанные MSI/Intune, ADMX, SBOM и т.д.) собираются закрытыми инструментами и будут доступны в [клиентском портале](https://portal.author.io) с сентября 2026.
:::

## Предварительные требования

|Инструмент|Примечания|
|:-|:-|
|Windows 10/11 (amd64 или arm64)|На хосте можно кросс-собирать другую архитектуру через `-Architecture`.|
|[Go](https://go.dev/dl/)|Версия в `cli/src/go.mod` (сейчас **1.26.2**).|
|[qgo](https://github.com/quikdev/go)|Обёртка сборки Go для CLI (`qgo` в `PATH`).|
|[Zig](https://ziglang.org/download/)|Точная версия в `shim/.zigversion` (сейчас **0.15.2**).|
|[Inno Setup](https://jrsoftware.org/isdl.php)|**6.7.1+**, `ISCC.exe` в `PATH` (нужен для setup EXE).|
|[go-winres](https://github.com/tc-hib/go-winres)|Встраивание ресурсов Windows. Скрипт сборки ставит через `go install`, если отсутствует.|
|Git|Клон с submodules.|
|PowerShell|Запуск `.\build\main.ps1` из корня репозитория.|
|Сеть (для `-DownloadSync`)|Загрузка готового `sync.exe` с GitHub Release.|

Убедитесь, что `GOBIN`/`GOPATH\bin` в `PATH`, чтобы находились утилиты из `go install`.

## Получение исходников

Публичный community-монорепозиторий связывает CLI, общие библиотеки, shim и установщик через Git submodules:

```
nvm/
├── bin/          # создаётся сборкой
├── .dist/        # установщик + staged-артефакт sync для release
├── build/        # скрипты community-сборки
├── cli/          # nvm.exe (Go)
├── common/       # общие Go-модули
├── shim/         # node/proxy/reshim (Zig)
└── installer/    # Inno Setup
```

```powershell
git clone --recurse-submodules https://github.com/nvm-windows/nvm.git
cd nvm
```

Если клонировали без submodules:

```powershell
git submodule update --init --recursive
```

:::warning[Закрытый репозиторий sync]
`sync.exe` (`doctor` и `upgrade`) свободно доступен, но **не собирается из публичных исходников**. Не часть основных операций nvm. Управляет **путём обновления и обслуживания** в community- и certified-сборках, привязанным к URL и сервисам Author. Для кастомных сборок стоит реализовать своё sidecar-приложение обновления/обслуживания.

На community GitHub releases **два** артефакта на архитектуру:

- `nvm-<version>-<arch>-setup.exe` — установщик Inno Setup
- `nvm-<version>-<arch>-sync.exe` — готовый sync для сборки из исходников

Передайте **`-DownloadSync`**, чтобы `.\build\main.ps1` загрузил sync в `bin\utils\sync.exe` перед упаковкой.
:::

## Сборка

### Полная публичная сборка (рекомендуется)

Собирает CLI + shim, скачивает `sync.exe`, затем Inno Setup:

```powershell
.\build\main.ps1 -DownloadSync
```

`.\build.ps1` вызывает тот же скрипт.

Загрузка по тегу `v` + `version` из `cli/src/manifest.json` репозитория `nvm-windows/nvm`, артефакт `nvm-<version>-<arch>-sync.exe`. Release должен существовать — [community release workflow](https://github.com/nvm-windows/nvm/blob/main/.github/workflows/release.yml) публикует `*-setup.exe` и `*-sync.exe`.

### Только компоненты (публичная)

```powershell
.\build\main.ps1 -Component Cli
.\build\main.ps1 -Component Shims
.\build\main.ps1 -Component Sync -DownloadSync
```

### Maintainer / CI

При доступе к закрытому submodule sync можно собрать sync из исходников без `-DownloadSync`:

```powershell
.\build\main.ps1
```

### Частые параметры

```powershell
# Явная архитектура
.\build\main.ps1 -Architecture amd64 -DownloadSync
.\build\main.ps1 -Architecture arm64 -DownloadSync

# Другой опубликованный release для sync
.\build\main.ps1 -DownloadSync -SyncReleaseTag v2.0.0

# Только бинарники (без Inno Setup)
.\build\main.ps1 -DownloadSync -SkipInstaller

# Свой каталог вывода (по умолчанию .\bin)
.\build\main.ps1 -DownloadSync -BinRoot D:\out\nvm-bin
```

|Параметр|Значения|Назначение|
|:-|:-|:-|
|`-Architecture`|`amd64`, `arm64`|Целевой CPU. Без параметра — автоопределение.|
|`-Component`|`All` (по умолчанию), `Cli`, `Shims`, `Sync`|Что собирать. Installer требует `All`.|
|`-DownloadSync`|switch|Скачать `*-sync.exe` с release вместо сборки из закрытых исходников.|
|`-SyncReleaseTag`|tag|Переопределить тег release (по умолчанию: `v` + версия CLI manifest).|
|`-SyncReleaseRepo`|`owner/repo`|Переопределить репозиторий (по умолчанию: `nvm-windows/nvm`).|
|`-SkipInstaller`|switch|Пропустить setup EXE (только с `-Component All`).|
|`-BinRoot`|path|Каталог вывода бинарников.|

Код выхода `0` — успех. Иначе остановка на первом сбойном шаге.

## Результат

|Артеfact|Путь|
|:-|:-|
|CLI|`bin\nvm.exe`|
|Node shim|`bin\.shim\node.exe`|
|Утилиты|`bin\utils\proxy.exe`, `reshim.exe`, `sync.exe`|
|Installer|`.dist\nvm-<version>-<arch>-setup.exe`|
|Staged sync|`.dist\nvm-<version>-<arch>-sync.exe`|

`<version>` из `cli/src/manifest.json`. DLL sync worker не упаковываются — подгружаются с `assets.nvm-windows.com` при необходимости.

## Установка собранного

Запускайте setup EXE как **обычный пользователь** (не elevated Administrator), как для [community-установщика](./installers#community-build):

```powershell
.\.dist\nvm-<version>-<arch>-setup.exe
```

Затем установите Node.js:

```powershell
nvm install lts
```

Удаление локальной сборки — [Удаление](./uninstall#community-builds).

### Только бинарники (portable)

С `-SkipInstaller` можно запускать `bin\nvm.exe` из своей структуры для разработки. Для production по-прежнему используйте Inno Setup — PATH, настройки, protocol handlers и метаданные удаления.

## Компоненты

|Компонент|Язык|Публичные исходники?|Роль|
|:-|:-|:-:|:-|
|`cli`|Go|✓|`nvm.exe` — install/use/list/config/cache|
|`shim`|Zig|✓|shim `node.exe`, `proxy.exe`, `reshim.exe` ([режимы работы](../features/modes))|
|`sync`|Go|—|Фоновый helper update/doctor (`sync.exe`); `-DownloadSync` или исходники maintainer|
|`installer`|Inno Setup|✓|Per-user community setup EXE|

## Устранение неполадок

|Симптом|Что проверить|
|:-|:-|
|`qgo` not found|Установите [qgo](https://github.com/quikdev/go), добавьте в `PATH`.|
|Неверная версия Go/Zig|Сверьте с `cli/src/go.mod` и `shim/.zigversion`.|
|Нет исходников sync / ошибка сборки|Ожидаемо на публичных клонах. `-DownloadSync` или только `-Component Cli` / `-Component Shims`.|
|`-DownloadSync` 404|Нужен release с `nvm-<version>-<arch>-sync.exe`. Обновите `cli/src/manifest.json` или `-SyncReleaseTag`.|
|Ошибка installer|Inno Setup **6.7.1+** (`ISCC.exe` в `PATH`). Проверьте `version`, `appUserModelId`, `appId` в `cli/src/manifest.json`.|
|Нет `go-winres`|Скрипт пробует `go install github.com/tc-hib/go-winres@latest`. Добавьте `GOPATH\bin` в `PATH`.|
|Пустой submodule|`git submodule update --init --recursive` (публично: cli/common/shim; sync закрыт).|

CI и release для community — [`build/README.md`](https://github.com/nvm-windows/nvm/blob/main/build/README.md).

## См. также

|Тема|Документ|
|:-|:-|
|Готовые установщики|[Установщики](./installers)|
|Community vs certified|[Выбор редакции](../guide/builds/)|
|Удаление|[Удаление](./uninstall)|
|Shim vs link|[Режимы работы](../features/modes)|
