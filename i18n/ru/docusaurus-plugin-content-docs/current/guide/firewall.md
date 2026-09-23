---
sidebar_label: Брандмауэр
sidebar_position: 6
---

# Брандмауэр NVM

Базовые меры контроля для установки версий Node, установки npm-пакетов и доверия к самообновляющимся глобальным CLI.

> Страница-руководство для `feature-firewall`. Перед релизом добавьте скриншоты ADMX и примеры контракта HTTPS-политик.

## Компоненты

| Брандмауэр | Редакция | Ключи | Эффект |
|----------|---------|------|--------|
| Version | Certified | `VersionAllowList` / `VersionBlockList` | Блокирует `nvm install` для запрещённых версий Node |
| Module | Certified | `ApprovedModules` / `ApprovedGlobalModules` | Блокирует npm/pnpm/yarn/npx install для запрещённых пакетов (shim mode) |
| Trust | Community + Certified | `TrustedModules`, `UntrustedModuleHandlerAction` | Автоматически перевыпускает shim или показывает запрос, когда глобальный CLI самообновляется |

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

`trust module` и `distrust module` по умолчанию записывают пользовательские настройки. `--machine` требует повышения прав. Certified `allow`/`deny` всегда требуют прав администратора.

## Значения по умолчанию

- Пустой `TrustedModules` → `NOT ALL`, `npm`, `npx` (собственное обновление npm может переподписать бинарники; все остальные модули остаются недоверенными)
- Пустой `ApprovedModules` / `ApprovedGlobalModules` → `ALL`
- `UntrustedModuleHandlerAction` → `prompt` (Y/N в консоли, когда терминал на переднем плане; иначе нативный toast с **Trust** / **Cancel**. Yes добавляет модуль в HKCU `TrustedModules` и перевыпускает shim). Установите `allow` для автоперевыпуска shim с тихим toast (без Trust/Cancel). Установите `deny`, чтобы пропустить запрос/автоперевыпуск. `nvm reshim` / script re-sign пропускает модули с изменениями на диске, если они не доверены и если обработчик не `allow`.
- Каждое изменение недоверенного модуля аудируется как **NVM4406** (info, не error) в текстовых и структурированных логах, включая случаи, когда обработчик = `allow` или пользователь подтверждает запрос. Структурированные поля включают `path`, `before_digest` / `after_digest` и размеры, когда digest недоступны (крупные бинарники).
- `FirewallHTTPTimeoutSeconds` → `3`
- `FirewallSkipLockfile` → `0` (false): использует ближайший lockfile, если он есть (`package-lock.json` / `npm-shrinkwrap.json`, или `pnpm-lock.yaml` / `yarn.lock` для соответствующих shim) для локального сопоставления и HTTPS POST-политик; при `1` используется только `package.json`.

## «Пустая» установка (`npm install` без имён пакетов)

Для разворачиваемых install-команд (`npm install`, `pnpm install`, `yarn` и подобных) NVM определяет модули из ближайшего манифеста проекта:

1. Когда `FirewallSkipLockfile` = false (по умолчанию) и lockfile существует для активного shim, используются пакеты из lockfile для локальных правил и тела HTTPS POST (`text/plain`, имена через новую строку).
2. Иначе отправляются сырые байты `package.json` (`application/json`) с заголовком `x-nvm-package-shasum` (SHA-256 hex файла). POST-тела из lockfile не отправляют `x-nvm-package-shasum`.

## URL HTTPS-политики

Если список содержит один URL `https://…`, NVM отправляет POST на этот endpoint для удалённой проверки. Ожидается `200` (allow) или `403` (блокировки в таб-разделённом формате: `name<TAB>date<TAB>reason`). TLS проверяется; опционально `TrustedFirewallSigners` / `TrustedFirewallThumbprint`. При timeout/ошибках — fail closed.

Аутентифицированные policy-серверы получают короткоживущий (2 минуты) firewall JWT в `Authorization: ****** Claim shape:

- `desktop.pwd` — абсолютный рабочий каталог
- `nvm.shim` / `nvm.node_version` — проксируемая точка входа и активная версия Node
- `npm` | `pnpm` | `yarn` — `{ user, config, authenticated? }` для активного пакетного менеджера (другие семейства опускаются). `user` — строка имени пользователя npm, когда она известна (`null` иначе): из npmrc `:username` / `_auth` / JWT-claim на **том же registry host**, что и основной credential, или из локального кэша идентификации. Если имя всё ещё неизвестно при наличии credential, NVM может один раз выполнить `npm whoami` (через `node` + `npm-cli.js`, в обход shim) и закэшировать результат — в хуках login/whoami и при первом выпуске firewall JWT, где это требуется. Последующие выпуски происходят офлайн. `authenticated` = `true`, когда credential в npmrc присутствует (только локальная проверка). `npm logout` очищает кэш. `config` — очищенное объединение npmrc/yarnrc.

Установите `ApplyVerboseFirewallMetadata`, чтобы также включать расширенные identity-claims (`idp_*`).

`User-Agent`: `NVM for Windows/<version> <build>`, где `<build>` — `community` или `certified`.

## Ограничения

Контроли module/trust во время выполнения работают только в shim mode. Link mode и пакетные менеджеры без проксирования обходят эти меры контроля.

В человекочитаемом выводе списков firewall показывается максимум **20** записей, затем `and N more`, если правил больше (`--json` без лимита).
