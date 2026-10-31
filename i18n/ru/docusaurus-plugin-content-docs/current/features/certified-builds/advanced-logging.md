---
title: Advanced Logging
sidebar_label: Advanced Logging
sidebar_position: 2
certified:
  edition: Advanced Logging
---

# Advanced Logging

Advanced Logging — дополнение для [Certified Builds](../../guide/builds/).
Оно превращает активность Windows Event Log в стабильный SIEM-поток в канале **NVM for Windows/Operational**.

Community Builds используют только [Windows Native Logging](../log) (plaintext).
Certified Builds уже пишут классические события в выделенный Operational-канал.
Это дополнение добавляет структурированные `EventName` + JSON `Payload`, чтобы сборщики не парсили меняющийся plaintext `Message`.

Настройка сборщика и запросы — в [руководстве SIEM](../../guide/siem).

## Зачем включать \{#why-enable-it\}

С Advanced Logging из Event Log / SIEM можно отвечать на вопросы по парку:

- Какие версии Node.js где работают, кто ставил или удалял, на каком хосте
- Какой пакет назвал module-firewall allow (**NVM4408**) или deny (**NVM4403**) — в запрашиваемом `Payload`, не только факт allow/deny
- Происхождение запуска сверх классического текста Event 120: структурированные `parent_process`, `parent_pid`, `project_name` и `project_path` в SIEM-записях (классическое Certified launch logging уже несёт эти поля, если они резолвятся; см. [журналирование](../log))
- Какие флаги прав передал вызывающий, какие применила или сняла политика (`permission_allow.*`)
- Обновления определений malware и блоки malware как записи Event Log (не только терминал)
- Исчерпание сетевых дедлайнов (`network.deadline_exceeded`)
- Когда политика блокирует lifecycle-скрипты package manager на install-class команде (`package_manager.lifecycle_scripts_blocked`)

## Что есть только с этим дополнением \{#what-you-get-only-with-this-add-on\}

Эти записи появляются в **NVM for Windows/Operational** как структурированные события (`EventName`, `Payload`, `Code`) только при лицензии Advanced Logging:

| Событие | Код | Примечания |
|:-|:-|:-|
| `package_manager.lifecycle_scripts_blocked` | **NVM4412** | Аудит, когда HKLM блокирует lifecycle-скрипты на install-class команде |
| `network.deadline_exceeded` | **NVM4501** | Исчерпан бюджет catalog / mirror / download |
| `malware.definitions_updated` | **NVM4601** | Успешное изменение `malware.db` |
| `malware.package_blocked` | **NVM4602** | Shim заблокировал пакет; без дополнения блок всё равно печатается в терминале |

Allow/deny module firewall, сбои Node trust и похожие условия по-прежнему дают классический `Code` без дополнения.
С Advanced Logging у них также появляются запрашиваемые `EventName` / `Payload` (например `package_manager.install`, `firewall.*`, `node.security.*`).

Полный список имён событий и стартовые запросы: [SIEM](../../guide/siem).
Каждое значение `NVM####`: [Коды ошибок](../../troubleshooting/error-codes).

## Что Certified Builds пишут и без дополнения \{#what-certified-builds-already-write\}

Advanced Logging **не** нужен для:

| Активность | Поведение |
|:-|:-|
| Install / uninstall / default version / смена config | Классические события в **NVM for Windows/Operational** (`Source`, `Message`, `Code`). Для информационных system-change часто `Code` = `0` |
| Каждый запуск `node.exe` | Event ID **120** `nodejs.executed`, когда включён [`log_executions`](../log) |
| Вызов package manager | Event ID **120** `package_manager.executed`, когда включён `log_executions` (Certified Builds) |

Классические события всегда содержат `Code` как `UInt32`, по которому можно фильтровать.
В них **нет** `EventName` и `Payload`.
Plaintext `Message` — для человека на устройстве. Текст может меняться с продуктом — не считайте его схемой SIEM.

## Как выглядят структурированные события \{#how-structured-events-look\}

Каждое событие Advanced Logging несёт:

| Поле | Роль |
|:-|:-|
| `EventName` | Стабильное имя для запросов (например `nodejs.executed`) |
| `Payload` | JSON-контекст (user, host, package, paths, …) |
| `Code` | `NVM####` как `UInt32` (`EventData.Code`) |

Структурированные шаблоны используют Event ID **120** (info), **121** (warning) и **122** (error) в том же Operational-канале.
Если в Event Viewer нет канала **NVM for Windows/Operational**, см. [Windows Native Logging](../log).

## Связанные материалы \{#related\}

- [SIEM](../../guide/siem) — запросы по парку и карта полей
- [Windows Native Logging](../log) — Community Builds и `log_executions`
- [Выбор сборки](../../guide/builds/)
- [Коды ошибок](../../troubleshooting/error-codes)
