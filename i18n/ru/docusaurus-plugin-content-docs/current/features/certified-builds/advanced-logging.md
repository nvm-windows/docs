---
title: Advanced Logging
sidebar_label: Advanced Logging
sidebar_position: 2
certified:
  edition: Advanced Logging
---

# Advanced Logging

Advanced Logging — дополнение для **Certified Builds**.
Для Community Builds см. [Basic Native Logging](../log).

[Certified Builds](../../guide/builds/) пишут в выделенный канал Event Viewer: **NVM for Windows/Operational**.
Certified MSI регистрирует этот канал при установке.
Канал не требует это дополнение.

Без Advanced Logging `nvm.exe` и shim всё равно пишут классические события в этот канал.
Классические события содержат `Source`, `Message` и `Code`.
В них нет `EventName` и `Payload`.

Advanced Logging пишет структурированные события в тот же канал.
У каждого структурированного события есть `EventName`, `Payload` и `Code`.
Сборщики запрашивают `EventData.Code` для значения `NVM####`.
Лицензия Governance тоже открывает эти структурированные события.

См. [SIEM](../../guide/siem) для настройки сборщика и запросов по парку.

## Что добавляет Advanced Logging \{#what-advanced-logging-adds\}

`Code` без этого дополнения всё равно идентифицирует условие `NVM####`.
Он не называет событие.
Он не называет пакет, пользователя, проект или родительский процесс.

С `EventName` и `Payload` можно запрашивать:

- Какие версии Node.js работают в организации, кто их ставил или удалял, и на каком узле.
- Какой пакет разрешил (**NVM4408**) или запретил (**NVM4403**) module firewall. Классический `Code` — только allow или deny.
- Каждый запуск `npm` / `yarn` / `pnpm` (`package_manager.executed`). Классическое журналирование это событие не пишет.
- Когда HKLM блокирует lifecycle-скрипты package manager на install-команде (`package_manager.lifecycle_scripts_blocked`, **NVM4412**). Классическое журналирование это событие не пишет.
- Блок malware как запись Event Log (`malware.package_blocked`). Без дополнения блок только в терминале.
- Сетевой дедлайн (`network.deadline_exceeded`). Классическое журналирование это событие не пишет.
- Запуск `node` от человека или агента (`parent_process`, `parent_pid`) и из какого проекта (`project_name`, `project_path`).
- Какие permission-флаги передал вызывающий, добавила или сняла политика (`permission_allow.*`).

Текстовый `Message` — для человека на этом устройстве.
Он может меняться.
Не считайте его схемой SIEM.
`EventName` и `Payload` — контракт для сборщика.
См. [SIEM](../../guide/siem) для стартовых запросов.

Certified Builds уже пишут в **NVM for Windows/Operational** без этого дополнения.

Установка, удаление, смена версии по умолчанию и изменения конфигурации всё равно появляются там.
У этих событий нет номера `NVM####`. `Code` = `0`, поэтому их нельзя отфильтровать как код ошибки.

Без этого дополнения в Operational не попадают: `package_manager.executed`, `package_manager.lifecycle_scripts_blocked`, `network.deadline_exceeded`, `malware.definitions_updated`, `malware.package_blocked`.

| **Область** | Community Builds | Certified Builds, без дополнения | Advanced Logging |
|:-|:-|:-|:-|
| **Канал** | `NVM for Windows/Operational` после регистрации источника. Layout **NVM4101** — журнал Windows `Application`. | `NVM for Windows/Operational` | Тот же канал Operational |
| **Шаблоны** | Event ID 100–102 (`nvm.exe`), 210–212 (shim) | Event ID 100–102 (`nvm.exe`), 210–212 (shim) | Те же ID плюс **120** / **121** / **122** |
| **Запрашиваемые поля** | `Source`, `Message`, `Code` (`UInt32`; `0` если это не `NVM####`) | `Source`, `Message`, `Code` (`UInt32`; `0` если это не `NVM####`) | `EventName`, `Payload` (JSON), `Code` |
| **Актор / контекст** | Нет в EventData | В `Message`, когда `Code` = `0` | `user`, `sid`, `hostname`, `parent_process`, `parent_pid`, `project_name`, `project_path`, `correlation_id` |
| **Контракт сборщика** | Текст `Message` может меняться | Текст `Message` может меняться | `EventName` и `Payload` стабильны |
| **Установка / удаление** | Классические 100–102. `Code` = `0`. Сообщение `nvm.system.changed {json}`. | Классические 100–102. `Code` = `0`. Сообщение `nvm.system.changed {json}`. | `nvm.system.changed`. Фильтр `Action`, `NodeVersion`, `User`, `hostname`. |
| **Версия по умолчанию** | Классические 100–102 | Классические 100–102 | `nvm.version.activated` |
| **Изменение конфигурации** | Классические 100–102 | Классические 100–102 | `nvm.configuration.changed` |
| **Каждый запуск `node.exe`** | Event ID **120** `nodejs.executed`, когда включён `log_executions`. Event **200** не вызывается. | Event ID **120** `nodejs.executed`, когда включён `log_executions`. Event **200** не вызывается. | Тот же Event **120**, включая `permission_allow.*` при permission launch |
| **Запуск пакетного менеджера** | :x: | :x: | `package_manager.executed`, когда включён `log_executions` |
| **Module firewall: разрешить / запретить** | :x: | Классический `Code` **4408** / **4403** | `package_manager.install` |
| **Доверие Node / verify-key** | Классический `Code` **4301–4312** | Классический `Code` **4301–4312** | `node.security.*`, `verify_key.open_failed` |
| **Политика NVM Firewall и удалённые проверки** | **NVM4406** текст при смене недоверенного модуля. Нет политики version/module. Нет удалённых проверок module. | Классический `Code` **4401–4410** | Имена событий `firewall.*` |
| **Сетевые дедлайны** | :x: | :x: | `network.deadline_exceeded` (**NVM4501**) |
| **Определения / блоки malware** | Только терминал | Только терминал | **NVM4601**, **NVM4602** на Event ID **120** |

Полный список имён событий — в [SIEM](../../guide/siem).

## Лента malware \{#malware-feed\}

Эти события пишутся только при включённом Advanced Logging.
Они используют Windows Event ID 120 в **NVM for Windows/Operational**.
Блокировка всё равно печатается в терминале без этой лицензии, и такой блок не пишет `package_manager.install`.

| Код | Событие | Payload |
|------|--------|---------|
| **NVM4601** | `malware.definitions_updated` | `added`, `removed`, `seq`, `previous_seq` |
| **NVM4602** | `malware.package_blocked` | имя пакета, версия если известна, команда |

См. [SIEM](../../guide/siem) для запросов.
См. [Коды ошибок](../../troubleshooting/error-codes) для каждого значения `NVM####`.

Если в Event Viewer нет канала **NVM for Windows/Operational**, см. [Windows Native Logging](../log).

## Связанные материалы \{#related\}

- [SIEM](../../guide/siem) — запросы по парку
- [Basic Native Logging](../log) — Community Builds
- [Выбор сборки](../../guide/builds/)
