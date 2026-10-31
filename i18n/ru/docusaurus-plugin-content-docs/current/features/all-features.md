---
title: Все возможности
sidebar_label: Все возможности
sidebar_position: 1.5
---

import PageLink from '@site/docs/_components/PageLink';
import PageDescription from '@site/docs/_components/PageDescription';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';

# Все возможности

На этой странице перечислены пользовательские возможности NVM for Windows v2.
Список взят из продукта (CLI, shim, настройки и лицензионные ограничения), а не только из раздела Features.
См. [Что нового в v2](./newv2) для короткой сводки.

<div class="all-features-table">

## Среда выполнения

| Возможность | Описание |
|:-|:-|
| [Режимы работы](./modes) | Режим shim или link. Режим можно сменить в любой момент. |
| Режим shim | Shim на Zig перехватывает `node` и команды менеджеров пакетов. См. [node shim](../command/node) и [Package Manager Shims](../command/package-manager-shims). |
| Режим link | Junction в PATH указывает на активный каталог Node.js. Перехвата команд нет. |
| Разовая смена версии | Передайте `--nvm-use` или `--nvm-use=<version>` shim-команде. NVM снимает этот флаг до запуска Node.js. |
| Показать разрешённый Node | Передайте `--nvm-which` shim-команде. Shim печатает источник, запрошенную версию, эффективную версию, путь, затем запускает Node.js. |
| [On / off](../command/nvm/on) | `nvm on` управляет Node.js. `nvm off` прекращает управление и снимает `.nodejs`. |
| Без обязательных прав администратора | Типичные пользовательские операции не требуют прав администратора. |

## Установка и версии

| Возможность | Описание |
|:-|:-|
| [Install](../command/nvm/install/) | Установка одной или нескольких версий Node.js. Спецификации: `latest`, `lts`, `lts/<codename>` и `x.x.x`. |
| Параллельные установки | Каждая запрошенная версия ставится в своей goroutine. |
| Компактные архивы `.7z` | Загрузки — архивы Windows `.7z` (x64 или arm64). Объём примерно на 40% меньше. |
| Нативная распаковка | NVM использует установленный 7-Zip, если он есть. Иначе встроенный распаковщик. |
| Принудительная переустановка | `--force` делает резервную копию существующей версии, затем ставит её заново. |
| Небезопасный TLS | `--insecure` или `allow_insecure_downloads` допускает просроченные или недействительные сертификаты TLS. |
| Копирование глобальных модулей | `--copy-from` копирует globals из другой установленной версии. `--from` ставит их заново. |
| Автоустановка globals | `auto_installed_modules` ставит заданный набор globals с каждой новой версией Node.js. |
| [Native tools](../command/nvm/install/native-tools) | `nvm install native-tools` запускает новейший `install_tools.bat` после проверки Authenticode. `allow_tool_install` может это запретить. |
| [Uninstall](../command/nvm/uninstall) | Удаление одной или нескольких версий. `--purge` также чистит кэш. `--from-apps` — тихое удаление из «Приложения и возможности». |
| [Use](../command/nvm/use/) | Назначить версию по умолчанию. `--install` может поставить отсутствующую. `--local` берёт последнюю установленную частичную версию. |
| [Use latest](../command/nvm/use/latest) | `nvm use latest` выбирает новейший установленный semver с `node.exe`. |
| [Use LTS](../command/nvm/use/lts) | `nvm use lts` или `nvm use lts <codename>`. |
| [Use last](../command/nvm/use/last) | Вернуть предыдущую версию по умолчанию (`last_version`). |
| [List installed](../command/nvm/list/) | Список установленных версий. Помечает default. JSON и фильтр major. |
| [List releases](../command/nvm/list/releases) | Каталог загрузок. Помечает установленные, кэшированные, LTS и security-релизы. |
| [Default](../command/nvm/default) | Показать версию по умолчанию и предыдущую. |
| [Псевдонимы](../cfg/aliases) | Имя версии через `nvm alias`. Зарезервированные имена вроде `latest` и `lts` запрещены. |
| Архитектура процесса | Архитектура архива следует процессу NVM (`amd64` → `x64`). Флага `--arch` нет. |

## Автоматизация

| Возможность | Описание |
|:-|:-|
| [Разрешение версий](../guide/version-resolution) | Версия из спецификатора, алиаса, имени LTS или файла проекта. |
| Файлы версий | По умолчанию: `.nvmrc`, `.node-version`, `package.json` и `package-lock.json`. Список можно изменить. |
| [Pin](../command/nvm/pin) | Записать версию в detect-файл или в `package.json` `engines`. Опциональная установка. |
| Auto-use по каталогу | В режиме shim читает файлы проекта и запускает этот Node.js без смены системного default. |
| Автоустановка отсутствующих версий | Установка нужной версии, если проекту её ещё нет. |
| Запрос автоустановки | `auto_install_prompt` спрашивает перед этой установкой. |
| Reshim | `nvm reshim` пересобирает [global module shims](../command/global-module-shims) и заново доверяет entrypoint менеджеров пакетов. |
| Job object | Дочерние процессы reshim завершаются вместе с родителем, чтобы не блокировать установки. |

## Кэш и офлайн

| Возможность | Описание |
|:-|:-|
| [Кэш загрузок](./cache) | Архивы Node.js на диске. `--cache` / `--no-cache` перекрывают `cache_downloads`. |
| [Cache add](../command/nvm/cache/add) | Загрузка в кэш без установки. |
| [Cache list / remove](../command/nvm/cache/) | Список или удаление архивов, метаданных, меток malware, `malware.db` и JWT зеркала. |
| [Локальные установки](./local-installations) | `local_dir` — источник архивов. `local_install_only` никогда не уходит в сеть. |
| [Изолированные установки](../guide/air-gapped-installations) | `air_gapped` пропускает live JWKS, использует офлайн COSE и кэшированный Authenticode. Certified MSI кладёт seed `malware.db` при сборке; live-лента важнее, когда доступна. Пропуск скана только если нет доверенного db. |
| [Зеркала загрузок](./mirrors) | Упорядоченные зеркала Node.js и URL реестра npm. Побеждает первый успешный ответ. |
| Сетевые дедлайны | Бюджеты каталога, зеркала, reachability и загрузки. `--relax-deadlines` и `--timeout-*-ms` перекрывают их. `nvm doctor` может измерить их. |

## Безопасность

| Возможность | Описание |
|:-|:-|
| Authenticode | WinVerifyTrust для `node.exe` и бинарников менеджеров пакетов. См. [Понимание безопасности](../guide/security). |
| Разрешённые издатели | `allowed_signers` — список организаций. `allowed_thumbprints` закрепляет leaf сертификата. |
| Отзыв | `authenticode_revocation`: `online`, `cached` или `disabled`. В air-gapped предпочтителен cached. |
| Verify cache | Подписанный кэш доверенных бинарников. Промах запускает полный Authenticode. `nvm reshim` засевает его заново. |
| Ужесточение DACL | Защищённые DACL на деревьях install, data, `.shim` и proxy. `nvm doctor --autofix` может восстановить их. |
| Самопроверка shim | Shim, запущенный из `.shim`, сравнивает себя с установленным shim. |
| Контроль каталога | Proxy блокирует менеджеры пакетов, если каталог активной версии Node.js доступен другим пользователям на запись (**NVM4305**). |
| Доверие делегированной команде | Proxy отклоняет неизвестный, без подписи или недоверенный entrypoint менеджера пакетов (**NVM4306**). Выполните `nvm firewall trust module <name>`. |
| [Malicious Package Blocker](./malicious-package-blocker) | Поиск имени/версии OpenSSF в подписанном `malware.db`. Не сканер файлов. Включён по умолчанию в режиме shim. |
| Проверки прямых зависимостей | Community Builds проверяют именованный пакет и прямые зависимости `package.json`. Lockfile не читают. |
| Проверки транзитивных зависимостей | Certified Builds также читают lockfile проекта. Проверяют его при запуске `node` в каталоге проекта. |
| Список разрешений malware | Шаблоны HKLM, которые снимают попадание OpenSSF. Сравнение по байтам. `*` снимает все попадания OpenSSF. |
| Список блокировки организации | Только Certified Builds. Дополнительные шаблоны блокировки HKLM. Community Builds игнорируют этот список. |
| Конфликт доверия malware | Только Certified Builds. `prevent` (по умолчанию) всё равно блокирует доверенное или одобренное попадание OpenSSF. `continue` пропускает такое доверие. |
| Пропуск проверок malware | `skip_malware_checks` пропускает поиск в shim. Файл определений всё равно обновляется. HKLM важнее. |
| [NVM Firewall](./firewall) | Ваши списки версий, модулей и доверия. Это не Malicious Package Blocker. |
| Version firewall | Governance. `nvm firewall allow version` и `deny version` пишут `VersionAllowList` / `VersionBlockList`. Без лицензии Governance списки игнорируются. |
| Module firewall | Governance. Разрешение или запрет установок npm/pnpm/yarn/npx/vlt по локальным спискам. Без лицензии Governance списки игнорируются. |
| Trust firewall | Community Builds и Certified Builds. `nvm firewall trust module` и `distrust module`. Семена по умолчанию: npm, npx, yarn, yarnpkg, corepack, pnpm и vlt. |
| Действие для недоверенного модуля | `prompt`, `allow` или `deny`, когда global CLI сам обновляется. |
| Модель прав Node | Shim добавляет `--permission` (Node 23+) или `--experimental-permission` (20–22). |
| Default / allowed grants | Вставка `--allow-*` из политики. Удаление токенов `--allow-*` вызывающего, которых нет в списке. |
| Аудит grant | Событие `nodejs.permission_grants`, когда флаги переданы, применены или удалены. Команда всё равно выполняется. |
| Заморозка V8 | Shim добавляет `--frozen-intrinsics` (Node 12+). |
| Запрет eval | Shim добавляет `--disallow-code-generation-from-strings`. |
| Минимальный возраст пакета | Cooldown для npm/npx/pnpm/yarn/yarnpkg, vlt и bun/bunx (если обёртка bun включена). Governance может форсировать. |
| Несовпадение менеджера пакетов | `pm_mismatch_action`: `ignore`, `warn` или `error`, когда npm/pnpm/yarn не совпадает с Node.js. |

## Менеджеры пакетов

| Возможность | Описание |
|:-|:-|
| [Package Manager Shims](../command/package-manager-shims) | Прокси `npm`, `npx`, `yarn`, `pnpm` и похожих команд через `proxy.exe`. |
| [Global Module Shims](../command/global-module-shims) | Reshim пишет shim в PATH для глобальных CLI. |
| Corepack | Proxy направляет yarn/pnpm через `corepack.js`. Reshim при enable, disable, prepare, hydrate и use. |
| vlt | Proxy считает `vlt` менеджером пакетов для argv firewall и global reshim. |
| Обёртка bun | Обёртка уже установленного `bun` / `bunx` для проверок OpenSSF. NVM не ставит bun и не переключает версии bun. По умолчанию выкл. в Community Builds. Вкл. в Certified Builds. |

## Интеграция с Windows

| Возможность | Описание |
|:-|:-|
| [Интеграция с приложениями Windows](./windows-apps) | Каждая установленная версия Node.js видна в «Приложения и возможности». |
| [Журналирование событий](./log) | Community Builds пишут критические события в журнал Windows Application. |
| Структурированное журналирование | Дополнение [Advanced Logging](./certified-builds/advanced-logging) для Certified Builds. Добавляет `EventName` и `Payload` для SIEM. См. [SIEM](../guide/siem). |
| [Уведомления на рабочем столе](./notifications) | Нативный Windows Notification Center. Пропущенные уведомления остаются, пока вы их не подтвердите. Обновление, установка или применение сборки прямо из уведомления. |
| Коллекции уведомлений | Mute Releases, Hotfixes, Pre-releases или News в параметрах Windows. `nvm config` не переключает mute ОС. |
| [Интеграция с реестром Windows](./windows-registry) | Пользовательские настройки в HKCU. На Certified Builds политика машины может перекрыть их. |
| Протокол `nvm://` | Действия уведомлений: upgrade (`Update` / `Install` / `Apply`), Trust firewall и mute уведомлений определений malware. |
| Подпись кода | Community Builds и Certified Builds подписаны кодом. Издатель — Author Software Inc. |

## Конфигурация и диагностика

| Возможность | Описание |
|:-|:-|
| [Config](../command/nvm/config/) | `nvm config`: list, get, set, reset и docs. Политика HKLM важнее HKCU. |
| [Env](../command/nvm/env) | Отчёт среды: зеркала, размеры, антивирус, флаги прав, лицензия. Есть JSON. |
| [Doctor](../command/nvm/sync-doctor) | Поиск и ремонт типичных проблем. `--autofix` может восстановить DACL и verify-cache. |
| [Upgrade](../command/nvm/sync-upgrade) | Обновление NVM for Windows. `disable_upgrade` блокирует обновление из приложения. |
| Новости и релизы | Фоновый sync показывает уведомления новостей и обновлений. `disable_announcements` скрывает их. Предупреждения об истечении лицензии остаются. |
| Задача sync | Фоновый цикл: лицензия, определения malware, новости и релизы. |

## Сборки, политика и дополнения

| Возможность | Описание |
|:-|:-|
| Dual Builds | Community Builds (MIT) и Certified Builds (EULA). См. <PageLink id="choosingABuild" />. |
| Режим Community-функций | Certified Build без коммерческой лицензии продолжает работать с возможностями Community. |
| Лицензия | Скрытая `nvm license` пишет HKLM. Certified Builds, Advanced Logging и Governance требуют sitewide-лицензию. |
| Уведомления об истечении лицензии | Certified Builds предупреждают за 7, 3 и 1 день, в день истечения и ежедневно в 7-дневном grace. |
| [Author Mirror](./author-mirror) | Хост Governance `https://mirror.author.io/runtime/nodejs`. Списки версий в JWT. EOL/ALPHA/MAINTENANCE требуют этот хост. |
| [Базовый HTTP-прокси](./http-proxy) | URL прокси, `user:pass` или Bearer. Fallback WinINET. Community Builds и Certified Builds. |
| [Расширенный прокси](./http-proxy#capabilities-by-license) | IWA (NTLM/Negotiate) и PAC/WPAD. Дополнение [Governance](./certified-builds/governance). |
| Административные шаблоны | ADMX/ADML блокируют или перекрывают настройки. См. [Administrative Templates](../cfg/ad) и [Governance](./certified-builds/governance). |
| [Active Directory](../install/enterprise/ad) | Развёртывание Certified Builds через GPO. |
| [Intune](../install/enterprise/intune) | Развёртывание Certified Builds как Win32-приложение. Установщик работает от System. |
| <PageLink id="trustArtifacts" /> | <TrustArtifactList format="inline" />. Дополнение Certified Builds. |
| <PageLink id="oem" label="sidebar" /> | <PageDescription id="oem" /> |

</div>
