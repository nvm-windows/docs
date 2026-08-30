---
sidebar_label: Базовая конфигурация
sidebar_position: 1
---

# Базовая конфигурация

Пользовательские настройки хранятся в реестре Windows. Управляйте ими через [`nvm config`](../command/config) (псевдоним: `nvm cfg`).

```powershell
nvm config list
nvm config get mode auto_use
nvm config set auto_install=true
nvm config reset auto_install
nvm config docs
```

На certified-флотах политика машины может переопределять эти значения. См. [Административные шаблоны](ad) и [справочник политик реестра](registry).

:::tip[Структурированная документация]
Используйте `nvm config docs --json` для машиночитаемых метаданных.
:::

## Режим и каталог установки \{#mode-and-install-location}

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
| `mode` | `shim` | `shim`, `link` | Определяет, как управляются команды и версии Node.js: через маршрутизацию shim или прямые junction/symlink. То же, что `nvm use shim`/`nvm use link`. См. [Режимы работы](../features/modes). |
| `root` | `%LOCALAPPDATA%\Author Software\nvm\installs` | Путь к каталогу | Корневой каталог установки версий Node.js. Изменение не переносит существующие установки — перенесите файлы вручную или переустановите версии. |

## Загрузки и зеркала \{#downloads-and-mirrors}

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
| `node_mirror` | `https://nodejs.org/dist` | Один или несколько URL | URL зеркала(зеркал) для загрузки Node.js. В `nvm config` передайте список через запятую. В реестре (`MirrorNode`) храните как **`REG_MULTI_SZ`** (один URL на запись) — не как одну строку `REG_SZ` с запятыми. См. [Зеркала загрузки](../features/mirrors). |
| `npm_mirror` | `https://registry.npmjs.org` | Один или несколько URL | URL зеркала(зеркал) реестра npm. Те же правила: через запятую в `nvm config`; **`REG_MULTI_SZ`** (`MirrorNpm`) в реестре. См. [Зеркала загрузки](../features/mirrors). |
| `cache_downloads` | `false` | Boolean | Кэшировать загруженные файлы для офлайн-использования. |
| `allow_download_cache_removal` | `true` | Boolean | Разрешить удаление кэшированных загрузок. |
| `allow_insecure_downloads` | `false` | Boolean | Разрешить загрузки при просроченных или недействительных SSL-сертификатах. |
| `auto_installed_modules` | _(нет)_ | Имена npm-пакетов через запятую | Список глобальных npm-модулей для автоматической установки с каждой новой версией Node.js. (`REG_MULTI_SZ` как `AutoInstallModuleList` в политике.) |

```powershell
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set node_mirror=https://mirror.author.io/runtime/nodejs,https://nodejs.org/dist
nvm config set cache_downloads=true
nvm config set auto_installed_modules=typescript,prettier
```

## Прокси \{#proxy}

Прокси автоматически определяются и применяются из переменных окружения `HTTP_PROXY`, `HTTPS_PROXY` или `NO_PROXY`.

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
|`proxy`|_(нет)_|URL|URL прокси в открытом виде. Скрыт из обычного вывода `cfg docs`, так как обычно определяется автоматически.|

На certified-сборках прокси обычно задаются политикой (см. [справочник реестра](registry)).

:::warning[Корпоративные прокси]
Community-сборка поддерживает базовые прокси. IWA, WPAD и PAC-прокси поддерживаются в Certified Builds, доступных с сентября 2026.
:::

## Обнаружение проекта и автоматическое поведение \{#project-detection-and-auto-behavior}

Эти параметры применяются в основном в режиме **shim** (и связанных сценариях `nvm pin`).

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
| `auto_detect` | `.nvmrc`, `.node-version`, `package.json` | Имена файлов через запятую | Файлы проекта для определения версии (только shim). |
| `default_detect_file` | `.nvmrc` | Имя файла | Файл по умолчанию при сохранении/закреплении версии в проекте. |
| `auto_use` | `true` | Boolean | Автоматически переключаться на обнаруженную версию для запуска скриптов без изменения системной версии (только shim). |
| `auto_install` | `false` | Boolean | Автоматически устанавливать отсутствующую обнаруженную версию (shim `node` + proxy: npm/npx/yarn/pnpm/globals; также `nvm pin`). |
| `auto_install_prompt` | `true` | Boolean | Запрашивать подтверждение перед автоматической установкой отсутствующей обнаруженной версии (shim `node` + proxy; также `nvm pin`). |

```powershell
nvm config set auto_install=true auto_install_prompt=false
nvm config set auto_detect=.nvmrc,.node-version
```

## Менеджеры пакетов \{#package-managers}

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
| `pm_mismatch_action` | `error` | `ignore`, `warn`, `error` | Действие при несовпадении версий npm/pnpm/yarn и Node.js во время install или use:<br/><br/><ul><li>ignore: без сообщений</li><li>warn: продолжить после предупреждения</li><li> error: остановить операцию (самый безопасный вариант по умолчанию)</li></ul>|

## Журналирование и объявления \{#logging-and-announcements}

| Параметр | По умолчанию | Значения | Описание |
|--------|---------|--------|-------------|
| `log_executions` | `false` | Boolean | Журналировать каждый вызов Node.js (например, `node file.js`). (только shim) |
| `disable_announcements` | `false` | Boolean | Отключить объявления проекта и релизов. Предупреждения об истечении лицензии всё равно показываются. |

```powershell
nvm config set log_executions=true
nvm config set disable_announcements=true
```

## Связанные настройки \{#related-settings}

_(не перечислены в `cfg docs`)_

| Тема | Где |
|-------|--------|
| Псевдонимы версий (`stable=24.x` и т. д.) | Предпочтительно [`nvm alias`](../command/alias); значения хранятся как `aliases` |
| Включение/отключение управления версиями | [`nvm on`](../command/on)/[`nvm off`](../command/off) (записывает `enabled`) |
| Активная/последняя версия | Управляется [`nvm use`](../command/use) (`active_version`, `last_version`) |
| Безопасность shim / флаги V8 | [Справочник реестра](registry) (`EnforcePermissionModel`, `FreezeV8GlobalObjects`, `DisableEvalAndStringExecution`) |
| Корпоративные блокировки (зеркала, списки разрешённых/заблокированных версий, прокси) | [Административные шаблоны](ad) и [политики реестра](registry) |

```powershell
nvm config docs
nvm config docs --json
```
