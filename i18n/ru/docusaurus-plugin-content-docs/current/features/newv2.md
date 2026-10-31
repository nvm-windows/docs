---
sidebar_label: Что нового в v2
title: Что нового в v2
sidebar_position: 1
---

import PageLink from '@site/docs/_components/PageLink';
import PageDescription from '@site/docs/_components/PageDescription';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';

# Что нового в v2

## Обзор

*   **Без обязательных прав администратора**
*   **Современные рабочие процессы без symlink**
*   **Закрепление версий** — .nvmrc, .node-version, package.json или пользовательские файлы
*   **Более быстрые загрузки и установки**
*   **Автоустановка отсутствующих версий Node.js**
*   **Готовность для разработчиков и Enterprise**
*   **Полная переработка ради скорости и поддерживаемости** — Go и Zig
*   **Две сборки** — Community Builds (MIT) и Certified Builds (EULA)
*   **Блокировка вредоносных пакетов** — остановка известных вредоносных имён npm при установке

:::info[Подпись кода]
Community-сборки и certified-сборки подписаны кодом.
Издатель в подписи — Author Software Inc.
Управление проектом передано Author Software Inc. Команда та же.
:::

## Community & Certified Builds

:::info[Certified Builds]
Доступно сейчас.
:::

Community-сборка остаётся бесплатной и open-source (MIT). Certified-сборки добавляют опциональные **Trust Artifacts**, **Advanced Logging**, дополнение **Governance** и связанные элементы управления (см. [Выбор сборки](../guide/builds/index.md)).

## Установка Node.js

| Возможность | Подробности |
|:-|:-|
| Параллельные установки | Несколько версий Node.js одновременно |
| Меньший объём загрузок (40%) | Компактные архивы `.7z` |
| Нативная распаковка | Быстрее и с меньшей зависимостью от внешних unpacker |
| Локальные изолированные загрузки | Установка из локального каталога архивов (`local_dir` / кэш) офлайн или при ограничениях. Community Builds и Certified Builds. Политика флота и офлайн-лицензия Author-зеркала (`air_gapped`) требуют Governance. См. [Локальные установки](./local-installations) и [Изолированные установки](../guide/air-gapped-installations). |
| Кэширование | Переиспользование скачанных/распакованных ресурсов при повторных установках. См. [Кэш загрузок](./cache). |

:::tip[7-zip]
Не обязателен, но NVM for Windows использует нативный 7-Zip для распаковки, если он установлен. Проприетарные алгоритмы 7-Zip дают максимальную скорость. [7-Zip бесплатен](https://www.7-zip.org).

Если 7-Zip недоступен, используется более медленный встроенный распаковщик.
:::

## Режимы работы

Главное функциональное изменение — [режимы работы](./modes).

| Возможность | Подробности |
|:-|:-|
| Лёгкие shim | Shim на Zig для Node и связанных команд (`npm`, `npx` и т. д.) |
| Link mode с нулевой задержкой | Модель junction/symlink в PATH, когда перехват shim не нужен |

Режим shim открывает переключение версий по каталогу и другую автоматизацию. **Link mode** остаётся для legacy-сценариев и обхода редких моделей прав из v1.

## Автоматизация

| Возможность | Подробности |
|:-|:-|
| Переключение версии по каталогу | Выбор Node из текущего каталога (например, `.nvmrc`) в режиме shim. См. [Разрешение версий](../guide/version-resolution). |
| Автоустановка отсутствующих версий | Установка нужной версии, если проекту её ещё нет |
| Автоустановка глобальных модулей по умолчанию | Опционально заданный набор globals с каждой новой версией Node.js |

## Настройки

| Возможность | Подробности |
|:-|:-|
| Пользовательские алиасы | Короткие имена версий. См. [Псевдонимы](../cfg/aliases) и [`nvm alias`](../command/nvm/alias/). |
| Пользовательские глобальные модули по умолчанию | Пакеты, ставящиеся с каждой новой версией ([`auto_installed_modules`](../cfg/core#downloads-and-mirrors)) |
| Настройки реестра Windows | Пользовательские prefs через `nvm config`. Переопределения hive Policies требуют [Governance](./certified-builds/governance). См. [Базовая конфигурация](../cfg/core) и [Справочник политики реестра](../cfg/registry). |

## Нативные интеграции Windows

| Возможность | Подробности |
|:-|:-|
| Windows Apps | Установленные версии Node.js в «Приложения и возможности». См. [Интеграция с приложениями Windows](./windows-apps). |
| Windows Event Viewer | Операционные события в Event Viewer. См. [Журналирование событий](./log). |
| Desktop Notification Center | Обновления и уведомления в центре уведомлений Windows. См. [Уведомления на рабочем столе](./notifications). |
| Windows Registry | Пользовательские настройки в ключах реестра. См. [Интеграция с реестром Windows](./windows-registry). |

## Вредоносные пакеты \{#malicious-packages\}

v2 останавливает установку `npm`, `pnpm` или `yarn`, когда имя и версия пакета совпадают с набором [OpenSSF Malicious Packages](https://github.com/ossf/malicious-packages).
Проверка использует подписанный локальный файл (`malware.db`).
Это не сканер файлов.
Это не [module firewall](./firewall).

Community Builds проверяют именованный пакет и прямые зависимости `package.json`.
Они не читают lockfile.
Они не проверяют транзитивные зависимости.
Certified Builds также проверяют lockfile проекта — это разрешённый граф, включая транзитивные зависимости.
Certified Builds выполняют эту проверку lockfile при запуске `node` в каталоге проекта.

| Возможность | Подробности |
|:-|:-|
| Включено по умолчанию | Community Builds и Certified Builds в [режиме shim](./modes) |
| Community Builds | Именованный пакет при `npm install <name>` (и эквиваленты `pnpm` / `yarn`). Прямые зависимости `package.json` при голом `npm install`. Без lockfile. Без транзитивных зависимостей. |
| Транзитивные зависимости | Только Certified Builds. Имена и версии в lockfile проекта. Также проверяются при запуске `node` в каталоге проекта. |
| Malicious Package Blocker | Ключи пропуска, списки разрешений, уведомления и события. См. [Malicious Package Blocker](./malicious-package-blocker). |

## Безопасность и governance

_([Governance](./certified-builds/governance) дополнение)_

| Возможность | Подробности |
|:-|:-|
| Ограничение версий Node.js | Списки allow/block. См. [NVM Firewall](./firewall). Псевдонимы жизненного цикла вроде `EOL` требуют [Author Mirror](./author-mirror). |
| Управление настройками NVM | Блокировка или переопределение prefs через ADMX / GPO / Entra. См. [Administrative Templates](../cfg/ad). |
| Расширенная поддержка прокси | IWA (NTLM/Negotiate) и PAC/WPAD сверх базового HTTP proxy. См. [HTTP-прокси](./http-proxy). |
| Пользовательские зеркала Node.js | Зеркало Author с политиками (`mirror.author.io`) или другие одобренные зеркала. См. [Зеркала загрузок](./mirrors) и [Author Mirror](./author-mirror). |
| Интеграция Active Directory и Entra | Развёртывание/управление через AD и Intune. См. [Enterprise Deployment](../install/enterprise/requirements). |

## Trust artifacts и observability

| Возможность | Дополнение | Подробности |
|:-|:-|:-|
| <TrustArtifactList format="inline" /> | <PageLink id="trustArtifacts" /> | <PageDescription id="trustArtifacts" /> См. <PageLink id="choosingABuild" />. |
| Полностью аудируемое нативное журналирование | <PageLink id="advancedLogging" /> | <PageDescription id="advancedLogging" /> См. [Журналирование событий](./log) и [SIEM](../guide/siem). |
