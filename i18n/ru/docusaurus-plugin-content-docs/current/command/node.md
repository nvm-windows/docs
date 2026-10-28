---
title: node (shim)
sidebar_label: node (shim)
sidebar_position: 2
slug: /command/node
---

# node (shim)

В режиме **shim** команда `node` в `PATH` — это Zig-shim NVM for Windows (`node.exe`), а не бинарник OpenJS Node.js. Shim определяет, какую установленную версию Node.js запустить, затем запускает соответствующий `node.exe`.

Переключение режимов: [`nvm use shim`](/command/nvm/use/shim) / [`nvm use link`](/command/nvm/use/link). Контекст: [Режимы работы](/features/modes).

## Что делает shim

1. Разбирает флаги только для shim (ниже) и убирает их перед передачей дальше.
2. Разрешает версию Node.js (активное preference, файлы обнаружения, `--nvm-use`, алиасы).
3. При настройке может автоматически установить отсутствующую версию.
4. Проверяет целостность самого shim, если запуск из каталога `.shim` в data-root.
5. Проверяет целевой `node.exe` (verify-cache / Authenticode) перед spawn.
6. Запускает настоящий Node.js через `CreateProcessW` с оставшимися аргументами.

## Флаги shim

Эти флаги обрабатывает shim и **не** передаёт в Node.js. Их можно ставить в любом месте командной строки.

| Флаг | Назначение |
|------|------------|
| `--nvm-use <version>` | Один запуск с указанной версией Node.js (не меняет версию по умолчанию). |
| `--nvm-use=<version>` | То же, что `--nvm-use <version>`. |
| `--nvm-which` | Печатает, как разрешена версия (source, requested, effective, путь), затем продолжает. |
| `--nvm-shim-version` | Печатает версию исполняемого файла shim и завершается. |

```powershell
node --version
node --nvm-which --version
node --nvm-use 22 script.js
node --nvm-use=22 script.js
node --nvm-shim-version
```

Пример строки `--nvm-which`:

```text
nvm version resolution: source=system_default requested=24.16.0 effective=24.16.0 resolved=24.16.0 node=C:\Users\...\node.exe
```

## Разрешение версии

Без `--nvm-use` shim использует файлы проекта при включённом `auto_use`, затем версию по умолчанию. Диапазон вроде `engines.node` `>=8.9` не переключает на новейший установленный Node.js, если версия по умолчанию уже подходит. См. [Разрешение версий](/guide/version-resolution).

`--nvm-which` печатает источник этого решения. `--nvm-use` — только подмена на один запуск. Флага `--nvm-use-which` нет.

Обнаружение и автоустановка настраиваются (`auto_detect`, `auto_use`, `auto_install`, `auto_install_prompt`). См. [Базовая конфигурация](/cfg/core#project-detection-and-auto-behavior).

## Проверки целостности

| Проверка | Когда | Поведение |
|----------|-------|-----------|
| Self-check shim | Запуск из `{DataRoot}/.shim/node.exe` | Побайтовое сравнение с каноническим shim в program-root. Несовпадение → `shim integrity check failed`, код `1`. |
| Доверие к `node.exe` | Перед каждым spawn | Предпочтительно hit в подписанном **verify-cache** (~1–2 мс). Miss/invalid → полный Authenticode, затем PE FileVersion против папки. Отказ Authenticode → **NVM4301**. Несовпадение FileVersion → **NVM4314**. Certified version firewall → **NVM4411**. |

Если ключ или записи verify-cache отсутствуют, shim откатывается к полному Authenticode (медленнее, но безопасно). `nvm doctor` показывает состояние verify-cache.

## Задержка

Shim добавляет примерно 1–3 мс на разрешение. Windows всё равно платит `CreateProcessW` дважды (shim, затем Node). Типичный суммарный overhead ~25–35 мс против link mode. Подробнее: [Режимы работы](/features/modes).

## См. также

- [Package Manager Shims](/command/package-manager-shims) — `proxy.exe` для npm/npx/yarn/pnpm
- [Global Module Shims](/command/global-module-shims) — hardlink `proxy.exe` для глобальных CLI
- [`nvm use shim`](/command/nvm/use/shim)
- [Коды ошибок](/troubleshooting/error-codes) — NVM4301, NVM4314, NVM4411 и связанные коды безопасности
