---
slug: /cfg/registry
sidebar_label: Справочник политик реестра
sidebar_position: 2
certified:
  edition: governance
---

# Справочник политик реестра

Этот справочник описывает ключи и значения реестра для управления, защиты и настройки NVM for Windows в корпоративной среде.

Все административные политики должны применяться в разделе **HKEY_LOCAL_MACHINE (HKLM)**. Параметры здесь обязательны и переопределяют конфликтующие настройки пользователя в локальном интерфейсе приложения.

:::tip[Порядок переопределения политики]
Приложение оценивает настройки в следующем порядке приоритета:
1. `HKLM\Software\Policies\Author Software\nvm` (принудительная политика администратора)
2. `HKCU\Software\Author Software\Preferences\nvm` (пользовательские настройки)
:::

## Доступные ключи реестра \{#available-registry-keys}

См. [Административные шаблоны](ad) для развёртывания через GPO и Intune. Скачайте ADMX/ADML с [клиентского портала](https://portal.author.io). ADMX/ADML входят в пакет **Governance**; Distro/Audit по-прежнему могут задавать общие ключи через Registry CSP/OMA-URI или `.reg`.

**Overridable** в описании означает, что пользователь также может задать эквивалентную настройку (`nvm config` / HKCU). Политика машины в `HKLM\Software\Policies\Author Software\nvm` всегда имеет приоритет.

|Имя|Ключ|Описание|
|:-|:-|:-|
|**Air-gapped license verify**|`AirGapped`|**Edition: Distro+.** Пропустить live-загрузку JWKS с `licensing.author.io`. Проверять `AccessToken` только по офлайн-хранилищу JWKS с подписью COSE (`JwksCose` или `nvm-jwks.cose` рядом с `nvm.exe`). Независимо от `LocalInstallOnly`.<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Version aliases**|`Aliases`|**Overridable.** Централизованные псевдонимы (например, `stable=24.9.0`). Блокирует пользовательские псевдонимы, если задано политикой.<br /><br />`alias=version` на запись<br /><br />`REG_MULTI_SZ`|
|**Allow cache deletion**|`AllowDownloadCacheDelete`|**Overridable** (`allow_download_cache_removal`). Можно ли удалять кэшированные загрузки (`nvm cache remove`).<br /><br />- `0` = заблокировано<br />- `1` = разрешено<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Allow insecure downloads**|`AllowInsecureDownloads`|**Overridable** (`allow_insecure_downloads`). Разрешить загрузки при просроченных или недействительных TLS-сертификатах.<br /><br />- `0` = заблокировано<br />- `1` = разрешено<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Allow install root change**|`AllowRootDirChange`|**Overridable.** Могут ли пользователи менять корень установки.<br /><br />- `0` = заблокировано<br />- `1` = разрешено<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Allow native tool install**|`AllowToolInstall`|**Overridable.** Разрешить `nvm install native-tools` (Python, VS Build Tools и т. д.) (только shim).<br /><br />- `0` = заблокировано<br />- `1` = разрешено<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Allowed code signers**|`AllowedSigners`|**Overridable** (`allowed_signers`). Дополнительные доверенные подписанты `node.exe`. OpenJS Foundation, Node.js Foundation и Author Software всегда доверенны (только shim). Одно имя подписанта на запись.<br /><br />`REG_MULTI_SZ`|
|**Allowed thumbprints**|`AllowedThumbprints`|**Overridable** (`allowed_thumbprints`). Необязательные SHA-1 leaf thumbprints Authenticode (hex; разделители необязательны). Если не пусто, `node.exe` должен совпадать с pin после org allowlist. Пустое значение отключает pinning.<br /><br />`REG_MULTI_SZ`|
|**Authenticode revocation**|`AuthenticodeRevocation`|**Overridable** (`authenticode_revocation`). Режим CRL/OCSP для Authenticode:<br /><br />- `online` = сетевое получение (только install/sign/seed; по умолчанию)<br />- `cached` = только локальный URL-кэш<br />- `disabled` = без проверок отзыва<br /><br />Shim runtime никогда не использует `online` (ограничивается до `cached`). `AirGapped` принудительно ставит `cached`, когда применился бы `online`.<br /><br />По умолчанию: `online`<br /><br />`REG_SZ`|
|**Auto-detect files**|`AutoDetect`|**Overridable** (`auto_detect`). Файлы проекта для поиска pin версии (только shim). Переопределяет значения по умолчанию.<br /><br />По умолчанию:<br/>&nbsp;&nbsp;`.nvmrc`<br/>&nbsp;&nbsp;`.node-version`<br/>&nbsp;&nbsp;`package.json`<br /><br />`REG_MULTI_SZ`|
|**Auto-install missing version**|`AutoInstall`|**Overridable** (`auto_install`). Автоустановка отсутствующих обнаруженных версий (режим shim).<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Auto-install global modules**|`AutoInstallModuleList`|**Overridable** (`auto_installed_modules`). Глобальные npm-модули, устанавливаемые с каждой новой версией Node.js. Одно имя модуля на запись.<br /><br />`REG_MULTI_SZ`|
|**Prompt before auto-install**|`AutoInstallPrompt`|**Overridable** (`auto_install_prompt`). Подтверждение перед автоустановкой (режим shim).<br /><br />- `0` = без запроса<br />- `1` = с запросом<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Auto-use detected version**|`AutoUse`|**Overridable** (`auto_use`). Автопереключение на обнаруженную версию при выполнении команд (режим shim).<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Cache downloads**|`CacheDownloads`|**Overridable** (`cache_downloads`). Кэшировать загруженные версии Node.js для офлайн-использования.<br /><br />- `0` = выкл./false<br />- `1` = вкл./true<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Default detect file**|`DefaultDetectFile`|**Overridable** (`default_detect_file`). Файл, записываемый при закреплении версии (`nvm pin`) (только shim).<br /><br />По умолчанию: `.nvmrc`<br /><br />`REG_SZ`|
|**Disable announcements**|`DisableAnnouncements`|**Overridable** (`disable_announcements`). Скрыть объявления проекта и релизов.<br /><br />- `0` = показывать<br />- `1` = скрывать<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Disallow eval/string code gen**|`DisableEvalAndStringExecution`|**Overridable** (`disable_eval_and_string_execution`). Shim добавляет `--disallow-code-generation-from-strings`, блокируя `eval()` и `new Function()` (только shim). Не влияет на `node:vm`.<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Disable NVM upgrades**|`DisableUpgrade`|**Overridable.** Блокировать обновления NVM в приложении (не блокирует развёртывание пакетов AD/GPO).<br /><br />- `0` = разрешено<br />- `1` = заблокировано<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Disable version management**|`Enabled`|**Overridable** (`nvm on`/`nvm off`). Принудительно включает или отключает управление версиями. При выкл. NVM не управляет и не перенаправляет команды Node.js.<br /><br />- `0` = выкл. (`nvm off`)<br />- `1` = вкл.<br /><br />По умолчанию: `1`<br /><br />`REG_DWORD`|
|**Enforce permission model**|`EnforcePermissionModel`|**Overridable** (`enforce_permission_model`). Shim добавляет флаг permission model Node при каждом запуске `node.exe` (только shim). Запрет FS/сети по умолчанию, если процесс не передаёт `--allow-*` во время выполнения. NVM не добавляет grants `--allow-*`.<br /><br />- Node 23+: `--permission`<br />- Node 20–22: `--experimental-permission`<br />- Node &lt;20: без флага (не поддерживается)<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Freeze V8 global objects**|`FreezeV8GlobalObjects`|**Overridable** (`freeze_v8_global_objects`). Shim добавляет `--frozen-intrinsics`, чтобы встроенные прототипы нельзя было изменять (только shim; Node.js 12+). Увеличивает время запуска.<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Install root**|`InstallRoot`|**Overridable** (`root`). Каталог хранения версий Node.js. Переопределяет настройки машины и пользователя.<br /><br />По умолчанию: `%LOCALAPPDATA%\Author Software\nvm\installs`<br /><br />`REG_SZ`|
|**Local install source**|`LocalInstallDir`|**Overridable** (`local_dir`). Альтернативный локальный каталог архивов Node.js (air-gapped зеркала). Переопределяет кэш.<br /><br />`REG_SZ`|
|**Local install only**|`LocalInstallOnly`|**Overridable** (`local_install_only`). Ограничить установки только `LocalInstallDir`.<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Audit logging**|`LogExecutions`|**Overridable** (`log_executions`). Журналировать каждый вызов Node.js в журнал событий Windows (только shim). Наиболее полезно на **Audit+** (структурированный ETW).<br /><br />- `0` = выкл.<br />- `1` = вкл.<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**Node.js download mirrors**|`MirrorNode`|**Overridable** (`node_mirror`). Упорядоченный список зеркал; побеждает первый успешный ответ. См. [Зеркала загрузки](../features/mirrors). Зеркала Author `*.author.io` требуют лицензию Governance — см. [Version Firewall + Author Mirror](../features/author-mirror).<br /><br />По умолчанию: `https://nodejs.org/dist`<br /><br />`REG_MULTI_SZ`|
|**npm registry mirrors**|`MirrorNpm`|**Overridable** (`npm_mirror`). Упорядоченный список реестров npm. Используется как fallback реестра shim.<br /><br />По умолчанию: `https://registry.npmjs.org`<br /><br />`REG_MULTI_SZ`|
|**Operating mode**|`OperatingMode`|**Overridable** (`mode`). Как NVM for Windows управляет версиями Node.js.<br /><br />**Shim** (рекомендуется) использует подписанные shim для перехвата `node`, `npm`, `npx`, `yarn` и `pnpm`. Нужен для runtime-политик (audit logging, auto-detect, ACL).<br /><br />**Link** использует NTFS junction/symlink в PATH.<br /><br />По умолчанию: `shim`<br /><br />`REG_SZ`|
|**Package manager mismatch action**|`PackageManagerMismatchAction`|**Overridable** (`pm_mismatch_action`). Поведение при несовпадении версий npm/pnpm/yarn и Node во время install или use (только shim).<br /><br />- `ignore`<br />- `warn`<br />- `error`<br /><br />По умолчанию: `error`<br /><br />`REG_SZ`|
|**Proxy URL**|`Proxy`|**Overridable** (`proxy`). Прокси для загрузок. Basic и Bearer работают во всех certified-редакциях. См. [Зеркала загрузки](../features/mirrors#http-proxies).<br /><br />`REG_SZ`|
|**Proxy auth value**|`ProxyAuth`|**Overridable** (`proxy_auth`). Учётные данные или bearer token (хранится в открытом виде).<br /><br />- `user:pass`<br />- `Bearer YOUR_TOKEN`<br /><br />`REG_SZ`|
|**Proxy auth type**|`ProxyAuthType`|**Overridable** (`proxy_auth_type`). Схема аутентификации для настроенного прокси.<br /><br />- `basic`, `bearer` — все certified-редакции<br />- `ntlm`, `negotiate`, `ntlm,negotiate` — **только Governance** (IWA); PAC/WPAD тоже только Governance<br /><br />`REG_SZ`|

## Ключи Governance \{#governance-keys}

Эти ключи входят в набор функций **Governance**. Они есть в ADMX-пакете Governance.

|Имя|Ключ|Описание|
|:-|:-|:-|
|**Verbose mirror license metadata**|`ApplyVerboseLicenseMetadata`|Если включено, JWT лицензии зеркала Author включают identity claims (`idp_username`, `idp_machine_name`, `idp_machine_id`). Не задаёт `AccessToken`/`AccessKey`.<br /><br />- `0` = без claims<br />- `1` = с claims<br /><br />По умолчанию: `0`<br /><br />`REG_DWORD`|
|**npm module minimum age**|`NpmModuleMinimumAge`|Минимальный возраст публикации пакета (cooldown) в минутах для установок через менеджеры пакетов (режим shim). Автоконвертация для npm/pnpm/yarn.<br /><br />По умолчанию: `0` (отключено)<br /><br />`REG_DWORD`|
|**Allowed Node.js versions**|`VersionAllowList`|Allow list для установок. Недопустимые записи ломают enforcement. Allow побеждает block. Также питает version claims JWT Author mirror (magic tokens вроде `EOL`, `ALPHA`, `MAINTENANCE`, `ALL`).<br /><br />Поддерживает exact semver, wildcards (например, `20.x`), псевдонимы и negation `NOT`/`!` (одно правило на строку).<br /><br />`REG_SZ`|
|**Blocked Node.js versions**|`VersionBlockList`|Block list для установок. Те же форматы правил, что у `VersionAllowList`.<br /><br />`REG_SZ`|

:::info[License secrets]
`AccessToken`, `AccessKey` и `JwksCose` **не** являются политиками ADMX. Развёртывайте скриптами портала (`Set-NvmWindowsAccessToken.ps1` на stock certified build; `Set-NvmWindowsLicensing.ps1` для governance builds, также задаёт `AccessKey` для зеркал Author) или `nvm license`.
:::

:::tip[GPO vs значения реестра]
Несколько политик ADMX используют инвертированные метки GPO (например, **Disable automatic version detection** при включении записывает `AutoUse=0`). Таблицы описывают **значение реестра**, которое администраторы должны развёртывать через GPO, Intune (импортированный ADMX или Registry CSP) или Entra custom OMA-URI.
{/* MECM support is planned. */}
:::

## Пример импорта реестра

Сохраните как `nvm-policy.reg`, замените placeholder-пути и URL для вашей среды, затем дважды щёлкните или выполните `reg import nvm-policy.reg` из повышенной командной строки.

:::warning[Ключи `REG_MULTI_SZ`]
`MirrorNode`, `MirrorNpm`, `Aliases`, `AutoDetect`, `AutoInstallModuleList`, `AllowedSigners` и `AllowedThumbprints` — это **`REG_MULTI_SZ`** (одна строка на запись). Строка `.reg` вида `"MirrorNode"="url1,url2"` создаёт неверный **`REG_SZ`**. Задавайте их через ADMX, Registry CSP или PowerShell (ниже) — не через comma-joined `REG_SZ`.
:::

```powershell
Windows Registry Editor Version 5.00

; =============================================================================
; NVM for Windows — machine policy (HKLM)
; Path: HKLM\SOFTWARE\Policies\Author Software\nvm
; =============================================================================

[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Author Software\nvm]

; --- Core / environment ---
"OperatingMode"="shim"
"Enabled"=dword:00000001
"InstallRoot"="%LOCALAPPDATA%\\Author Software\\nvm\\installs"
"AllowRootDirChange"=dword:00000000
"LocalInstallDir"="D:\\Node\\local_mirror"
"LocalInstallOnly"=dword:00000000
"AirGapped"=dword:00000000

; --- Version ACL (Governance) ---
"VersionAllowList"="20.x\r\n22.x"
"VersionBlockList"="!20.17.0"

; --- Network / downloads (SZ / DWORD only here; MULTI_SZ via PowerShell below) ---
"Proxy"="http://proxy.example.corp:8080"
"ProxyAuthType"="ntlm"
; "ProxyAuth"="service-account:password"
; "ProxyAuth"="Bearer YOUR_TOKEN_HERE"
"CacheDownloads"=dword:00000001
"AllowDownloadCacheDelete"=dword:00000000
"AllowInsecureDownloads"=dword:00000000
"ApplyVerboseLicenseMetadata"=dword:00000000
"DisableUpgrade"=dword:00000001
"DisableAnnouncements"=dword:00000001

; --- Shim runtime (requires OperatingMode=shim) ---
"DefaultDetectFile"=".nvmrc"
"AutoUse"=dword:00000001
"AutoInstall"=dword:00000000
"AutoInstallPrompt"=dword:00000001
"AllowToolInstall"=dword:00000000
"PackageManagerMismatchAction"="error"
"LogExecutions"=dword:00000001
"EnforcePermissionModel"=dword:00000001
"FreezeV8GlobalObjects"=dword:00000001
"DisableEvalAndStringExecution"=dword:00000001
"NpmModuleMinimumAge"=dword:000005a0
```

После импорта `.reg` (или вместо него для list values) задайте multi-string ключи с правами администратора:

```powershell
$policy = 'HKLM:\SOFTWARE\Policies\Author Software\nvm'

New-ItemProperty -Path $policy -Name MirrorNode -PropertyType MultiString -Force -Value @(
  'https://mirror.author.io/runtime/nodejs'
  'https://nodejs.org/dist'
) | Out-Null

New-ItemProperty -Path $policy -Name MirrorNpm -PropertyType MultiString -Force -Value @(
  'https://npm.example.corp'
  'https://registry.npmjs.org'
) | Out-Null

New-ItemProperty -Path $policy -Name Aliases -PropertyType MultiString -Force -Value @(
  'stable=24.9.0'
  'lts=22.17.0'
) | Out-Null

New-ItemProperty -Path $policy -Name AutoDetect -PropertyType MultiString -Force -Value @(
  '.nvmrc'
  '.node-version'
  'package.json'
) | Out-Null

New-ItemProperty -Path $policy -Name AutoInstallModuleList -PropertyType MultiString -Force -Value @(
  'typescript'
  'eslint'
  'prettier'
) | Out-Null

New-ItemProperty -Path $policy -Name AllowedSigners -PropertyType MultiString -Force -Value @(
  'Contoso Ltd.'
) | Out-Null
```
