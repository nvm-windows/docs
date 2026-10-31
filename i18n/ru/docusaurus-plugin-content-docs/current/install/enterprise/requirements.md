---
title: Требования
sidebar_label: Требования
certified: true
---

import SymlinkPermissionExplainer from '../../_components/SymlinkPermissionExplainer.mdx';

# Требования

Выполните эти требования до развёртывания Certified Build NVM for Windows.

|Требование|Рекомендация|
|:-|:-|
|Носитель установки|Скачайте Certified Build из [клиентского портала](https://portal.author.io). ZIP-файл содержит файлы развёртывания.|
|Поддерживаемая ОС|Windows 11[^1]. Windows Server 2019 или новее.|
|Права пользователя|Для локальной установки особые права не нужны. UNC-путь в [режиме link](../../features/modes#link-mode) требует `SeCreateSymbolicLinkPrivilege`. См. [Права пользователя](#user-privileges).|
|Исключения для прокси|Разрешите `licensing.author.io`. Если вы используете зеркало Node.js от Author Software, также разрешите `mirror.author.io`. Изолированное (air-gapped) развёртывание не требует этих исключений. См. [Исключения для прокси](#proxy-exceptions).|

## Права пользователя \{#user-privileges}

Используйте эту таблицу, чтобы выбрать права для плана установки.

|Если вы планируете...|Необходимые права|
|:-|:-|
|Принудительно использовать [режим shim](../../features/modes#shim-mode-default)|Нет.|
|Хранить версии Node.js на локальном пути. Путь по умолчанию `%LOCALAPPDATA%\Author Software\nvm\installs` — локальный.|Нет.|
|Использовать UNC-путь (сетевой ресурс или подключенный диск, например `\\server\path`) в [режиме link](../../features/modes#link-mode)|`SeCreateSymbolicLinkPrivilege`|

<SymlinkPermissionExplainer/>

## Исключения для прокси \{#proxy-exceptions}

Если организация блокирует исходящие домены, разрешите `licensing.author.io`.
Этот узел выдаёт лицензионные ключи и публичные ключи проверки.

Если вы используете зеркало Node.js от Author Software (Governance), также разрешите `mirror.author.io`.

Изолированное (air-gapped) развёртывание не требует этих исключений.

---

[^1]: Windows 10 — конец поддержки. NVM for Windows не поддерживает Windows 10. v2.0.0 работает на Windows 10 в лаборатории Author. Отображение может немного отличаться от Windows 11.
