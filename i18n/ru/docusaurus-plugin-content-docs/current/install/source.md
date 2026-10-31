---
sidebar_label: Сборка из исходников
sidebar_position: 3
---

# Сборка из исходников

Установите готовый пакет, если вам не нужно собирать продукт из исходников.
См. [Установщики](./installers).

:::info[Только Community Build]
Эта страница описывает открытый пайплайн Inno Setup.
[Certified Builds](../guide/builds/) (пакеты MSI и Intune, ADMX, SBOM) собираются закрытыми инструментами.
Эти файлы доступны в [клиентском портале](https://portal.author.io).
:::

## Предварительные требования

Установите эти инструменты до сборки.

|Инструмент|Примечания|
|:-|:-|
|Windows 10/11 (amd64 или arm64)|Хост может собрать другую архитектуру. Передайте `-Architecture`.|
|[Go](https://go.dev/dl/)|Версия в `cli/src/go.mod` (сейчас **1.26.2**).|
|[qgo](https://github.com/quikdev/go)|Обёртка сборки Go для CLI. Добавьте `qgo` в `PATH`.|
|[Zig](https://ziglang.org/download/)|Точная версия в `shim/.zigversion` (сейчас **0.15.2**).|
|[Inno Setup](https://jrsoftware.org/isdl.php)|**6.7.1+**. Добавьте `ISCC.exe` в `PATH`. Setup EXE требует этот инструмент.|
|[go-winres](https://github.com/tc-hib/go-winres)|Встраивает ресурсы Windows. Скрипт сборки запускает `go install`, если инструмента нет.|
|Git|Клонируйте с submodules.|
|PowerShell|Запустите `.\build\main.ps1` из корня репозитория.|
|Сеть (для `-DownloadSync`)|Загружает готовый `sync.exe` из релиза GitHub.|

Добавьте `GOBIN` или `GOPATH\bin` в `PATH`.
Сборка должна находить инструменты, которые `go install` записывает в эту папку.

## Получение исходников

Публичный репозиторий связывает CLI, общие библиотеки, shim и установщик как Git submodules.

```
nvm/
├── bin/          # создаётся сборкой
├── .dist/        # установщик + staged-артефакт sync для release
├── build/        # скрипты Community Build
├── cli/          # nvm.exe (Go)
├── common/       # общие Go-модули
├── shim/         # node/proxy/reshim (Zig)
└── installer/    # Inno Setup
```

```powershell
git clone --recurse-submodules https://github.com/nvm-windows/nvm.git
cd nvm
```

Если в клоне нет submodules, выполните:

```powershell
git submodule update --init --recursive
```

:::warning[Закрытый репозиторий sync]
`sync.exe` (`doctor` и `upgrade`) можно использовать бесплатно.
`sync.exe` не собирается из публичных исходников.
`sync.exe` не входит в основные операции nvm.
`sync.exe` управляет путём обновления и обслуживания для Community Builds и Certified Builds.
Этот путь использует URL сервисов Author.
Своя сборка должна предоставить свою программу обновления и обслуживания.

В каждом community-релизе GitHub два файла на архитектуру:

- `nvm-<version>-<arch>-setup.exe` — установщик Inno Setup
- `nvm-<version>-<arch>-sync.exe` — готовый sync для сборки из исходников

Передайте **`-DownloadSync`**.
`.\build\main.ps1` тогда загружает этот файл sync в `bin\utils\sync.exe` перед упаковкой.
:::

## Сборка

Выберите одну процедуру сборки ниже.

### Полная публичная сборка (рекомендуется)

Эта процедура собирает CLI и shim.
Она загружает готовый `sync.exe`.
Она собирает установщик Inno Setup.

```powershell
.\build\main.ps1 -DownloadSync
```

`.\build.ps1` вызывает тот же скрипт.

Загрузка использует тег `v` плюс поле `version` в `cli/src/manifest.json`.
Репозиторий — `nvm-windows/nvm`.
Имя артефакта — `nvm-<version>-<arch>-sync.exe`.
Этот релиз уже должен существовать.
[Рабочий процесс community-релиза](https://github.com/nvm-windows/nvm/blob/main/.github/workflows/release.yml) загружает `*-setup.exe` и `*-sync.exe` при публикации.

### Только компоненты (публичная)

Соберите один компонент:

```powershell
.\build\main.ps1 -Component Cli
.\build\main.ps1 -Component Shims
.\build\main.ps1 -Component Sync -DownloadSync
```

### Maintainer / CI

Если вы можете читать закрытый submodule sync, не передавайте `-DownloadSync`.
Скрипт тогда собирает sync из исходников.

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
|`-Architecture`|`amd64`, `arm64`|Целевой процессор. Не передавайте параметр, чтобы определить его автоматически.|
|`-Component`|`All` (по умолчанию), `Cli`, `Shims`, `Sync`|Что собирать. Установщик требует `All`.|
|`-DownloadSync`|switch|Загрузить `*-sync.exe` из релиза. Не собирать закрытые исходники sync.|
|`-SyncReleaseTag`|tag|Заменить тег релиза. По умолчанию `v` плюс версия из манифеста CLI.|
|`-SyncReleaseRepo`|`owner/repo`|Заменить репозиторий загрузки. По умолчанию `nvm-windows/nvm`.|
|`-SkipInstaller`|switch|Пропустить setup EXE. Используйте только с `-Component All`.|
|`-BinRoot`|path|Заменить каталог вывода бинарников.|

Код выхода `0` означает успех.
Ненулевой код выхода останавливает скрипт на первом неудачном шаге.

## Результат

Сборка записывает эти файлы.

|Артефакт|Путь|
|:-|:-|
|CLI|`bin\nvm.exe`|
|Node shim|`bin\.shim\node.exe`|
|Утилиты|`bin\utils\proxy.exe`, `reshim.exe`, `sync.exe`|
|Установщик|`.dist\nvm-<version>-<arch>-setup.exe`|
|Staged-артефакт sync|`.dist\nvm-<version>-<arch>-sync.exe`|

`<version>` берётся из `cli/src/manifest.json`.
DLL sync worker не входят в пакет.
Среда выполнения загружает эти DLL с `assets.nvm-windows.com`, когда они нужны.

## Установка собранного

Запустите setup EXE как **обычный пользователь**.
Не запускайте его от имени администратора с повышением прав.
Следуйте правилам [установщика Community Build](./installers#community-build).

```powershell
.\.dist\nvm-<version>-<arch>-setup.exe
```

Затем установите Node.js:

```powershell
nvm install lts
```

Чтобы позже удалить локальную сборку, следуйте [Удалению](./uninstall#community-builds).

### Только бинарники (portable)

Передайте `-SkipInstaller`, чтобы запускать `bin\nvm.exe` из своей структуры во время разработки.
Рабочая установка использует пакет Inno Setup.
Этот пакет регистрирует PATH, настройки, обработчики протокола и данные удаления.

## Компоненты

У каждого компонента одна роль.

|Компонент|Язык|Публичные исходники?|Роль|
|:-|:-|:-:|:-|
|`cli`|Go|✓|`nvm.exe`. Установка, use, list, config и cache.|
|`shim`|Zig|✓|Shim `node.exe`, `proxy.exe` и `reshim.exe`. См. [режимы работы](../features/modes).|
|`sync`|Go|—|Фоновый помощник обновления и doctor (`sync.exe`). Используйте `-DownloadSync` или исходники maintainer.|
|`installer`|Inno Setup|✓|Setup EXE Community Build для пользователя.|

## Устранение неполадок

Используйте эту таблицу, когда сборка завершается с ошибкой.

|Симптом|Что проверить|
|:-|:-|
|`qgo` not found|Установите [qgo](https://github.com/quikdev/go). Добавьте его в `PATH`.|
|Неверная версия Go/Zig|Сверьте версии с `cli/src/go.mod` и `shim/.zigversion`.|
|Нет исходников sync / ошибка сборки|Ожидаемо для публичного клона. Передайте `-DownloadSync`. Или соберите только `-Component Cli` или `-Component Shims`.|
|`-DownloadSync` 404|Опубликуйте релиз с `nvm-<version>-<arch>-sync.exe`. Совпадайте с `cli/src/manifest.json`. Или передайте `-SyncReleaseTag` для существующего тега.|
|Ошибка установщика|Установите Inno Setup **6.7.1+**. Добавьте `ISCC.exe` в `PATH`. Проверьте, что в `cli/src/manifest.json` есть `version`, `appUserModelId` и `appId`.|
|Нет `go-winres`|Скрипт сборки запускает `go install github.com/tc-hib/go-winres@latest`. Добавьте `GOPATH\bin` в `PATH`. Запустите сборку снова.|
|Пустой submodule / нет кода|Выполните `git submodule update --init --recursive`. Публичные клоны включают cli, common и shim. Submodule sync остаётся закрытым.|

Шаги CI и релиза Community Build описаны в [`build/README.md`](https://github.com/nvm-windows/nvm/blob/main/build/README.md).

## См. также

|Тема|Документ|
|:-|:-|
|Готовые установщики|[Установщики](./installers)|
|Community Build и Certified Build|[Выбор сборки](../guide/builds/)|
|Удаление|[Удаление](./uninstall)|
|Режим shim и link|[Режимы работы](../features/modes)|
