---
title: Malicious Package Blocker
sidebar_label: Malicious Package Blocker
sidebar_position: 10
---

# Malicious Package Blocker

Malicious Package Blocker останавливает установку `npm`, `pnpm`, `yarn` или bun, если имя и версия пакета есть в наборе данных [OpenSSF Malicious Packages](https://github.com/ossf/malicious-packages).
Bun проверяется только когда включён [`shim_bun`](../cfg/core#package-managers).

Он ищет имена в подписанном локальном файле (`malware.db`).
Это не сканер файлов.
Он не проверяет содержимое tarball.

Это не [module firewall](./firewall).
Module firewall применяет **ваши** списки allow и deny.
Этот blocker применяет публичную ленту **известных вредоносных** имён.

Проверки работают в [режиме shim](./modes).
Они включены по умолчанию в Community Builds и Certified Builds.

Совпадение — терминальная ошибка.
Эта команда установки не продолжается.
Каждое заблокированное имя печатает `NVM blocked <name> — <reason>. (NVM4602)`.
OpenSSF использует `recognized as malware (OpenSSF)`.
Локальный шаблон организации использует `organization malware block`.
Удалённый 403 использует `remote malware policy`, затем `: <reason>`, если колонка TSV есть.

## Что проверяется \{#what-it-checks\}

| Сборка | Проверяется |
|:-|:-|
| Community Build | Именованный пакет в `npm install <name>` (и эквиваленты `pnpm` / `yarn`). Прямые зависимости `package.json` при голом `npm install`. Без lockfile. Без транзитивных зависимостей. |
| Certified Builds | Проверки Community, плюс lockfile проекта. Lockfile — это разрешённый граф, включая транзитивные зависимости. Certified Builds также проверяют этот lockfile при запуске `node` в каталоге проекта. |

Community Builds не читают lockfile.
Community Builds не проверяют транзитивные зависимости.
Community Builds не проверяют при запуске `node`.

Если `malware.db` отсутствует, refresh при установке и hourly sync скачивают его. Отсутствующий или недоверенный файл после неудачи всё равно блокирует, кроме случая `AirGapped` и **полного** отсутствия доверенного файла.

Certified MSI снимает снимок live-ленты при сборке (`utils\malware.db` + `utils\head.cose` в Program Files). Это только fallback. Live-лента важнее, когда доступна. Shim берёт пару из data-root только если `head.cose` проходит проверку и `state_hash` совпадает; иначе читает seed из Program Files. Не копируйте `malware.db` вручную, пока есть live-пара или seed.

Certified Builds могут сначала выполнить проход package manager только для lockfile.
В stderr может появиться `scanning...`.
Повторное использование метки эту строку не показывает.

## Пропустить проверки \{#skip-the-checks\}

Установите [`skip_malware_checks`](../cfg/core#logging-and-announcements) в `true`, чтобы отключить поиск в shim.

```powershell
nvm config set skip_malware_checks=true
```

HKLM `SkipMalwareChecks` важнее HKCU.
Файл определений всё равно обновляется, если проверки пропущены.

## Разрешить ложное срабатывание \{#allow-a-false-positive\}

`MalwareAllowList` — только HKLM.
См. [справочник политики реестра](../cfg/enterprise/registry).

Каждая строка — один шаблон.
Сравнение по байтам.
Регистр не складывается.

- `left-pad` разрешает все версии этого имени.
- `left-pad@1.0.0` разрешает только эту версию.
- `@scope/*` разрешает все пакеты в этой области.
- `*` внутри имени — подстановка.

Пустой список ничего не разрешает.
Совпадение снимает блок OpenSSF, и установка продолжается.
Этот список не снимает блок организации.

## Списки организации (Certified Builds) \{#organization-lists-certified-builds\}

Certified Builds также читают:

| Ключ | Эффект |
|:-|:-|
| `MalwareBlockList` | Шаблоны HKLM, которые всегда блокируют, или один URL `https://`. Community Builds игнорируют этот список. |
| `MalwareTrustConflict` | `prevent` (по умолчанию) всё равно блокирует попадание OpenSSF, если имя явно доверено или одобрено. `continue` пропускает такое доверие или одобрение. Community Builds игнорируют этот ключ. |

Встроенные семена доверия менеджеров пакетов (`npm`, `npx`, `yarn`, `yarnpkg`, `corepack`, `pnpm`, `vlt`) для этой проверки доверием не считаются.

Блок malware не пишет `package_manager.install`.
**NVM4602** — запись, когда включён Advanced Logging.

### Удалённое тело HTTPS (Certified Builds) \{#remote-https-body-certified-builds\}

Когда `MalwareBlockList` — один URL `https://`, shim POSTит попадания при установке. Тело **403** — TSV:

```text
name<TAB>date<TAB>reason
```

`reason` необязателен. Пустой reason даёт `remote malware policy`. Свой reason живёт только в этом запросе. Он не пишется обратно в политику.

Локальные шаблоны `MalwareBlockList` остаются `organization malware block`. Они не берут свой reason.

### Проверить имя \{#inspect-a-name\}

```powershell
nvm malware status left-pad
nvm malware status left-pad --json
```

`status` только локальный. Он не делает POST.
Строка `allowed` с текстом overruled всё равно значит попадание OpenSSF (или оргсписка). Эта политика пропустила имя.
См. [`nvm malware status`](../command/nvm/malware/status).

## Уведомления \{#notifications\}

Попадание всегда печатается в терминале.

Если консоль в фоне, Windows также показывает toast.
Заголовок — **Malicious package blocked** только для OpenSSF, **Organization malware block** только для локального списка, и **Package blocked** при смеси источников или когда удалённый 403 оставил имя.
Тело называет не более трёх пакетов, затем `and N more`.
Сигнал — `Notification.Reminder`.
[`disable_announcements`](../cfg/core#logging-and-announcements) это уведомление не скрывает.

На Community Build в домене Active Directory, Entra или Google Workspace в теле добавляется: `Certified keeps a record of blocks like this for your security tools.`

Certified Builds также могут показать **Malware definitions updated** после успешного изменения определений.
**Don't show again** ставит `notify_malware_definitions` в false.
См. [уведомления на рабочем столе](./notifications).

## Кэш \{#cache\}

Метки лежат в `.cache/malware-scan`.
`malware.db` лежит в корне данных NVM.

```powershell
nvm cache list malware
nvm cache remove malware
nvm cache remove malware --prompt
```

`nvm cache remove all` удаляет метки и `malware.db`.
Удаление учитывает [`allow_download_cache_removal`](../cfg/core#downloads-and-mirrors).
См. [кэш загрузок](./cache) и [`nvm cache remove malware`](../command/nvm/cache/remove/malware).

## События \{#events\}

Эти события требуют дополнение Advanced Logging.
Они используют Windows Event ID 120 в **NVM for Windows/Operational**.

| Код | Событие |
|:-|:-|
| **NVM4601** | `malware.definitions_updated` |
| **NVM4602** | `malware.package_blocked` — пакет, версия, команда, `source`, `reason` |

См. [журналирование событий](./log) и [коды ошибок](../troubleshooting/error-codes).

## Связанные материалы \{#related\}

- [NVM Firewall](./firewall) — ваша политика версий, модулей и доверия
- [Выбор сборки](../guide/builds/)
- [Справочник политики реестра](../cfg/enterprise/registry)
