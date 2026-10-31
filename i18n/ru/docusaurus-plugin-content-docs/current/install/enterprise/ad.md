---
title: Развёртывание через Active Directory
sidebar_label: Развёртывание через Active Directory
certified: true
---

import DocImage from '@site/docs/_components/DocImage';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Развёртывание через Active Directory

Установите Certified Build через установку программ групповой политики.

Вам нужно:

- MSI NVM for Windows и MST[^1] из [клиентского портала](https://portal.author.io).
- Административный доступ к контроллеру домена. Этот доступ нужен, чтобы создать групповые политики.

### Подготовка файлового сервера

Групповая политика читает MSI и MST с сетевого ресурса.
**Domain Computers** должны достигать этого ресурса, когда политика применяется.

1. Скопируйте MSI и MST из пакета развёртывания на файловый сервер.
1. Сделайте ресурс доступным для **Domain Computers** и для пользователей в области GPO.
1. Выдайте этим учётным записям право чтения.

<DocImage src="/img/guide_fileserver.png" alt="Source Files" style={{ width: '95%', height: 'auto' }} />

### 1. Открыть консоль управления групповыми политиками

Используйте один из этих способов:

- **Через «Выполнить»**: Win + R, `gpmc.msc`, OK.
- **Через меню «Пуск»**: введите Group Policy Management, выберите приложение.
- **Через Server Manager**: Tools → Group Policy Management.

### 2. Создать групповую политику

1. Щёлкните правой кнопкой организационное подразделение с целевыми компьютерами.
1. Выберите **Create a GPO in this domain, and link it here**.
1. Выберите GPO.
1. На правой панели выберите вкладку **Scope**.
1. В **Security Filtering** выберите **Add**.
1. В **Enter the object name to select** добавьте `Domain Computers`.
1. Добавьте группы безопасности, если нужно ограничить установку.
1. Выберите **Check Names**.
1. Убедитесь, что каждое имя разрешается.
1. Выберите OK.
1. Если **Authenticated Users** есть в **Security Filtering**, удалите эту запись.
1. Выберите вкладку **Delegation**.
1. Убедитесь, что `Domain Computers` и ваши группы есть в списке.

:::warning[Сохраните Read для Authenticated Users]
Удаление **Authenticated Users** из **Security Filtering** также снимает право Read.
На вкладке **Delegation** добавьте **Authenticated Users** только с правом Read.
Без этого права Read политика может не применяться.
:::

<DocImage src="/img/guide_gpo-create.png" alt="Create GPO" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

### 3. Настроить пакет установки в GPO

1. Щёлкните правой кнопкой GPO и выберите **Edit**.
2. Перейдите в **Computer Configuration** > **Policies** > **Software Settings** > **Software installation**.
   Выберите **Computer Configuration**.
   Не выбирайте User Configuration.
   Certified Builds ставятся на уровне компьютера[^2].
   Community Build так не ставится.

<DocImage src="/img/guide_software_install_policy.png" alt="Find the GPO Software Installation Path" style={{ marginLeft: '2em', width: 'auto', height: 'auto' }} />

3. Щёлкните правой кнопкой **Software installation**.
4. Выберите **New** > **Package**.
   Откроется диалог выбора файла.

:::warning[Используйте UNC-путь]
В диалоге откройте `\\server\share\...`.
Не открывайте подключенный диск.
Учётная запись компьютера применяет эту политику при запуске.
Подключенный диск этой учётной записи недоступен.
:::

5. Откройте папку на файловом сервере с носителем NVM for Windows.
6. Выберите файл `.msi`.
7. Выберите **Open**.
   Откроется диалог **Deploy Software**.
8. Выберите **Advanced**.
9. Выберите **OK**.
10. Выберите вкладку **Deployment**.
11. Задайте тип развёртывания **Assigned**.
12. Выберите **Uninstall this application when it falls out of the scope of management**, только если нужно удаление, когда компьютер выходит из области.

:::warning[Автоудаление, когда компьютер выходит из области]
Автоудаление выполняется, когда компьютер выходит из области управления.
Это удаление может убрать Node.js у пользователя, которого вы исключили по ошибке.

MSI удаляет `%LOCALAPPDATA%\Author Software\nvm` для пользователя, который запускает удаление.
В этом каталоге лежат версии Node.js и глобальные модули этого пользователя.
Другие профили на том же компьютере могут сохранить свои каталоги.
Скопируйте каталог этого пользователя до удаления продукта.
Этот каталог можно восстановить, если вы снова установите NVM for Windows.

Каталог по умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs`
:::

13. Выберите вкладку **Modifications**.
14. Выберите **Add**.
15. Откройте файловый сервер и выберите файл `.mst`[^1].
    Так вы принимаете EULA для каждого пользователя, который получает установку.
    Этот шаг обязателен.
16. Выберите **OK**.

GPO теперь устанавливает NVM for Windows на целевые компьютеры.

:::info[Что происходит на целевых компьютерах]
1. MSI регистрирует NVM for Windows как поставщик Event Tracing for Windows.
1. Устаревшие SYSTEM `NVM_HOME`, `NVM_SYMLINK` и записи `PATH` Community Build удаляются.
:::

:::warning
Не добавляйте эти скрипты в эту GPO:

- `Remediation/machine-startup.ps1`
- `Register-EventLogSource.ps1`
- `Remove-LegacySystemEnv.ps1`

Используйте эти скрипты только если MSI не зарегистрировал поставщик событий или не удалил устаревшие записи.
Используйте их для этого неудавшегося шага или для повторной попытки в автономном режиме.
Установщик v2 уже регистрирует поставщик событий и удаляет устаревшие записи.
:::

### 4. Лицензирование парка

MSI не записывает токен доступа организации и закрытый ключ.

:::info[Токен доступа и закрытый ключ]
- **Certified Build.** Токен доступа — это лицензия. `Set-NvmWindowsAccessToken.ps1` записывает `AccessToken` и `JwksCose`. Он не записывает `AccessKey`.
- **Governance.** `Set-NvmWindowsLicensing.ps1` записывает `AccessToken`, `AccessKey` и `JwksCose`. `AccessKey` подписывает короткоживущий JWT для запросов к зеркалу Node.js от Author. См. [Зеркало Node.js](/features/author-mirror#author-mirror).
:::

<Tabs>
  <TabItem value="certified" label="Certified Build" default>
    Пакет Certified Build содержит `Set-NvmWindowsAccessToken.ps1`.

    Добавьте скрипт запуска **Computer Configuration**.
    Не кладите файлы секретов на ресурс с программами.

    Передайте токен доступа в командной строке:

    ```powershell
    powershell.exe ^
      -ExecutionPolicy Bypass ^
      -File \\fileserver\software\nvm-windows\<version>\Licensing\Set-NvmWindowsAccessToken.ps1 ^
      -AccessToken "<jwt-from-portal>" ^
      -JwksCoseUrl "https://assets.nvm-windows.com/nvm-jwks.cose"
    ```

    См. [заметки о секретах лицензии](../../cfg/enterprise/registry.md).
  </TabItem>
  <TabItem value="governance" label="Governance">
    Пакет Governance содержит `Set-NvmWindowsLicensing.ps1`.

    Создайте закрытый ключ:

    1. Откройте [portal.author.io](https://portal.author.io).
    1. Перейдите в NVM for Windows → Private Keys.
    1. Создайте ключ с запоминающимся именем. Он обозначает группу пользователей.
    1. Сохраните секрет, который показывает портал.
       Author больше не показывает этот секрет.

    Добавьте скрипт запуска **Computer Configuration**.
    Не кладите файлы секретов на ресурс с программами.

    Передайте токен доступа и закрытый ключ в командной строке:

    ```powershell
    powershell.exe ^
      -ExecutionPolicy Bypass ^
      -File \\fileserver\software\nvm-windows\<version>\Licensing\Set-NvmWindowsLicensing.ps1 ^
      -AccessToken "<jwt-from-portal>" ^
      -AccessKey "<private-key>" ^
      -JwksCoseUrl "https://assets.nvm-windows.com/nvm-jwks.cose"
    ```

    См. [заметки о секретах лицензии](../../cfg/enterprise/registry.md).
  </TabItem>
</Tabs>

:::tip[Применить установку на клиенте]
Пакет, назначенный компьютеру, устанавливается при запуске компьютера.
`gpupdate /force` обновляет политику. Он не устанавливает MSI.

Перезапустите компьютер после обновления.
Или выполните `gpupdate /force /boot`.
Эта команда обновляет политику, затем перезапускает компьютер, чтобы Software Installation могла выполниться.

У пакета, назначенного компьютеру, нет поддерживаемого способа установки без перезапуска.
:::

:::tip[Альтернатива: User Configuration с повышением прав]
Пакет можно поместить в User Configuration и повысить права для установки.

Установка тогда выполняется при следующем входе.
Выйдите и войдите снова на клиенте. Для этого пути перезапуск не нужен.
Active Directory временно обходит ограничения пользователя, чтобы MSI запустился с правами администратора.

1. Создайте или измените GPO.
   Привяжите её к OU с целевыми пользователями.
1. Добавьте MSI в **User Configuration** > **Policies** > **Software Settings** > **Software Installation**.
1. Выберите **Advanced**.
1. Выберите **Install this application at logon**.
1. Повысьте права установщика:
   1. Перейдите в **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Windows Installer**.
   1. Дважды щёлкните **Always install with elevated privileges**.
   1. Задайте **Enabled**.
   1. Выберите Apply, затем OK.
   1. Перейдите в **User Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Windows Installer**.
   1. Дважды щёлкните **Always install with elevated privileges**.
   1. Задайте **Enabled**.
1. Включите loopback, чтобы эта пользовательская политика применялась на целевых компьютерах:
   1. Перейдите в **Computer Configuration** > **Policies** > **Administrative Templates** > **System** > **Group Policy**.
   1. Дважды щёлкните **Configure user Group Policy loopback processing mode**.
   1. Выберите **Enabled**.
   1. Выберите **Merge** или **Replace**.
   1. Выберите **OK**.

<DocImage src="/img/guide_loopback.png" alt="Enable Loopback Processing" style={{ marginLeft: '2em', width: '80%', height: 'auto' }} />

:::warning[Временный риск безопасности]
**Always install with elevated privileges** позволяет обычному пользователю запускать любой пакет Windows Installer с повышенными правами.
Злоумышленник может использовать этот параметр.
:::

[^1]: MST нужно применить. MST принимает EULA.
[^2]: Обновление с Community Build на Certified Build сохраняет существующие установки Node.js и настройки пользователя. MSI Certified Build выполняет этот перенос.
