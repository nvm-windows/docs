---
title: Version Firewall + Author Mirror
sidebar_position: 8
certified:
  edition: governance
---

import DocImage from '@site/docs/_components/DocImage';

# Version Firewall + Author Mirror

Сборки Governance могут ограничивать, какие версии Node.js устанавливаются, через **локальный firewall** (статические списки allow/block) и **зеркало Node.js с политиками** Author Software на `https://mirror.author.io/runtime/nodejs` (правила жизненного цикла, например блокировка end-of-life релизов).

Для обычных URL [`node_mirror`](../cfg/core#downloads-and-mirrors)/[`npm_mirror`](../cfg/core#downloads-and-mirrors) и HTTP-прокси см. [Зеркала загрузок](./mirrors).

## Firewall \{#firewall}

Локальный firewall NVM for Windows учитывает списки разрешённых/заблокированных версий из политик безопасности организации (см. [ключи реестра edition governance](/cfg/registry#governance-keys)). **Статические** записи применяются на клиенте до начала любой загрузки при каждом `nvm install <version>`. Эта локальная проверка работает в изолированных средах.

Псевдонимы жизненного цикла вроде `EOL` локальный firewall не раскрывает; они применяются при установках через зеркало Author (ниже).

Для исходящих allow-list firewall см. [Требования](../install/enterprise/requirements#proxy-exceptions). Полный перечень типов ключей — в [справочнике политики реестра](../cfg/registry) и [базовой конфигурации](../cfg/core).

## Author Mirror

Зеркало Author добавляет ещё один уровень защиты от неодобренных загрузок Node.js. Оно применяет *динамические политики* через правила, дополняя локальные списки allow/block.

:::warning[Только подключённые среды]
Зеркало Author недоступно в изолированных (air-gapped) средах.
:::

Укажите [`node_mirror`](../cfg/core#downloads-and-mirrors) / `MirrorNode` на сервис зеркала Author: `https://mirror.author.io/runtime/nodejs`

Разрешите исходящий HTTPS к:

- `licensing.author.io` — ключи лицензии и проверки
- `mirror.author.io` — архивы Node

На хостах Author NVM может отправлять:

| Учётные данные | Реестр | Назначение |
|:-|:-|:-|
| Access token | `AccessToken` | `Authorization: Bearer …` при загрузках Author; также для проверки лицензии |
| Access key | `AccessKey` | Подписывает краткоживущий mirror JWT (`X-Author-License`) в Governance |

Задавайте их скриптами портала/политикой, а не обычными ключами `nvm config docs`. Если единственное настроенное зеркало — Author и авторизация не прошла, установка завершится ошибкой авторизации. При нескольких зеркалах NVM может перейти к следующему URL после неудачной попытки (если только это не жёсткий отказ авторизации на единственном зеркале Author).

:::warning[Fallback обходит политику Author]
Если `nodejs.org` (или другой не-Author хост) идёт дальше в [`node_mirror`](../cfg/core#downloads-and-mirrors), неудачный запрос к Author может перейти на fallback и скачать **без** правил жизненного цикла Author (`EOL`, hosted rulesets). Ставьте Author первым и убирайте публичные fallback, если эти правила должны применяться всегда.
:::

Опционально: `ApplyVerboseLicenseMetadata` включает claims идентичности машины/пользователя в mirror JWT для аудита.

## Применение динамических политик

Динамические политики — псевдонимы жизненного цикла (например, `EOL`), классифицирующие диапазон версий. Зеркало Author оценивает их при выдаче загрузок. Те же списки политики машины, что питают [локальный firewall](#firewall), могут также **заполнять** эти псевдонимы в license JWT Author.

Есть два (комбинируемых) способа применить динамические политики на зеркале Author.

### 1. Из политики машины (JWT claims)

`VersionAllowList` / `VersionBlockList` (см. [ключи реестра Governance](/cfg/registry#governance-keys)) выполняют двойную роль:

- **Статические записи** — применяются локальным firewall (выше), до любой загрузки.
- **Динамические псевдонимы** (`EOL`, `ALPHA`, `MAINTENANCE`) — локальный firewall игнорирует; включаются в краткоживущий license JWT, отправляемый только на `mirror.author.io`. Зеркало применяет эти правила жизненного цикла при выдаче архива.

| Запись политики | Локальный клиент | Author mirror (`mirror.author.io`) | Публичное зеркало (`nodejs.org`) |
|:-|:-|:-|:-|
| `16.x` в block list | Запрещено до загрузки | Не достигается | Не достигается |
| `EOL` в block list | Разрешено локально (псевдоним игнорируется) | Запрещено, если версия end-of-life | Нет Author JWT — не применяется |
| Только allow `20.x` (без magic) | Не-20 запрещены локально | — | — |


```ini title="Пример: запрет загрузок end-of-life через зеркало Author"
# Registry Keys
VersionBlockList=EOL
VersionAllowList=20.x
                 22.x
```

Что это даёт:

1. **Локально:** `20.x` / `22.x` совпадают с allow list. `EOL` не раскрывается, поэтому end-of-life релиз **не** останавливается на клиенте одним этим псевдонимом. Поскольку есть динамический псевдоним, allow list также **не** считается эксклюзивным: другие версии всё ещё проходят локальную проверку.
1. **На `mirror.author.io`:** клиент отправляет license claim из этих списков (включая `NOT EOL`). Зеркало отклоняет end-of-life архивы.
1. **На `nodejs.org` (или любом не-Author зеркале):** нет Author JWT — `EOL` ничего не делает. Ставьте Author первым в [`node_mirror`](../cfg/core#downloads-and-mirrors) или добавьте статические блокировки (например, `16.x`), если нужно принуждение без зеркала Author.

Изолированные/[`local_install_only`](../cfg/registry#available-registry-keys) установки не обращаются к зеркалу, поэтому `EOL` в локальных средах не применяется. Используйте статические allow/block списки (или размещайте только одобренные архивы).


### 2. Hosted Rules

Hosted rules настраиваются через клиентский портал:

<DocImage src="/img/features/proxy/mirror_ruleset_form.png" alt="Mirror Rulesets" style={{ display: 'block', width: '100%', height: 'auto', margin: '0 auto' }} />

Эти правила можно применять условно по:

- Диапазонам IP-адресов
- Географическому местоположению
- Доменам (например, Active Directory Domain ID, Entra ID)
- Учётной записи/SID пользователя
- Назначенному Access Key (License Group)

Правила, совпадающие с вашими условиями, применяются к каждому запросу — тонкий контроль над разрешёнными версиями для загрузки.

:::tip[Работаете в регулируемой среде?]
Организации, чьи политики запрещают хранение любых данных организации на hosted-сервисах, могут отключить hosted rules без влияния на локальные правила, обрабатываемые зеркалом. Это делается на [странице конфигурации Node Mirror](https://portal.author.io/nvm-windows/config).

**Строго регулируемые организации или организации с очень жёсткими compliance-политиками могут запросить полное удаление этой функции.** [Свяжитесь с нами](mailto:support@author.io), если нужно убрать hosted rules полностью.
:::

## Локальные (и изолированные) установки

| Настройка | Реестр | Роль |
|:-|:-|:-|
| [`local_dir`](../cfg/registry#available-registry-keys) | `LocalInstallDir` | Каталог предразмещённых архивов Node (+ checksums). Предпочтительнее сети, если есть. |
| [`local_install_only`](../cfg/registry#available-registry-keys) | `LocalInstallOnly` | Если включено, **никогда** не загружать; ошибка при отсутствии версии локально. |

`AirGapped` отдельно: только принудительная **офлайн-проверка license JWKS** (`licensing.author.io` пропускается). Сама по себе **не** блокирует загрузки Node — для air-gap установок используйте `LocalInstallOnly` (и/или уберите удалённые зеркала). См. [Локальные установки](./local-installations) и [Изолированные установки](../guide/air-gapped-installations).

## См. также

| Тема | Документ |
|:-|:-|
| Базовые [`node_mirror`](../cfg/core#downloads-and-mirrors) / [`npm_mirror`](../cfg/core#downloads-and-mirrors) | [Зеркала загрузок](./mirrors) |
| HTTP-прокси | [Зеркала загрузок](./mirrors#http-proxies) |
| Пользовательские ключи конфигурации | [Базовая конфигурация](../cfg/core) |
| Ключи политики и образец `.reg` | [Справочник политики реестра](../cfg/registry) |
| Исключения firewall | [Требования](../install/enterprise/requirements) |
| Возможности edition | [Выбор edition](../guide/builds/) |
| Проверка зеркал/прокси | [`nvm env`](../command/env) |
