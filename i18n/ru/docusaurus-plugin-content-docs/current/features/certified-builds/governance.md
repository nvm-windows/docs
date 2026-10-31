---
title: Governance
sidebar_label: Governance
sidebar_position: 3
certified:
  edition: governance
---

# Governance

Governance — дополнение для [Certified Builds](../../guide/builds/).
Это **пакет политик** для флотов: шаблоны ADMX/ADML и скрипты с портала, с помощью которых IT фиксирует настройки, контролирует загрузки и принудительно включает защиту runtime через Active Directory, Entra, Intune или другой MDM.

Скачайте пакет в [клиентском портале](https://portal.author.io).

## Без этого дополнения \{#without-this-add-on\}

Certified Build без Governance продолжает работать — возможности уровня Community плюс defaults Certified.
Теряется возможность **принудительно** применять hive Policies из GPO / Intune, а также хосты и режимы прокси только для Governance ниже.

| Область | Без Governance |
|:-|:-|
| Настройки | Значения в `HKLM`/`HKCU\Software\Policies\Author Software\nvm` игнорируются (секреты лицензирования там всё ещё могут храниться, чтобы лицензия Governance могла bootstrap). Нет пакета ADMX/ADML |
| Загрузки | Только публичные зеркала и basic/bearer-прокси. Нет [Author Mirror](../author-mirror). Нет IWA и PAC/WPAD |
| Firewall | Списки allow/deny версий и модулей в Policies игнорируются |
| Malware | Пользователи могут отключить сканирование. Org-списки malware не принуждаются из машинной политики |
| Runtime | Флаги permission / V8 / eval и cooldown пакетов не принудительны. Блокировки lifecycle-скриптов и shim-режима из Policies не действуют |

## Зачем включать \{#why-enable-it\}

Governance нужен командам, которым на каждом управляемом ПК нужен один и тот же ответ:

- Prefs перестают «уплывать» — GPO / Intune владеет настройками, которые пользователь не может перекрыть
- Загрузки Node.js идут по политике (одобренные версии, корпоративный прокси или только локальные архивы)
- Установки пакетов остаются внутри правил supply chain (сканы malware, списки модулей, cooldown)
- Shimmed `node` может стартовать уже hardened, а не только когда разработчик вспомнит флаги

## Что входит в пакет \{#what-the-pack-is\}

| Элемент | Роль |
|:-|:-|
| `NVMWindows.admx` / `NVMWindows.adml` | Административные шаблоны для GPO и Intune. Пишут в `HKLM\Software\Policies\Author Software\nvm` |
| Скрипты лицензирования с портала | `Set-NvmWindowsLicensing.ps1` записывает материалы лицензии и `AccessKey` для JWT [Author Mirror](../author-mirror) (это не значения ADMX) |

Как импортировать шаблоны: [Административные шаблоны](../../cfg/ad).
Каждый ключ и default: [Справочник политики реестра](../../cfg/registry).

## Что можно принудить \{#what-you-can-force\}

### Доставка политик \{#policy-delivery\}

| Контроль | Что делает |
|:-|:-|
| Административные шаблоны | Фиксируют или перекрывают prefs из AD / Entra / Intune, чтобы endpoints разделяли одну позу. См. [Административные шаблоны](../../cfg/ad). |

### Загрузки и сеть \{#downloads-and-network\}

| Контроль | Что делает |
|:-|:-|
| Version firewall | Разрешение и запрет версий Node.js. Hosted-псевдонимы вроде `EOL` применяются на [Author Mirror](../author-mirror), а не только на клиенте. Локальные списки работают офлайн. См. [NVM Firewall](../firewall). |
| Author Mirror | Открывает `https://mirror.author.io/runtime/nodejs` — хост загрузок с политиками (недоступен в air-gap). См. [Author Mirror](../author-mirror). |
| Расширенный прокси | Требовать IWA (NTLM/Negotiate) или PAC/WPAD. См. [HTTP-прокси](../http-proxy). |
| Изолированные / локальные установки | Закрепить флот на локальных архивах (`LocalInstallDir` / `LocalInstallOnly`). См. [Локальные установки](../local-installations) и [Изолированные установки](../../guide/air-gapped-installations). |

### Supply chain \{#supply-chain\}

| Контроль | Что делает |
|:-|:-|
| Блокировка вредоносных пакетов | Держать сканы OpenSSF malware включёнными (`SkipMalwareChecks` принудительно выкл.). Развёртывать org allow/block-шаблоны и поведение trust-conflict из политики. См. [Malicious Package Blocker](../malicious-package-blocker). |
| Module firewall | Разрешать или запрещать установки npm/pnpm/yarn/npx по машинным спискам. См. [NVM Firewall](../firewall). |
| Lifecycle-скрипты пакетных менеджеров | Принудительно отключить lifecycle-скрипты install-класса из HKLM (`BlockPackageManagerLifecycleScripts`). См. [Lifecycle-скрипты и stock npm](#lifecycle-scripts-vs-stock-npm). Advanced Logging пишет **NVM4412**, когда эта блокировка переписывает команду. |
| Минимальный возраст пакета | Принудительный единый cooldown для npm/pnpm/yarn/yarnpkg, vlt и bun/bunx (если обёртка bun включена). Обходные флаги CLI снимаются. DWORD `0` принудительно выключает gate. |

#### Lifecycle-скрипты и stock npm \{#lifecycle-scripts-vs-stock-npm\}

npm, pnpm, yarn и аналоги уже позволяют разработчику пропускать install lifecycle-скрипты (`preinstall` / `install` / `postinstall` / `prepare`) флагами вроде `--ignore-scripts`. Это добровольно и легко забыть. NVM **не** даёт user preference или `nvm config` для этой блокировки.

Ценность Governance — **машинная политика, которая принуждает** то же поведение через package-manager shim на каждом управляемом ПК: proxy внедряет `--ignore-scripts` (или аналог Yarn) на install-командах и снимает попытки снова включить скрипты. Явный `npm run …` по-прежнему выполняется — так устроены package manager’ы. Проектный `.npmrc` не отменяет HKLM-блокировку. См. [`BlockPackageManagerLifecycleScripts`](../../cfg/registry#governance-keys) и [package-manager shims](/command/package-manager-shims#install-time-policy).

### Runtime hardening \{#runtime-hardening\}

| Контроль | Что делает |
|:-|:-|
| Shim mode | Принудительно `OperatingMode=shim`, чтобы runtime-политики (malware, firewall, логирование, флаги Node) могли применяться. Link mode эти проверки пропускает. |
| Модель прав Node | Принудительно `--permission` / `--experimental-permission` для shimmed `node` (default-deny FS/network, пока приложение не передаст `--allow-*`). |
| Заморозка V8 | Принудительно `--frozen-intrinsics`. |
| Запрет eval | Принудительно `--disallow-code-generation-from-strings`. |

Permission, freeze и disallow-eval также попадают в `npm_config_node_options` для lifecycle-скриптов npm/npx/pnpm, когда соответствующая политика включена.
Они **не** задают `NODE_OPTIONS`. Yarn, bun, corepack и vlt не покрываются.

### Блокировки флота \{#fleet-locks\}

| Контроль | Что делает |
|:-|:-|
| Отключить обновления | Блокировать in-app self-upgrade NVM (`DisableUpgrade`). Развёртывание пакета через AD / Intune по-прежнему работает. |
| Корень установки | Закрепить, где живут версии (`InstallRoot`), и при необходимости запретить пользователям менять путь (`AllowRootDirChange`). |
| Доверие к издателю | Закрепить разрешённые организации / thumbprints Authenticode (`AllowedSigners`, `AllowedThumbprints`). |

## Применение \{#apply\}

1. Скачайте пакет Governance (ADMX/ADML + скрипты лицензирования) в [клиентском портале](https://portal.author.io).
2. Установите Certified MSI / пакет Intune на флот ([требования enterprise](../../install/enterprise/requirements)).
3. Импортируйте ADMX и разверните нужные политики ([Intune](../../install/enterprise/intune), [Active Directory](../../install/enterprise/ad) или [ручной MSI](../../install/enterprise/manual)).
4. Проверьте значения в `HKLM\Software\Policies\Author Software\nvm` — см. [Справочник политики реестра](../../cfg/registry).

## Связанные материалы \{#related\}

- [Выбор сборки](../../guide/builds/)
- [Понимание безопасности](../../guide/security)
- [Malicious Package Blocker](../malicious-package-blocker)
- [NVM Firewall](../firewall)
- [Author Mirror](../author-mirror)
- [Клиентский портал](https://portal.author.io)
