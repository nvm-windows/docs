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

- [`nvm install`](../command/install)
- [`nvm uninstall`](../command/uninstall)
- [`nvm use`](../command/use)
- [`nvm pin`](../command/pin)
- [`nvm alias add`](../command/alias/add)
- [`nvm cache add`](../command/cache/add)
- [`nvm cache remove version`](../command/cache/remove/version)

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
| `package.json` `engines.node` | Точная версия или semver-ограничение | Auto-detect разрешает версию, удовлетворяющую ограничению Node.js engine. |

Настроенные файлы auto-detect задаются параметром [`auto_detect`](../cfg/core#project-detection-and-auto-behavior). По умолчанию NVM for Windows проверяет `.nvmrc`, `.node-version` и `package.json`.

## Порядок разрешения {/* #resolution-order */}

1. Пользовательский alias (из `nvm alias add`)
2. Зарезервированные alias (`latest`, `lts`, `lts/<codename>`)
3. Частичные версии, расширенные до наилучшего подходящего релиза
4. Semver-ограничения в сценариях с учётом ограничений (например `engines.node` или caret/tilde в detect-файлах)
5. Чтение строки версии из настроенного detect-файла в текущем дереве каталогов (auto-detect)
6. Применение [`auto_use`](../cfg/core#project-detection-and-auto-behavior), [`auto_install`](../cfg/core#project-detection-and-auto-behavior) и связанных настроек при переключении или установке

## Auto-detect версии Node.js по проекту

В режиме shim NVM for Windows разрешает версию Node.js из auto-detect-файла (.nvmrc, .node-version, package.json и т. д.). Если версию определить нельзя, используется системная версия по умолчанию.

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
