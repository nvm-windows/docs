---
title: NVM Firewall
sidebar_label: NVM Firewall
sidebar_position: 11
---

# NVM Firewall

NVM Firewall применяет **ваши** списки allow, deny и trust.

Это не [Malicious Package Blocker](./malicious-package-blocker).
Тот blocker использует публичную ленту OpenSSF известных вредоносных имён.

Это не [Author Mirror](./author-mirror).
Зеркало Author — хост загрузок.
Списки версий могут заполнять этот хост.

Проверки модулей и доверия работают в [режиме shim](./modes).
Режим link и менеджер пакетов без прокси эти проверки пропускают.

Malicious Package Blocker может также остановить тот же `npm install`.
См. [Malicious Package Blocker](./malicious-package-blocker).

## Состав \{#pieces\}

| Часть | Сборка | Ключи | Эффект |
|----------|---------|------|--------|
| Version | Certified Builds | `VersionAllowList` / `VersionBlockList` | Блокирует `nvm install` запрещённой версии Node.js. |
| Module | Certified Builds | `ApprovedModules` / `ApprovedGlobalModules` | Блокирует установку npm/pnpm/yarn/npx запрещённого пакета. |
| Trust | Community Builds + Certified Builds | `TrustedModules`, `UntrustedModuleHandlerAction` | Reshim или prompt, когда global CLI сам обновляется. |

## Команды \{#commands\}

```text
nvm firewall trust module <entry>...                 # both editions (HKCU; --machine for HKLM). Re-signs launchers; nvm reshim is not required.
nvm firewall trust module list|ls [--json]           # effective TrustedModules (HKLM overrides HKCU)
nvm firewall distrust module <entry>...
nvm firewall distrust module list|ls [--json]        # same TrustedModules list as trust module list
nvm firewall allow version <entry>...                # Certified Builds
nvm firewall deny version <entry>...                 # Certified Builds (stored as NOT <entry>)
nvm firewall allow module [--global] <entry>...
nvm firewall deny module [--global] <entry>...
```

`trust module` / `distrust module` по умолчанию пишут пользовательские prefs.
`--machine` требует повышения прав.
Certified `allow`/`deny` всегда требуют повышения прав.

## Блокировка неодобренных установок Node.js \{#block-unapproved-nodejs-installations\}

Certified Builds могут отклонять `nvm install` для версии Node.js, которой нет в allow-списке или которая попадает под deny-правило.
Клиент проверяет `VersionAllowList` / `VersionBlockList` до начала загрузки.
Локальная проверка работает без сети.

Статические записи — точный semver, маски (например `20.x`) и отрицание `NOT` / `!`.
Псевдонимы жизненного цикла вроде `EOL` на клиенте не раскрываются — [Author Mirror](./author-mirror) применяет их при выдаче архива.

```pwsh
nvm firewall allow version 20.x 22.x
nvm firewall deny version 18.x
```

Команды пишут политику машины и требуют повышения прав.
См. [ключи реестра Governance](../cfg/registry#governance-keys).

## Блокировка неодобренных запусков Node.js \{#block-unapproved-nodejs-invocations\}

Те же списки версий ограничивают и **использование** Node.js на Certified Builds.
`nvm use` и Certified-shim `node` отклоняют версию, запрещённую политикой (**NVM4411**).
Версия уже на диске список не обходит.

```pwsh
nvm firewall allow version 22.x
nvm firewall deny version 16.x
node -v   # fails when the active version is denied
```

## Блокировка неодобренных установок зависимостей \{#block-unapproved-dependency-installations\}

Certified Builds могут разрешать или запрещать установку пакетов в проект (`npm install`, аналоги `pnpm` / `yarn` и другие proxied-команды).
Без настроенных правил модулей разрешены все пакеты.

```pwsh
nvm firewall allow module eslint left-pad
nvm firewall deny module evil-package
```

На Certified Builds требуется повышение прав.
Сырые имена ключей политики — в [Справочнике политики реестра](../cfg/registry).

### Голая установка (`npm install` без имён пакетов) \{#bare-install\}

Для расширяемых команд установки (`npm install`, `pnpm install`, `yarn` и аналоги) **без имён пакетов в командной строке** NVM берёт модули из ближайшего манифеста проекта и применяет локальные правила allow/deny к этому набору:

1. **По умолчанию:** если для активного менеджера пакетов есть lockfile, используются пакеты из lockfile.
2. **Иначе:** используются зависимости из `package.json`.

Чтобы всегда брать только `package.json` (игнорировать lockfile), включите в политике **Skip lockfile for module firewall** — см. [ключи Governance](../cfg/registry#governance-keys).

## Блокировка неодобренных глобальных модулей \{#block-unapproved-global-module-installations\}

Глобальные установки (`npm install -g` и аналоги) используют **отдельный** список одобрения, не проектный.
Передайте `--global`, чтобы правило писалось в этот список.

```pwsh
nvm firewall allow module --global typescript
nvm firewall deny module --global unwanted-cli
```

Без настроенных глобальных правил разрешены все глобальные пакеты.
Сырые имена ключей политики — в [Справочнике политики реестра](../cfg/registry).

## Блокировка недоверенных изменений глобальных модулей \{#block-untrusted-global-module-changes\}

Глобальные CLI часто обновляют себя на месте.
Когда launcher на диске изменился и модуль **не** доверен, NVM for Windows может:

- `prompt` (по умолчанию) — спросить в консоли, если терминал на переднем плане; иначе native-уведомление с **Trust** / **Cancel**
- `allow` — auto-reshim с тихим уведомлением
- `deny` — без prompt и без reshim

Истекшее уведомление оставляет тихое follow-up в Центре уведомлений.

По умолчанию доверенны только bundled package managers (`npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm` и `vlt`).
Доверие к модулю переподписывает его launchers; отдельный `nvm reshim` не нужен.
Один `nvm reshim` не сохраняет доверие после следующего self-update.
Каждое изменение недоверенного модуля аудируется как **NVM4406** (info).

Защита есть в Community Builds и enforceable на Certified Builds.

```pwsh
nvm firewall trust module opencode
nvm firewall distrust module opencode
nvm config set untrusted_module_handler_action=prompt
nvm config set untrusted_module_handler_action=allow
nvm config set untrusted_module_handler_action=deny
```

`--machine` пишет в HKLM вместо пользовательского hive prefs.

## Значения по умолчанию \{#defaults\}

| Поведение | По умолчанию |
|:-|:-|
| Доверенные модули (пустой trust-список) | Только bundled package managers (`npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm`, `vlt`) |
| Списки allow для project / global (пустые) | Разрешить все пакеты |
| Действие при недоверенном модуле | `prompt` — см. пример выше |
| Lockfile при голой установке | Предпочитать lockfile, если есть — см. [Голая установка](#bare-install) |

Сырые имена реестра и prefs — в [Справочнике политики реестра](../cfg/registry).

## Ограничения \{#limits\}

Human-readable firewall list output shows at most **20** entries, then `and N more` when additional rules exist (`--json` is uncapped).

## Связанные материалы \{#related\}

- [Malicious Package Blocker](./malicious-package-blocker)
- [Author Mirror](./author-mirror)
- [Выбор сборки](../guide/builds/)
- [Справочник политики реестра](../cfg/registry)
