---
title: Зеркала загрузок
sidebar_position: 7
---

NVM for Windows загружает архивы Node.js с одного или нескольких **Node mirrors** и в режиме shim может переключаться на один или несколько URL **npm registry**. Задавайте их через [`nvm config`](../command/nvm/config) (или политику машины в certified-парках).

Эта страница описывает базовые URL зеркал для Community Builds и Certified Builds. Для HTTP(S)-прокси (как трафик выходит с машины) см. [HTTP-прокси](./http-proxy). Для зеркала Author с политиками _(Governance)_ см. [Author Mirror](./author-mirror). Для клиентских списков allow/deny версий см. [NVM Firewall](./firewall).

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

## См. также

| Тема | Документ |
|-------|-----|
| Полная таблица настроек | [Базовая конфигурация](../cfg/core#downloads-and-mirrors) |
| HTTP(S)-прокси | [HTTP-прокси](./http-proxy) |
| Типы политики/`.reg` | [Справочник политики реестра](../cfg/registry) |
| Author Mirror | [Author Mirror](./author-mirror) |
| NVM Firewall | [NVM Firewall](./firewall) |
| Офлайн-архивы | [Изолированные установки](../guide/air-gapped-installations) |
