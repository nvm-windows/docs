---
sidebar_label: Firewall
sidebar_position: 6
---

# NVM Firewall

Основные средства контроля для установки версий Node, установки npm-пакетов и доверия к самообновляющимся глобальным CLI.

> Страница-руководство для `feature-firewall`. Перед релизом дополните скриншотами ADMX и примерами HTTPS policy contract.

## Компоненты

| Firewall | Редакция | Ключи | Эффект |
|----------|---------|------|--------|
| Version | Certified | `VersionAllowList` / `VersionBlockList` | Блокирует `nvm install` для запрещённых версий Node |
| Module | Certified | `ApprovedModules` / `ApprovedGlobalModules` | Блокирует npm/pnpm/yarn/npx install для запрещённых пакетов (shim mode) |
| Trust | Community + Certified | `TrustedModules`, `UntrustedModuleHandlerAction` | Автоматически перешимливает или показывает запрос, когда глобальный CLI самообновляется |

## Команды

```text
nvm firewall trust module <entry>...          # both editions (HKCU; --machine for HKLM)
nvm firewall trust module list|ls [--json]            # effective TrustedModules (HKLM overrides HKCU)
nvm firewall distrust module <entry>...
nvm firewall distrust module list|ls [--json]  # same TrustedModules list as trust module list
nvm firewall allow version <entry>...         # certified
nvm firewall deny version <entry>...          # certified (stored as NOT <entry>)
nvm firewall allow module [--global] <entry>...
nvm firewall deny module [--global] <entry>...
```

`trust module` / `distrust module` по умолчанию записывают пользовательские настройки. Для `--machine` нужны повышенные права. Команды Certified `allow`/`deny` всегда требуют повышенных прав.

## Значения по умолчанию

- `TrustedModules` пустой → `NOT ALL`, `npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm` (поставляемые менеджеры пакетов могут переподписываться; все остальные модули остаются недоверенными)
- `ApprovedModules` / `ApprovedGlobalModules` пустые → `ALL`
- `UntrustedModuleHandlerAction` → `prompt` (Y/N в консоли, когда терминал на переднем плане; иначе нативный toast с **Trust** / **Cancel**. Ответ Yes добавляет модуль в HKCU `TrustedModules` и перешимливает). Установите `allow`, чтобы перешимливать автоматически с тихим toast (без Trust/Cancel). Установите `deny`, чтобы пропустить запрос / авто-перешимливание. `nvm reshim` / script re-sign пропускают модули с изменениями на диске, если они не доверены или если handler не `allow`.
- Каждое изменение недоверенного модуля аудитируется как **NVM4406** (info, не error) в plain-text и структурированных логах, включая случаи, когда handler = `allow` или пользователь принимает запрос. Структурированные поля включают `path`, `before_digest` / `after_digest` и размеры, когда дайджесты недоступны (крупные бинарники).
- `FirewallHTTPTimeoutSeconds` → `3`
- `FirewallSkipLockfile` → `0` (false): использует ближайший lockfile при наличии (`package-lock.json` / `npm-shrinkwrap.json`, либо `pnpm-lock.yaml` / `yarn.lock` для соответствующих shim) для локального сопоставления и HTTPS policy POST; при `1` используется только `package.json`.

## Bare install (`npm install` без имён пакетов)

Для расширяемых install-команд (`npm install`, `pnpm install`, `yarn` и аналогичных) NVM определяет модули из ближайшего манифеста проекта:

1. Когда `FirewallSkipLockfile` = false (по умолчанию) и lockfile существует для активного shim, используются извлечённые пакеты lockfile для локальных правил и тела HTTPS POST (`text/plain`, имена построчно).
2. Иначе отправляются сырые байты `package.json` (`application/json`) с заголовком `x-nvm-package-shasum` (SHA-256 в hex для файла). POST-тела, полученные из lock, не отправляют `x-nvm-package-shasum`.

## HTTPS policy URL

Если список содержит единственный URL `https://…`, NVM отправляет POST на этот endpoint для удалённой проверки. Ожидается `200` (allow) или `403` (tab-delimited blocks: `name<TAB>date<TAB>reason`). TLS проверяется; опционально `TrustedFirewallSigners` / `TrustedFirewallThumbprint`. При таймаутах/ошибках работает fail closed.

Аутентифицированные policy-серверы получают короткоживущий (2 минуты) firewall JWT в `Authorization: ****** Форма claim:

- `desktop.pwd` — абсолютный рабочий каталог
- `nvm.shim` / `nvm.node_version` — проксируемая точка входа и активная версия Node
- `npm` | `pnpm` | `yarn` — `{ user, config, authenticated? }` для активного менеджера пакетов (остальные семейства опускаются). `user` — строка имени пользователя npm, когда известна (`null` иначе): из npmrc `:username` / `_auth` / JWT claims на **том же registry host**, что и основные credentials, или из локального identity cache. Если имя по-прежнему неизвестно при наличии credentials, NVM может один раз выполнить `npm whoami` (через `node` + `npm-cli.js`, в обход shim) и закешировать результат — на хуках login/whoami и при первом mint firewall JWT, где это нужно. Последующие mint выполняются офлайн. `authenticated` = `true`, когда в npmrc есть credentials (только локальная проверка). `npm logout` очищает cache. `config` — очищенное объединение npmrc/yarnrc.

Установите `ApplyVerboseFirewallMetadata`, чтобы также включать подробные identity claims (`idp_*`).

`User-Agent` — `NVM for Windows/<version> <build>`, где `<build>` это `community` или `certified`.

## Ограничения

Runtime-гейты module/trust работают только в shim mode. Link mode и менеджеры пакетов без проксирования обходят эти ограничения.

Человекочитаемый вывод списков firewall показывает максимум **20** записей, затем `and N more`, если правил больше (`--json` без ограничения).
