---
title: SIEM
sidebar_label: SIEM
sidebar_position: 7
certified:
  edition: Advanced Logging
---

import SiemQuery from '@site/docs/_components/SiemQuery';

# SIEM

SIEM — Security Information and Event Management (управление информацией и событиями безопасности).
SIEM собирает журналы с многих устройств в одно хранилище.
Вы ищете в нём инциденты, пробелы политики и инвентарь.

NVM for Windows пишет активность Node.js в **NVM for Windows/Operational**.
Отправьте этот канал в SIEM, чтобы видеть, какие версии Node.js работают в организации, кто их ставил или удалял, и когда правило firewall или malware блокировало пакет.
[Advanced Logging](../features/certified-builds/advanced-logging) добавляет `EventName` и JSON `Payload`.
Используйте эти поля, когда запрос должен назвать событие, а не разбирать свободный текст.

Это руководство показывает, как собрать канал, затем даёт стартовые запросы.

См. [Коды ошибок](../troubleshooting/error-codes) для каждого значения `NVM####`.
`NVM4312` — это `EventData.Code == 4312`. Уберите префикс `NVM`.

## Сбор этого журнала \{#collect-this-log\}

| Элемент | Значение |
|:-|:-|
| Канал | `NVM for Windows/Operational` |
| Provider | `NVM for Windows` |
| GUID provider | `{4c0f8d8e-2d6b-4f93-9f0f-3f0d7b4e2d11}` |

Certified MSI регистрирует этот provider и включает канал.
Направьте сборщик на этот канал.
Не собирайте только журнал Windows Application.
Предупреждения Application, например **NVM4101**, — отдельный поток.

Структурированные события требуют дополнение Advanced Logging или лицензию Governance.
Без этой лицензии классические события всё равно содержат `Code`.
В них нет `EventName` и `Payload`.

## Как запрашивать \{#how-to-query\}

| Нужно | Фильтр |
|:-|:-|
| Структурированный info, warning или error | Event ID **120**, **121** или **122** |
| Код NVM | `Code` (только число) |
| Именованное событие жизненного цикла или аудита | `EventName`, затем разберите `Payload` как JSON |
| Каждый запуск `node.exe` | Event ID **120** `nodejs.executed`, когда включён `log_executions`. Event **200** не используется |

`Payload` — строка JSON.
`Code` — отдельный `UInt32`.
Не ищите номер NVM внутри `Payload`.
`Code` равен `0`, когда событие не является условием `NVM####`.

Сборщики по-разному разворачивают EventData. Если поле из примера отсутствует, используйте имена, которые создала ваша платформа.

| | Microsoft Sentinel | Splunk | Elastic | Event Viewer |
|:-|:-|:-|:-|:-|
| Канал | `EventLog` | `Channel` | `winlog.channel` | имя журнала |
| Event ID | `EventID` | `EventCode` | `winlog.event_id` | `EventID` |
| Имя события | `EventData.EventName` | `EventData.EventName` | `winlog.event_data.EventName` | `Data[@Name='EventName']` |
| Payload | `EventData.Payload` | `EventData.Payload` | `winlog.event_data.Payload` | `Data[@Name='Payload']` |
| Code | `EventData.Code` | `EventData.Code` | `winlog.event_data.Code` | `Data[@Name='Code']` |
| Computer | `Computer` | `Computer` | `winlog.computer_name` | — |

<SiemQuery id="nvmCode" />

## Версии Node.js в работе \{#nodejs-versions-in-use\}

Event ID **120** `nodejs.executed` пишет каждый запуск shim, когда включён `log_executions`.
`Payload.NodeVersion` — версия. Event ID **200** не используется.

<SiemQuery id="versionsInUse" />

Число узлов для того же события:

<SiemQuery id="nodejsExecuted" />

## Кто установил версию Node.js \{#who-installed-a-nodejs-version\}

<SiemQuery id="installedVersions" />

## Кто установил Node.js 20 \{#who-installed-nodejs-20\}

<SiemQuery id="installedNode20" />

Смените `20.` на другую major-версию или на EOL-линейку из вашей политики.
Событие само EOL не помечает.

## Кто удалил версию Node.js \{#who-uninstalled-a-nodejs-version\}

<SiemQuery id="uninstalledVersions" />

## Какая версия стала по умолчанию \{#which-version-became-the-default\}

<SiemQuery id="versionActivated" />

## Установки пакетного менеджера: разрешено или запрещено \{#package-manager-installs-allowed-or-blocked\}

Certified Builds пишут `package_manager.install`, когда межсетевой экран модулей разрешает или запрещает установку.
**NVM4408** — разрешение.
**NVM4403** — запрет.
Блок malware это событие не пишет. Используйте **NVM4602**.

<SiemQuery id="packageManagerInstall" />

## Блоки malware \{#malware-blocks\}

<SiemQuery id="malwareBlocks" />

Смотрите `Payload` для имени пакета, версии если известна, команды, `source` и `reason`.

## Сбои проверки целостности \{#integrity-verification-failures\}

Отказ Authenticode / trust — **NVM4301**. Несовпадение FileVersion `node.exe` с папкой — **NVM4314**.

<SiemQuery id="integrityFailures" />

## Блоки version firewall \{#version-firewall-blocks\}

Отказ Certified `VersionAllowList` / `VersionBlockList` — **NVM4411**.

<SiemQuery id="versionFirewall" />

## Блоки lifecycle-скриптов \{#lifecycle-scripts-blocked\}

HKLM `BlockPackageManagerLifecycleScripts` пишет **NVM4412** (`package_manager.lifecycle_scripts_blocked`) на Certified Builds с Advanced Logging, когда proxy переписывает **install-команду** (`install`, `ci`, `add`, `update`, `rebuild` и похожие; `npx` с пакетом; голый `yarn`). `npm --version` и `npm run` не пишут. Lock на эти команды всё равно действует. Это аудит, не сбой install. Community не пишет это событие. Смотрите `Payload.command`, `Payload.verb` и `Payload.action`.

<SiemQuery id="lifecycleScriptsBlocked" />

## Изменения конфигурации \{#configuration-changes\}

<SiemQuery id="configurationChanges" />

## Шаблоны Event ID \{#event-id-templates\}

Windows Event ID — шаблон.
Это не номер NVM.

| Event ID | Источник | Поля |
|:-|:-|:-|
| 100 | `nvm.exe` info | `Source`, `Message`, `Code` |
| 101 | `nvm.exe` warning | `Source`, `Message`, `Code` |
| 102 | `nvm.exe` error | `Source`, `Message`, `Code` |
| 120 | структурированный info | `Source`, `EventName`, `Payload`, `Code` |
| 121 | структурированный warning | `Source`, `EventName`, `Payload`, `Code` |
| 122 | структурированный error | `Source`, `EventName`, `Payload`, `Code` |
| 200 | не используется | Остаток манифеста. Журнал запусков — Event ID **120** `nodejs.executed`. |
| 210 | shim info | `Source`, `Message`, `Code` |
| 211 | shim warning | `Source`, `Message`, `Code` |
| 212 | shim error | `Source`, `Message`, `Code` |

Event ID **200** не используется. Журнал запусков — Event ID **120**.

События безопасности от shim содержат `user`, `sid`, `hostname`, `parent_process`, `parent_pid`, `project_name` и `project_path`, когда процесс может их получить.
Пустое значение — `unknown`.

## Имена событий с Code 0 \{#event-names-with-code-0\}

Запрашивайте их по `EventName`.

| EventName | Что записывает |
|:-|:-|
| `nvm.system.changed` | Установка, удаление и похожие результаты жизненного цикла. Payload: `Action`, `NodeVersion`, `Outcome`, `User`, `sid`, `hostname`, `correlation_id`. |
| `nvm.configuration.changed` | Изменение настройки. Payload: `Configuration`, `Value`, `Old`, `Outcome`. |
| `nvm.version.activated` | Сменилась активная версия Node.js. Payload: `version`, `previous_version`, `user`, `hostname`. |
| `nodejs.executed` | Запуск `node`, когда `LogExecutions` = `1`. Источник `node-shim`. Если allow-флаги были переданы, добавлены или удалены, payload содержит `permission_allow.supplied`, `permission_allow.applied` и `permission_allow.removed`. |
| `package_manager.executed` | Запуск `npm`, `yarn`, `pnpm` или похожего на Certified Build, когда `LogExecutions` = `1`. Источник `proxy`. |

## Имена событий с кодом NVM \{#event-names-that-carry-an-nvm-code\}

Сопоставьте `Code` с номером в [Кодах ошибок](../troubleshooting/error-codes).

| EventName | Code | Источник |
|:-|:-|:-|
| `verify_key.open_failed` | 4312 | `nvm.exe` на Certified Build. Community Build пишет Event ID 102 с тем же кодом. |
| `node.security.verification_failed` | 4301 | `node-shim` или `proxy` |
| `node.security.activation_blocked` | 4302 или 4305 | `nvm.exe` использует 4302. Proxy использует 4305. |
| `node.security.cache_state_changed` | 4303 | `node-shim` или `proxy` |
| `node.security.full_verification_recovered` | 4304 | `node-shim` или `proxy` |
| `node.security.version_mismatch` | 4314 | `node-shim` или `proxy`. PE FileVersion не совпадает с папкой установки. |
| `node.security.version_firewall_blocked` | 4411 | `node-shim` или `proxy`. Certified `VersionAllowList` / `VersionBlockList` отклонил версию. |
| `package_manager.lifecycle_scripts_blocked` | 4412 | `proxy`. Только Advanced Logging. HKLM lock lifecycle-скриптов на install-команде. |
| `network.deadline_exceeded` | 4501 | `nvm.exe` или `sync.exe` |
| `malware.definitions_updated` | 4601 | `sync.exe`. Только Advanced Logging. |
| `malware.package_blocked` | 4602 | Shim. Только Advanced Logging. |
| `firewall.elevation_required` | 4404 | `nvm.exe` |
| `firewall.invalid_rule` | 4405 | `nvm.exe` |
| `firewall.untrusted_module_changed` | 4406 | `nvm.exe` или `proxy` |
| `firewall.remote_request` | 4407 | `nvm.exe` |
| `firewall.remote_allowed` | 4407 | `nvm.exe` |
| `firewall.remote_trust_allowed` | 4407 | `nvm.exe` |
| `firewall.remote_unauthorized` | 4401 | `nvm.exe` |
| `firewall.remote_failed` | 4402 или 4409 | `nvm.exe` или `proxy`. 4409 — хост недоступен. |
| `firewall.remote_blocked` | 4403 | Только `nvm.exe`. Событие proxy с тем же именем использует код 0. |
| `firewall.policy_mutated` | 4410 | `nvm.exe` |
| `firewall.policy_mutate_failed` | 4410 | `nvm.exe` |
| `package_manager.install` | 4403 или 4408 | `proxy` на Certified Build. 4403 — запрет. 4408 — разрешение. |
