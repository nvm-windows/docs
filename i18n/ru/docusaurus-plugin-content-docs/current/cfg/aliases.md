---
title: Псевдонимы
sidebar_label: Псевдонимы
sidebar_position: 1.5
---

# Псевдонимы

Псевдоним (alias) — короткое имя, которое вы задаёте для конкретной версии Node.js.
Вместо `20.19.1` везде можно писать `legacy` — и использовать это имя с install, use, uninstall и другими командами версий.

Зарезервированные имена вроде `latest` и `lts` встроены в NVM for Windows.
Создать псевдоним с такими именами нельзя.
Как разрешаются reserved-имена и ваши псевдонимы: [Разрешение версий](../guide/version-resolution).

## Зачем нужны псевдонимы \{#why-use-aliases\}

- Стабильная метка для версии, которую команда считает «текущим LTS для приложений» или «legacy CI»
- Переназначить метку при апгрейде (`nvm alias add modern 24.11.0`) без переписывания всех скриптов
- Короткие повседневные команды: `nvm use modern` вместо полного semver

## Создать и использовать псевдоним \{#create-and-use\}

Установите версию (если её ещё нет), затем задайте имя:

```powershell
nvm install 20.19.1
nvm alias add legacy 20.19.1
```

```text
"legacy" now refers to v20.19.1
```

Псевдоним принимается везде, где ожидается version specifier:

```powershell
nvm use legacy
nvm install legacy
nvm uninstall legacy
```

Список ваших псевдонимов:

```powershell
nvm alias list
```

```text
legacy -> v20.19.1
```

Обновить существующее имя — снова `add` (может быть запрос подтверждения; `--silent` пропускает его):

```powershell
nvm alias add legacy 22.14.0 --silent
```

Удалить ненужные имена:

```powershell
nvm alias remove legacy
nvm alias remove legacy modern
```

```text
1 alias removed successfully.
```

Полный справочник команд: [`nvm alias`](../command/nvm/alias/).

## Повседневные примеры \{#everyday-examples\}

```powershell
# Имена версий, между которыми вы переключаетесь чаще всего
nvm alias add apps 22.14.0
nvm alias add tools 24.11.0

nvm use apps
node -v
# v22.14.0

nvm use tools
node -v
# v24.11.0

# В скриптах и документации можно писать «use apps» вместо закреплённого semver
nvm use apps
npm test
```

Частичные версии при создании псевдонима допустимы — они сохраняются как конкретный релиз:

```powershell
nvm alias add next 24
nvm alias list next
```

```text
next -> v24.11.0
```

(Точный patch зависит от того, какой newest matching `24` был в момент `alias add`.)

## Имена, которые нельзя использовать \{#names-you-cannot-use\}

| Имя | Почему |
|:-|:-|
| `default`, `current`, `latest`, `lts`, `last` | Встроенная семантика команд |
| `daily`, `alpha`, `beta`, `prerelease` | Зарезервировано на будущее |
| `link`, `shim` | Имена режимов работы |
| `lts/*` (например `lts/iron`) | Зарезервированное пространство LTS |

Берите имена вроде `legacy`, `apps`, `ci` или `stable24`.

## Политика флота (Governance) \{#fleet-policy\}

На флотах Governance администраторы могут задать список машинной политики `Aliases` (запись `alias=version` на строку).
Когда эта политика задана, она владеет картой псевдонимов и блокирует пользовательские псевдонимы из `nvm alias`.

См. [Административные шаблоны](ad), [Справочник политики реестра](registry) и [Governance](../features/certified-builds/governance).

## Связанные материалы \{#related\}

- [`nvm alias`](../command/nvm/alias/) — add, list и remove
- [Разрешение версий](../guide/version-resolution) — как разрешаются псевдонимы, `lts` и файлы проекта
- [Сценарии команд](../guide/command-workflows) — псевдонимы в повседневной работе
