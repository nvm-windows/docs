---
title: HTTP-прокси
sidebar_label: HTTP-прокси
sidebar_position: 7.5
---

Корпоративные сети часто требуют HTTP(S)-прокси между NVM for Windows и интернетом.
Прокси применяется к трафику загрузок: архивы Node.js, каталоги и связанные HTTPS-вызовы.
Это отдельно от [Зеркал загрузок](./mirrors), которые задают, *откуда* берутся архивы.

Community Builds и Certified Builds поддерживают базовый URL прокси.
Basic и Bearer auth — путь Certified Builds.
IWA (NTLM/Negotiate) и PAC/WPAD нужны в дополнении [Governance](./certified-builds/governance).

## Порядок разрешения

1. Явная настройка [`proxy`](../cfg/core#proxy) / `Proxy` (политика или config)
1. Переменные окружения процесса (`HTTP_PROXY`, `HTTPS_PROXY` и связанные)
1. Системный прокси Internet Explorer / WinINET

## Конфигурация

| Config | Реестр | Примечания |
|:-|:-|:-|
| [`proxy`](../cfg/core#proxy) | `Proxy` | URL прокси, например `http://proxy.example.corp:8080` |
| [`proxy_auth`](../cfg/registry#available-registry-keys) | `ProxyAuth` | `user:pass` или `Bearer YOUR_TOKEN` — хранится **в открытом виде** |
| [`proxy_auth_type`](../cfg/registry#available-registry-keys) | `ProxyAuthType` | `basic`, `bearer`, `ntlm`, `negotiate` или `ntlm,negotiate` |

```powershell
nvm config set proxy=http://proxy.example.corp:8080
nvm config get proxy
```

В certified-парках задавайте ключи прокси политикой машины. См. [Справочник политики реестра](../cfg/registry).

## Возможности по лицензии \{#capabilities-by-license}

| Возможность | Community Builds | Certified Builds | Governance |
|:-|:-:|:-:|:-:|
| Proxy URL | ✓ | ✓ | ✓ |
| Basic/Bearer auth | ограничено* | ✓ | ✓ |
| IWA (NTLM/Negotiate, текущий пользователь) | :x: | :x: | ✓ |
| PAC/WPAD (WinHTTP) | :x: | :x: | ✓ |

\*Community Builds может встроить учётные данные в URL прокси. Отдельная инъекция `ProxyAuth*` — путь Certified Builds.

:::warning[ProxyAuth в реестре]
`ProxyAuth` в политике и настройках хранится открытым текстом. Используйте IWA (`ntlm` / `negotiate`), если регламент запрещает хранение паролей.
:::

:::info[Без Digest и browser proxies]
Digest auth не поддерживается. Требования велики, а реальное использование редко.

У NVM for Windows нет интерактивного SAML/OIDC browser login для captive portal. Используйте PAC, если это корпоративный путь.
:::

## См. также

- [Зеркала загрузок](./mirrors) — URL Node.js и npm registry
- [Author Mirror](./author-mirror) — хост загрузок с политиками Governance
- [Базовая конфигурация](../cfg/core#proxy) — настройка `proxy`
- [Справочник политики реестра](../cfg/registry) — `Proxy`, `ProxyAuth`, `ProxyAuthType`
- [Governance](./certified-builds/governance) — IWA и PAC/WPAD
- [Требования Enterprise](../install/enterprise/requirements#proxy-exceptions) — списки исходящих исключений
