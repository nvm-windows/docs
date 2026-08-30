---
title: Уведомления на рабочем столе
sidebar_position: 5
tags: [native-integration]
---

import DocImage from '@site/docs/_components/DocImage';

NVM for Windows использует нативные уведомления на рабочем столе через Windows Notification Center. Пропущенные уведомления остаются в Notification Center, пока их не подтвердят. Учитываются личные настройки уведомлений.

<div align="center">
<DocImage
	src="/img/features/native/native-notifications.png"
	alt="Windows Notification Center"
	style={{maxWidth: '980px'}}
/>
</div>

## Когда появляются уведомления

Большинство CLI-уведомлений показываются **только когда NVM не на переднем плане** (например, фоновый агент). Если вы запускаете `nvm` в интерактивном терминале и окно в фокусе, уведомления пропускаются, чтобы не мешать работе, которую вы уже видите.

Фоновые случаи, где уведомления всё же приходят:

- Долгие установки, запущенные из другого контекста
- Плановые проверки sync/update (`sync.exe`)
- Напоминания об истечении лицензии (certified editions)

Новости и обновления можно отключить через [`disable_announcements`](../cfg/core#logging-and-announcements). Уведомления об истечении лицензии этой настройкой **не** подавляются.

## CLI-уведомления

Они используют Notification Center, когда процесс NVM **не** на переднем плане:

| Триггер | Заголовок | Сообщение (прибл.) |
|--------|--------|-------------------|
| Установка завершена | _(пусто)_ или заголовок ошибки | Node.js vX installed/Node.js vX Installation Failed (плюс текст ошибки) |
| `nvm use` (переключение по умолчанию) | _(пусто)_ | Now using Node.js vX by default. |
| `nvm uninstall` | _(пусто)_ | Объединённые строки статуса (удалено, пропущено, активное переключение, purge кэша и т. п.) |
| `nvm config set` | _(пусто)_ | key set to value |
| `nvm alias add` | _(пусто)_ | "&lt;name&gt;" now refers to vX.X.X |
| `nvm alias remove` | _(пусто)_ | &lt;count&gt; alias(es) removed successfully. |
| `nvm pin` | _(пусто)_ | Текст успеха для обновлений `.nvmrc`/`package.json` engines |
| Ошибка symlink (Developer Mode выключен) | Help Enabling Symlinks | |

## Sync-уведомления

Плановое обслуживание тоже может показывать уведомления:

| Триггер | Заголовок | Примечания |
|--------|--------|--------|
| Лента новостей | Заголовок записи | Тело — описание записи со ссылками; пропускается при [`disable_announcements`](../cfg/core#logging-and-announcements) = true |
| Доступно обновление | Update Available | Доступность версии со ссылками View/Upgrade; пропускается при [`disable_announcements`](../cfg/core#logging-and-announcements) = true |
| Истечение лицензии<br/>_(certified builds)_ | Expiration warning | Не подавляется [`disable_announcements`](../cfg/core#logging-and-announcements); не более одного уведомления на веху/день. |
