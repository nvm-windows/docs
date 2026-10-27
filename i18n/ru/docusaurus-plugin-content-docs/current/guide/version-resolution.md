---
title: Разрешение версий
sidebar_position: 1
---

import VersionConstraintTable from '../_components/VersionConstraintTable.mdx';
import VersionSpecifierTable from '../_components/VersionSpecifierTable.mdx';

# Разрешение версий

NVM for Windows принимает несколько способов указать версию Node.js. В зависимости от контекста ввод может называть один релиз, обозначать линейку релизов или описывать допустимый диапазон. NVM for Windows разрешает этот ввод в конкретную версию Node.js перед выполнением операции.

Есть два вида ввода версии:

- **Спецификатор версии** — аргумент командной строки для операций.
- **Ограничение версии** — описание допустимых версий в файле проекта.

## Спецификаторы версий

Спецификаторы версий — токены, передаваемые командам вроде `install`, `use` и `uninstall`.

<VersionSpecifierTable />

Команды, принимающие спецификаторы версий:

- [`nvm install`](../command/nvm/install)
- [`nvm uninstall`](../command/nvm/uninstall)
- [`nvm use`](../command/nvm/use)
- [`nvm pin`](../command/nvm/pin)
- [`nvm alias add`](../command/nvm/alias/add)
- [`nvm cache add`](../command/nvm/cache/add)
- [`nvm cache remove version`](../command/nvm/cache/remove/version)

### Примеры

```powershell
# зарезервированные alias
nvm install lts
nvm use latest

# именованная LTS-линейка
nvm install lts/iron

# частичные и точные версии
nvm use 24.1
nvm cache add 22.14.0

# пользовательский alias
nvm alias add stable 24.1.0
nvm use stable
```

## Ограничения версий

Ограничения версий описывают допустимые релизы в файлах закрепления и auto-detect. В отличие от спецификатора в командной строке, ограничение может соответствовать диапазону релизов.

<VersionConstraintTable />

Ограничения могут встречаться в следующих файлах проекта:

| Источник | Типичное содержимое | Поведение |
|--------|-----------------|----------|
| `.nvmrc` | Точная версия или ограничение | Auto-detect разрешает подходящую версию. |
| `.node-version` | Точная версия или ограничение | Тот же путь разрешения, что и у `.nvmrc`. |
| `package.json` `engines.node` | Точная версия или semver-ограничение | Auto-detect трактует это как ограничение. Если версия по умолчанию ему удовлетворяет, NVM for Windows её сохраняет. |

Настроенные файлы auto-detect задаются параметром [`auto_detect`](../cfg/core#project-detection-and-auto-behavior). По умолчанию NVM for Windows проверяет `.nvmrc`, `.node-version` и `package.json`.

### Как ограничение выбирает установленную версию

1. Если версия по умолчанию удовлетворяет ограничению, NVM for Windows использует версию по умолчанию.
2. Если версия по умолчанию не удовлетворяет ограничению, NVM for Windows использует новейшую установленную версию, которая удовлетворяет.
3. Если ни одна установленная версия не подходит, NVM for Windows может установить совпадение при включённом `auto_install`. Открытые нижние границы вроде `>=16` или `>20` в этом случае берут самый старый релиз из каталога.

Это относится к `engines.node` и к диапазонам в `.nvmrc` или `.node-version`.

Пример: по умолчанию `13.14.0`, в `engines.node` стоит `>=8.9`. `13.14.0` удовлетворяет диапазону, поэтому `node` остаётся на `13.14.0`.

Пример: по умолчанию `13.14.0`, в `engines.node` стоит `>=20`. `13.14.0` не подходит, поэтому `node` берёт новейшую установленную версию 20+.

## Порядок разрешения {/* #resolution-order */}

1. Пользовательский alias (из `nvm alias add`)
2. Зарезервированные alias (`latest`, `lts`, `lts/<codename>`)
3. Частичные версии, расширенные до наилучшего подходящего релиза
4. Semver-ограничения в сценариях с учётом ограничений (например `engines.node` или caret/tilde в detect-файлах)
5. Чтение строки версии из настроенного detect-файла в текущем дереве каталогов (auto-detect)
6. Применение [`auto_use`](../cfg/core#project-detection-and-auto-behavior), [`auto_install`](../cfg/core#project-detection-and-auto-behavior) и связанных настроек при переключении или установке

## Auto-detect версии Node.js по проекту

В режиме shim NVM for Windows читает auto-detect-файлы в текущем каталоге. Список по умолчанию: `.nvmrc`, `.node-version`, затем `package.json`. Побеждает первый файл, из которого получается версия.

Если ни один файл не даёт версию, NVM for Windows использует версию по умолчанию (`nvm default`).

Порядок во время запуска shim:

1. `--nvm-use` / `--nvm-use=<version>` (только этот запуск)
2. Auto-detect-файл в текущем каталоге, если включён `auto_use`
3. Версия по умолчанию

`nvm list` и `nvm default` по-прежнему показывают только версию по умолчанию. Они не показывают, какую версию shim запустит в этом каталоге.

## Как увидеть, какую версию запустит shim

Флага `--nvm-use-which` нет. `--nvm-use` подменяет версию на один запуск. `--nvm-which` печатает, как shim разрешил версию, затем выполняет команду.

```powershell
node --nvm-which --version
npm --nvm-which --version
```

Строка выглядит так:

```text
nvm version resolution: source=package.json requested=>=8.9 effective=>=8.9 resolved=13.14.0 node=C:\Users\...\node.exe
```

| Поле | Смысл |
|-------|---------|
| `source` | Почему выбрана эта версия: `system_default`, имя detect-файла вроде `package.json` или `.nvmrc`, либо `override` для `--nvm-use`. |
| `requested` | Исходная спецификация из этого источника. |
| `effective` | Спецификация после пользовательского alias. |
| `resolved` | Конкретная установленная версия. |
| `node` | Путь к настоящему `node.exe`. |

См. также [флаги shim `node`](../command/node#флаги-shim).

## Закрепление версии Node.js за проектом

`nvm pin` автоматически создаёт auto-detect-файлы. Команда принимает спецификатор версии, разрешает его и записывает точную версию в auto-detect-файл.

```powershell
# задать активную версию, затем закрепить .nvmrc
nvm use 24
nvm pin 24 --file=.nvmrc

# задать package.json engines.node, engines.npm и эквивалентные devEngines
nvm pin 24 --file=package.json
```

## Связанные материалы

- [Команды](/commands)
- [Сценарии команд](./command-workflows)
