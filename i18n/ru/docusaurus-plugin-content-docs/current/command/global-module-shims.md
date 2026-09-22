---
title: Global Module Shims
sidebar_label: Global Module Shims
sidebar_position: 4
slug: /command/global-module-shims
---

# Global Module Shims

В режиме **shim** глобально установленные CLI (всё, что кладёт `.cmd` рядом с активной установкой Node — например `tsc`, `eslint`, `prettier`) не вызываются напрямую из этого каталога. NVM for Windows ставит hardlink (или копию) **`proxy.exe`** в `PATH` как `{DataRoot}/.shim/{name}.exe`.

Менеджеры пакетов (`npm`, `npx`, `yarn`, `pnpm`, `corepack`) используют тот же бинарник `proxy.exe`; см. [Package Manager Shims](/command/package-manager-shims). [node shim](/command/node) — отдельный бинарник.

## Как шимится глобальная команда

1. Устанавливаете глобальный пакет (например `npm install -g typescript`).
2. Установка (или позже proxy-triggered **reshim**) сканирует basenames `*.cmd` в каталоге активной версии Node.
3. Для инструментов pnpm `reshim` также сканирует `PNPM_HOME\bin`, если задан, и всегда обеспечивает shim `pnpm`.
4. Для каждого найденного имени создаётся `{DataRoot}/.shim/{name}.exe` как hardlink/копия `{DataRoot}/proxy.exe`.
5. Запуск `my-global-tool` попадает в proxy. Proxy:
   - Разбирает `--nvm-use` / `--nvm-which` / `--nvm-shim-version` (те же флаги, что у node shim)
   - Разрешает активную версию Node.js
   - Проверяет доверие (self, `node.exe`, делегированная цель)
   - Находит `my-global-tool.cmd` / `.exe` / `.bat` в этой установке и запускает

Встроенный prewarm-список: `node`, `npm`, `npx`, `yarn`, `pnpm`. Остальные globals появляются после install + reshim.

```powershell
npm install -g typescript
# reshim выполняется после глобальных установок при необходимости
tsc --version
tsc --nvm-which --version
tsc --nvm-use=22 --version
```

:::tip
Сам `node` — отдельный бинарник shim (не `proxy.exe`). Глобальные CLI и менеджеры пакетов делят `proxy.exe`.
:::

## Когда выполняется reshim

`reshim` обновляет hardlink после:

- Установки / активации версии Node
- Операций менеджеров пакетов, затрагивающих globals (например `npm install -g`, yarn global/dlx/plugins, corepack enable/use)
- Явного ремонта (`nvm doctor --autofix` / sync reshim)

Если новый глобальный CLI отсутствует в `PATH`, выполните reshim (или переустановите / активируйте версию), чтобы создать `{DataRoot}/.shim/{name}.exe`.

## Целостность

Глобальные shim используют тот же fail-closed путь доверия, что и менеджеры пакетов:

| Проверка | Поведение |
|----------|-----------|
| Self-check shim | `{DataRoot}/.shim/{name}.exe` должен побайтно совпадать с `{DataRoot}/proxy.exe` |
| `node.exe` | Verify-cache / Authenticode (**NVM4301** / **NVM4303**) |
| Делегированный `.cmd` / `.bat` / `.exe` | Script trust cache (SHA-256 + TPM-подпись) или verify-cache для `.exe` — отказ → **NVM4306** |
| Недоверенный self-update | Смена entrypoint вне `TrustedModules` → аудит **NVM4406** (deny / allow / prompt); см. [Firewall](/guide/firewall) |

Записи доверия пишутся при install, activation и reshim. Подробнее: [Package Manager Shims — Integrity](/command/package-manager-shims#integrity-verification).

## Размещение

```text
{DataRoot}/
  proxy.exe
  .shim/
    npm.exe              # менеджеры пакетов (тот же бинарник)
    tsc.exe              # пример hardlink глобального CLI → proxy.exe
    eslint.exe
    <global-cli>.exe
    node.exe             # отдельный node shim
{InstallRoot}/vX.Y.Z/
  tsc.cmd                # реальный лаунчер в активном Node
  node_modules/...
```

## См. также

- [Package Manager Shims](/command/package-manager-shims)
- [node (shim)](/command/node)
- [Режимы работы](/features/modes)
- [Коды ошибок](/troubleshooting/error-codes) — NVM4301, NVM4303, NVM4305, NVM4306, NVM4406
