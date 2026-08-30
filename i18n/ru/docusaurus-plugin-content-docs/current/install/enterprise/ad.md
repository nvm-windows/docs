---
title: Развёртывание через Active Directory
sidebar_label: Развёртывание через Active Directory
certified: true
---

import DocImage from '@site/docs/_components/DocImage';

# Развёртывание через Active Directory

**Что понадобится:**

- MSI-установщик NVM for Windows и MST-патч[^1] (доступны в [клиентском портале](https://portal.author.io)).
- Административный доступ к контроллеру домена для создания групповых политик.

### Подготовка файлового сервера

Установка ПО через GPO читает MSI и MST с сетевой шары. Domain Computers должны иметь доступ к этой шаре при применении политики.

Загрузите MSI и MST NVM for Windows из пакета развёртывания на файловый сервер, доступный **Domain Computers** и пользователям в области GPO. Выдайте право чтения этим субъектам.

<DocImage src="/img/guide_fileserver.png" alt="Source Files" style={{ width: '95%', height: 'auto' }} />

### 1. Открыть консоль управления групповыми политиками

- **Через «Выполнить»**: Win + R, `gpmc.msc`, OK.
- **Через меню «Пуск»**: введите Group Policy Management, выберите приложение.
- **Через Server Manager**: Tools → Group Policy Management.

### 2. Создать групповую политику

1. ПКМ по организационному подразделению с целевыми компьютерами → «Create a GPO in this domain, and link it here».
1. Выберите GPO. На панели справа — вкладка «Scope».
1. В «Security Filtering» нажмите «Add». В «Enter object name to select» добавьте `Domain Computers`. При необходимости добавьте группы безопасности для ограничения области. «Check Names» → OK.
1. Если «Authenticated Users» есть в «Security Filtering» — удалите.
1. Вкладка «Delegation». Убедитесь, что `Domain Computers` и указанные группы в списке.

<DocImage src="/img/guide_gpo-create.png" alt="Create GPO" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

### 3. Настроить пакет установки в GPO

1. ПКМ по GPO → «Edit».
1. **Computer Configuration** > **Policies** > **Software Settings** > **Software installation**. Выберите именно _Computer Configuration_, не пользовательскую конфигурацию. В отличие от public edition, certified-сборки NVM for Windows ставятся на уровне машины[^2].

<DocImage src="/img/guide_software_install_policy.png" alt="Find the GPO Software Installation Path" style={{ marginLeft: '2em', width: 'auto', height: 'auto' }} />

3. ПКМ «Software installation» → «New > Package». Откроется выбор файла.
1. Перейдите к MSI на файловом сервере. Выберите `.msi` → «Open» → диалог «Deploy Software».
1. В «Deploy Software» выберите `Advanced` → «OK».
1. Вкладка «Deployment» → «Assigned». При необходимости отметьте «Uninstall this application when it falls out of the scope of management».

:::warning[Последствия автоматического удаления через GPO]
Автоудаление NVM for Windows при выходе из области управления **может критически затронуть** пользователей, ошибочно исключённых из области установки, как описано ниже.

Удаление NVM for Windows удаляет все версии Node.js, которыми он управляет, включая глобальные модули. Каталог хранения Node.js можно сохранить заранее и восстановить вручную при повторной установке.

Каталог по умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs`
:::

7. Вкладка «Modifications» → «Add».
1. На файловом сервере выберите `.mst`[^1]. Так вы принимаете EULA от имени всех пользователей, для которых выполняется установка (обязательно).
1. «OK» для закрытия окна.
1. В GPO: **Computer Configuration** > **Policies** > **Administrative Templates** > **System** > **Group Policy**.

<DocImage src="/img/guide_loopback.png" alt="Enable Loopback Processing" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

11. Дважды щелкните политику → «Enabled» → **Merge** или **Replace**.
1. «OK».

**Готово — групповая политика установит NVM for Windows на компьютеры пользователей.**

:::tip[Обновить клиент]
На клиенте выполните `gpupdate /force`, чтобы применить политику сразу.
:::

:::tip[Альтернатива: пользовательская конфигурация с повышением прав]
Можно развернуть установщик в пользовательской конфигурации с временным повышением прав.

Развёртывание переносится в User Configuration (срабатывает при входе), а AD временно обходит ограничения пользователя для запуска MSI с правами администратора.

1. **Создайте или измените GPO**: привяжите к OU с целевыми пользователями.
1. **Software Installation**: добавьте MSI в User *Configuration* > *Policies* > *Software Settings* > *Software Installation*. Выберите *Advanced*, затем *Install this application at logon*.
1. **Повышение прав установщика:**
   1. *Computer Configuration* > *Policies* > *Administrative Templates* > *Windows Components* > *Windows Installer*.
   1. **Always install with elevated privileges** → **Enabled** → Apply → OK.
   1. *User Configuration* > *Policies* > *Administrative Templates* > *Windows Components* > *Windows Installer*.
   1. Там же **Always install with elevated privileges** → **Enabled**.

:::warning[Временный риск безопасности]
**Always install with elevated privileges** позволяет обычным пользователям запускать любой пакет Windows Installer с повышенными правами — возможна эксплуатация злоумышленниками.
:::

[^1]: MST-патч обязателен для автоматического принятия EULA.
[^2]: При обновлении парка с public-сборок на certified MSI автоматически переносит установки Node.js и пользовательские настройки.
