---
title: Зеркала загрузок
sidebar_position: 7
---

NVM for Windows загружает архивы Node.js с одного или нескольких **Node mirrors** и в режиме shim может переключаться на один или несколько URL **npm registry**. Задавайте их через [`nvm config`](../command/config) (или политику машины в certified-парках).

Эта страница описывает базовые URL зеркал и HTTP-прокси для Community и certified-сборок. Для зеркала Node.js с политиками Author и version firewall _(Governance)_ см. [Version Firewall + Author Mirror](./author-mirror).

## Зеркала Node.js

| Опция | Реестр | По умолчанию |
|--------|----------|---------|
| [`node_mirror`](../cfg/core#downloads-and-mirrors) | `MirrorNode` | https://nodejs.org/dist |

Используется, когда `nvm install` (и связанные команды) нужно получить Windows-архив Node.js `.7z` и checksums, после промаха [локальной установки](./local-installations)/[кэша](./cache).

В `nvm config` передайте один URL или список через **запятую**. В реестре храните `MirrorNode` как **`REG_MULTI_SZ`** (один URL на запись).

```powershell
nvm config set node_mirror=https://nodejs.org/dist
nvm config set node_mirror=https://npmmirror.com/mirrors/node
nvm config set node_mirror=https://npmmirror.com/mirrors/node,https://nodejs.org/dist
nvm config get node_mirror
```

Порядок разрешения при установке:

1. Локальный источник архивов ([`local_dir`](../cfg/registry#available-registry-keys)/кэш версий), если есть (см. [Локальные установки](./local-installations) и [Кэш загрузок](./cache)).
2. Обход упорядоченного списка [`node_mirror`](../cfg/core#downloads-and-mirrors).
3. Остановка на **первом успешном** ответе.

Ставьте предпочитаемое зеркало первым. Публичный fallback полезен, если основной хост недоступен.

`nvm env` показывает эффективный список зеркал после слияния конфигурации и политики.

## Зеркала npm registry

| Опция | Реестр | По умолчанию |
|--------|----------|---------|
| [`npm_mirror`](../cfg/core#downloads-and-mirrors) | `MirrorNpm` | https://registry.npmjs.org |

[`npm_mirror`](../cfg/core#downloads-and-mirrors) **не** используется для загрузки установщиков Node.js. В режиме **shim** он задаёт fallback URL npm registry (и связанных менеджеров пакетов), если пользователь или проект ещё не задали свой.

Те же правила списка, что и для Node mirrors: через запятую в `nvm config`; **`REG_MULTI_SZ`** для `MirrorNpm` в реестре.

```powershell
nvm config set npm_mirror=https://registry.npmjs.org
nvm config set npm_mirror=https://registry.npmmirror.com,https://registry.npmjs.org
nvm config get npm_mirror
```

Держите зеркала Node и npm registry раздельно.

## HTTP proxies \{#http-proxies}

Корпоративные сети часто требуют HTTP(S)-прокси между NVM и зеркалом. Порядок разрешения:

1. Явная настройка [`proxy`](../cfg/core#proxy)/`Proxy` (политика или config)
2. Переменные окружения процесса (`HTTP_PROXY`, `HTTPS_PROXY` и т. д.)
3. Системный прокси Internet Explorer/WinINET

| Config | Реестр | Примечания |
|:-|:-|:-|
| [`proxy`](../cfg/core#proxy) | `Proxy` | URL прокси, например `http://proxy.example.corp:8080` |
| [`proxy_auth`](../cfg/registry#available-registry-keys) | `ProxyAuth` | `user:pass` или `Bearer YOUR_TOKEN` — хранится **в открытом виде** |
| [`proxy_auth_type`](../cfg/registry#available-registry-keys) | `ProxyAuthType` | `basic`, `bearer`, `ntlm`, `negotiate` или `ntlm,negotiate` |

:::info[Certified Builds]
Доступно с сентября 2026.
:::

| Возможность | Community | Certified (Distribution/Audit) | Governance |
|:-|:-:|:-:|:-:|
| Proxy URL | ✓ | ✓ | ✓ |
| Basic/Bearer auth | ограничено* | ✓ | ✓ |
| IWA (NTLM/Negotiate, текущий пользователь) | — | — | ✓ |
| PAC/WPAD (WinHTTP) | — | — | ✓ |

\*Community может встроить учётные данные в URL прокси; отдельная инъекция `ProxyAuth*` — путь certified.

:::warning[ProxyAuth в реестре]
`ProxyAuth` в политике/настройках хранится открытым текстом. Используйте IWA (`ntlm`/`negotiate`), если регламент запрещает хранение паролей.
:::

:::info[Без Digest и browser proxies]
Digest auth не поддерживается из-за объёма требований и редкого использования.

Интерактивного SAML/OIDC browser login для captive portal нет. Рассмотрите PAC.
:::

## См. также

| Тема | Документ |
|-------|-----|
| Полная таблица настроек | [Базовая конфигурация](../cfg/core#downloads-and-mirrors) |
| Типы политики/`.reg` | [Справочник политики реестра](../cfg/registry) |
| Author mirror и version firewall | [Version Firewall + Author Mirror](./author-mirror) |
| Офлайн-архивы | [Изолированные установки](../guide/air-gapped-installations) |
