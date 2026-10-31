---
title: Уведомления на рабочем столе
sidebar_position: 5
tags: [native-integration]
---

import DocImage from '@site/docs/_components/DocImage';

# Уведомления на рабочем столе

NVM for Windows использует нативные уведомления Windows Notification Center.
Вы видите важное без постоянного наблюдения за терминалом.
Пропущенные уведомления остаются в Notification Center, пока вы их не очистите.
Windows учитывает Focus Assist и настройки уведомлений для приложения.

<div align="center">
<DocImage
	src="/img/features/native/native-notifications.png"
	alt="Windows Notification Center"
	style={{maxWidth: '980px'}}
/>
</div>

## Зачем нужны уведомления \{#why-notifications-matter\}

Уведомления на рабочем столе связывают фоновую задачу sync с решением, которое нужно принять.

- Вы узнаёте, что готова новая сборка NVM for Windows, пока работаете в другом месте.
- Вы можете открыть заметки о выпуске или запустить обновление прямо из уведомления. Команду вспоминать не нужно.
- Вы видите блоки malware и запросы о недоверенных модулях, когда консоль не на переднем плане.
- Certified Builds предупреждают до истечения sitewide-лицензии.

CLI-уведомления для установки, `nvm use` и изменений конфигурации тоже появляются, когда другой процесс или агент запускает NVM, а ваш терминал не в фокусе.

## Каналы \{#channels\}

Windows регистрирует четыре **коллекции** уведомлений под **NVM for Windows**.
Каждая коллекция — отдельный канал, который можно отключить в Параметрах.

| Канал (имя в Параметрах) | ID коллекции | События |
|--------------------------|--------------|---------|
| **Releases** | `nvm.releases` | Стабильные обновления продукта (`x.y.z`) |
| **Hotfixes** | `nvm.hotfixes` | Hotfix-сборки (`x.y.z-hotfix.N`) для установленного major.minor.patch |
| **Pre-releases** | `nvm.prereleases` | Alpha, beta, rc и другие версии продукта с дефисом |
| **News** | `nvm.news` | Записи ленты новостей проекта |

Уведомления security, firewall, license, malware, setup и activity идут через notifier **по умолчанию**.
У них нет коллекции.
Windows не даёт mute по одному типу.
Общий Off для приложения, Focus Assist и GPO всё равно действуют.

Разреженная identity (identity-only `.msix`, регистрация per-user без дополнительного UAC) нужна, чтобы четыре коллекции появились.
Если регистрация не удалась (GPO sideload, нет пакета), уведомления всё равно идут через AUMID `AuthorSoftware.NVMWindows`.

## Отключение и включение \{#mute-and-unmute\}

### По каналу (параметры Windows)

1. Откройте **Параметры → Система → Уведомления → NVM for Windows**.
1. Выключите или включите канал: **Releases**, **Hotfixes**, **Pre-releases** или **News**.

Один канал можно отключить и через многоточие на уведомлении.
Включить обратно — на той же странице Параметров.
`nvm config` не снимает системный mute.

### Через конфигурацию

| Цель | Как |
|------|-----|
| Остановить уведомления новостей и обновлений продукта | `nvm config set disable_announcements=true` |
| Остановить уведомления определений malware (Certified Builds) | Нажмите **Don't show again** на уведомлении или `nvm config set notify_malware_definitions=false` |
| Снова включить анонсы | `nvm config set disable_announcements=false` |
| Снова включить уведомления определений malware | `nvm config set notify_malware_definitions=true` |

[`disable_announcements`](../cfg/core#logging-and-announcements) пропускает только новости и уведомления release / pre-release / hotfix.
Он **не** подавляет истечение лицензии, блоки malware, запросы firewall и уведомления об определениях malware.
HKLM-политика может принудительно задать `DisableAnnouncements` и `NotifyMalwareDefinitions`. См. [справочник политики реестра](../cfg/registry).

## Действия и автоматизации \{#actions-and-automations\}

У многих уведомлений есть кнопки.
Кнопка запускает протокол или открывает URL.
Сначала переключаться в терминал не нужно.

| Кнопка | Канал / уведомление | Что делает |
|--------|--------------|------------|
| **View** | Releases, Hotfixes, Pre-releases | Открывает страницу выпуска в браузере |
| **Update** | Releases | Запускает `nvm://upgrade?version=…`. NVM обновляется до этой версии с `--force` (без запроса в консоли). Не показывается при включённом [`disable_upgrade`](../cfg/registry) |
| **Install** | Pre-releases | Тот же протокол обновления для пререлиза. Не показывается при `disable_upgrade` |
| **Apply** | Hotfixes | Тот же протокол обновления для hotfix на текущем major.minor.patch. Не показывается при `disable_upgrade` |
| **Read** | News | Открывает URL записи новости |
| **Trust** / **Cancel** | NVM Firewall (недоверенный модуль) | Принимает или отклоняет доверие к self-update глобального CLI |
| **Don't show again** | Определения malware (Certified Builds) | Ставит `notify_malware_definitions` в `false` |
| **Open Developer Settings** | Справка по symlink | Открывает `ms-settings:developers` |

Машинная политика может блокировать in-app обновления через [`disable_upgrade`](../cfg/registry).
Когда ключ включён, уведомление не показывает **Update** / **Install** / **Apply**. **View** по-прежнему открывает страницу выпуска.

## Когда появляются уведомления \{#when-notifications-appear\}

Большинство CLI-уведомлений показываются **только когда NVM не на переднем плане**.
Если вы запускаете `nvm` в интерактивном терминале и окно в фокусе, уведомления пропускаются, чтобы не мешать работе, которую вы уже видите.

Фоновые случаи, где уведомления всё же приходят:

- Долгие установки, запущенные из другого контекста
- Плановые проверки sync и update (`sync.exe`)
- Напоминания об истечении лицензии (Certified Builds)

## CLI-уведомления \{#cli-notifications\}

Они используют Notification Center, когда процесс NVM **не** на переднем плане:

| Триггер | Заголовок | Сообщение (прибл.) |
|--------|--------|-------------------|
| Установка завершена | _(пусто)_ или заголовок ошибки | Node.js vX installed / Node.js vX Installation Failed (плюс текст ошибки) |
| `nvm use` (переключение по умолчанию) | _(пусто)_ | Now using Node.js vX by default. |
| `nvm uninstall` | _(пусто)_ | Объединённые строки статуса (удалено, пропущено, активное переключение, purge кэша и т. п.) |
| `nvm config set` | _(пусто)_ | key set to value |
| `nvm alias add` | _(пусто)_ | "&lt;name&gt;" now refers to vX.X.X |
| `nvm alias remove` | _(пусто)_ | &lt;count&gt; alias(es) removed successfully. |
| `nvm pin` | _(пусто)_ | Текст успеха для обновлений `.nvmrc` / `package.json` engines |
| Ошибка symlink (Developer Mode выключен) | Help Enabling Symlinks | Кнопка: **Open Developer Settings** |

## Sync- и security-уведомления \{#sync-and-security-notifications\}

Плановое обслуживание и пути безопасности тоже показывают уведомления:

| Триггер | Канал | Заголовок | Примечания |
|--------|---------|--------|--------|
| Лента новостей | News | Заголовок записи | Тело — описание записи. Кнопка: **Read**. Пропускается при [`disable_announcements`](../cfg/core#logging-and-announcements) = true |
| Доступно обновление | Releases | Update Available или vX.X.X now Available | Без summary: заголовок Update Available, тело сообщает что доступна новая версия. С summary: заголовок `vX.X.X now Available`, тело — этот текст. Кнопки: **View** и **Update**. Пропускается при `disable_announcements` = true |
| Доступен пререлиз | Pre-releases | Update Available или vX.X.X now Available | Те же правила заголовка и тела. Кнопки: **View** и **Install**. Пропускается при `disable_announcements` = true |
| Доступен hotfix | Hotfixes | Update Available или vX.X.X now Available | Те же правила заголовка и тела. Только для hotfix на установленном major.minor.patch. При выпуске hotfix summary обязателен. Кнопки: **View** и **Apply**. Пропускается при `disable_announcements` = true |
| Истечение лицензии<br/>_(Certified Builds)_ | _(по умолчанию)_ | NVM for Windows license expires in … / expired | Не подавляется `disable_announcements`. Не более одного уведомления на веху или день |
| Определения malware<br/>_(Certified Builds)_ | _(по умолчанию)_ | Malware definitions updated | Тихое. Тело — число добавленных и удалённых записей. **Don't show again** ставит `notify_malware_definitions` в false. Не подавляется `disable_announcements` |
| Блок malware, консоль в фоне | _(по умолчанию)_ | Malicious package blocked | Со звуком (`Notification.Reminder`). Называет не более трёх пакетов, затем `and N more`. Не подавляется `disable_announcements`. На Community Build в домене Active Directory, Entra или Google Workspace в теле добавляется: `Certified keeps a record of blocks like this for your security tools.` |
| Недоверенный модуль (путь уведомления) | _(по умолчанию)_ | NVM Firewall | Кнопки: **Trust** / **Cancel**. Когда терминал не на переднем плане |

## Связанные материалы \{#related\}

- [Базовая конфигурация](../cfg/core#logging-and-announcements) — `disable_announcements`, `notify_malware_definitions`
- [Справочник политики реестра](../cfg/registry) — HKLM `DisableAnnouncements`, `NotifyMalwareDefinitions`, `DisableUpgrade`
- [Malicious Package Blocker](./malicious-package-blocker) — уведомления о блоках и уведомления об определениях
- [NVM Firewall](./firewall) — запросы Trust / Cancel
