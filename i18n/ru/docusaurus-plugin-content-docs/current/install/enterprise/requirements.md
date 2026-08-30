---
title: Требования
sidebar_label: Требования
certified: true
---

import SymlinkPermissionExplainer from '../../_components/SymlinkPermissionExplainer.mdx';

|Требование|Рекомендация|
|:-|:-|
| **Носитель&nbsp;установки** | Скачайте NVM for Windows из [клиентского портала](https://portal.author.io). ZIP содержит всё необходимое. |
| **Поддерживаемая ОС** | Windows 11[^1], Windows Server 2019+ |
| **Права пользователя** | Специальные права не нужны, если не используете [режим link](../../features/modes#link-mode) с UNC-путями. |
| **Исключения&nbsp;для&nbsp;прокси**<br/><br/><br/><br/> |1. licensing.author.io<br/>2. mirror.author.io _(при использовании зеркала Node.js от Author Software)_ <br/><br/>_Не требуется в изолированных (air-gapped) средах._ |

## Права пользователя

|Если вы планируете...|Необходимые права|
|:-|:-|
|_принудительно_ использовать [режим shim](../../features/modes#shim-mode-default)...| Нет. |
|хранить версии Node.js на локальном пути...<br/>&nbsp;&nbsp;&raquo;&nbsp;*`%LOCALAPPDATA%\Author&nbsp;Software\nvm\installs` (по умолчанию) — локальный путь*| Нет. |
|использовать UNC-пути (сетевые шары, mapped drives вроде `\\server\path`) в [режиме link](../../features/modes#link-mode)| `SeCreateSymbolicLinkPrivilege`\* |

<SymlinkPermissionExplainer/>

## Исключения для прокси \{#proxy-exceptions}

Если организация жёстко блокирует домены, нужно разрешить `licensing.author.io`. Этот домен выдаёт лицензионные ключи и публичные ключи проверки.

Если планируется зеркало Node.js от Author Software (доступно в пакете governance), также нужно разрешить `mirror.author.io`.

---

[^1]: Windows 10 — EOL, официально не поддерживается. Однако v2.0.0 работает в нашей лаборатории на Windows 10 с небольшими визуальными отличиями от Windows 11.
