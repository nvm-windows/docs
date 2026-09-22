---
title: Package Manager Shims
sidebar_label: Package Manager Shims
sidebar_position: 3
slug: /command/package-manager-shims
---

# Package Manager Shims

В режиме **shim** менеджеры пакетов не запускаются напрямую из каталога активной версии Node.js. NVM for Windows ставит в `PATH` hardlink (или копии) одного Zig-бинарника — **`proxy.exe`** — под именами вроде `npm.exe`, `npx.exe`, `yarn.exe` и `pnpm.exe`.

Proxy разрешает активную версию Node.js (те же правила, что у [node shim](/command/node)), проверяет доверие, затем делегирует соответствующему инструменту в этой установке.

Глобальные CLI, установленные этими менеджерами (например `tsc`), используют тот же механизм `proxy.exe` — см. [Global Module Shims](/command/global-module-shims).

## Как работает `proxy.exe`

1. Читает basename вызова (`npm`, `yarn`, …) из `argv[0]`.
2. Разбирает и убирает флаги shim (`--nvm-use`, `--nvm-which`, `--nvm-shim-version`).
3. Проверяет self-integrity при запуске из `{DataRoot}/.shim/*.exe` (побайтовое сравнение с каноническим `{DataRoot}/proxy.exe`).
4. Разрешает Node.js (preference / detection / `--nvm-use`) и при необходимости автоустанавливает.
5. Проверяет, что каталог версии безопасен (не reparse point, не writable другими пользователями) — отказ → **NVM4305**.
6. Находит делегированную команду в установке Node (`.exe`, затем `.cmd`, затем `.bat`).
7. Применяет ограничения package manager, если действует политика (npm / npx / pnpm / yarn).
8. Проверяет доверие к `node.exe` и делегированной цели (ниже).
9. Запускает реальный инструмент (для npm/npx/corepack часто `node.exe` + `*-cli.js`; иначе `.exe` / `.cmd`).

Канонический бинарник: `{DataRoot}/proxy.exe`. Shim на команду: `{DataRoot}/.shim/{name}.exe` (hardlink или копия `proxy.exe`).

`reshim` обновляет эти hardlink после установок, изменений глобальных пакетов и связанных событий (также для [shim глобальных модулей](/command/global-module-shims)).

## Поддерживаемые менеджеры пакетов

Имена, которые proxy считает constrained package managers:

| Команда | Типичная цель в активной установке Node |
|---------|------------------------------------------|
| `npm` | `npm.cmd` / `node_modules/npm/bin/npm-cli.js` |
| `npx` | `npx.cmd` / `node_modules/npm/bin/npx-cli.js` |
| `pnpm` | `pnpm.cmd` / `.exe` (также сканируется `PNPM_HOME\bin`) |
| `yarn` | `yarn.cmd` / `.exe` |
| `corepack` | entry `corepack` / `node_modules/corepack/dist/corepack.js` (если есть) |

Те же флаги `--nvm-*` работают на этих командах:

```powershell
npm --nvm-which --version
npm --nvm-use=22 install
pnpm --nvm-shim-version
```

При включённом `auto_install` отсутствующие auto-detected версии Node предлагаются/устанавливаются так же, как для `node`.

После операций, затрагивающих globals (например `npm install -g`, yarn global/dlx/plugins, corepack enable/use), proxy может вызвать **reshim**, чтобы появились новые [shim глобальных CLI](/command/global-module-shims).

## Проверка целостности

Shim блокирует запуск при провале проверок доверия.

### Бинарник shim

| Объект | Проверка |
|--------|----------|
| `{DataRoot}/.shim/{name}.exe` | Содержимое должно совпадать с `{DataRoot}/proxy.exe` |
| `{DataRoot}/.shim/node.exe` | Содержимое должно совпадать с каноническим node shim в program-root |

Несовпадение → `shim integrity check failed`, код `1`.

### Разрешённый `node.exe`

Тот же путь verify-cache / Authenticode, что у [node shim](/command/node). Смена состояния кэша может дать **NVM4303**; недоверенный Node → **NVM4301**.

### Делегированные цели package manager

| Тип цели | Проверка |
|----------|----------|
| JS entry npm / npx / corepack (`npm-cli.js`, `npx-cli.js`, `corepack.js`) | SHA-256 + TPM-подписанная запись **script trust** cache |
| Делегированный `.exe` | Тот же verify-cache путь, что для `node.exe` |
| Делегированный `.cmd` / `.bat` | SHA-256 + TPM-подписанная запись script trust cache |

Записи доверия пишутся при установке/активации версий или reshim (`SignVersionScripts` / хуки sign в `nvm`). Если скрипт изменился с момента доверия или записи нет — запуск блокируется (**NVM4306**). Исправление: `nvm reshim`, переустановка версии или `nvm doctor --autofix` по ситуации.

:::warning
Одного доверия к `node.exe` недостаточно для менеджеров пакетов. Entrypoint-скрипты тоже должны совпадать со script trust cache (SEC-04).
:::

## Схема размещения

```text
{DataRoot}/
  proxy.exe                 # канонический shim менеджеров / globals
  .shim/
    npm.exe                 # hardlink/копия proxy.exe
    npx.exe
    yarn.exe
    pnpm.exe
    <global-cli>.exe        # см. Global Module Shims
    node.exe                # отдельный node shim
  .verify/                  # материал публичного ключа verify-cache
{InstallRoot}/vX.Y.Z/
  node.exe                  # настоящий OpenJS Node.js
  npm.cmd / npx.cmd / ...
  node_modules/...
```

## См. также

- [Global Module Shims](/command/global-module-shims)
- [node (shim)](/command/node)
- [Режимы работы](/features/modes)
- [`nvm use shim`](/command/nvm/use/shim)
- [Коды ошибок](/troubleshooting/error-codes) — NVM4301, NVM4303, NVM4305, NVM4306
