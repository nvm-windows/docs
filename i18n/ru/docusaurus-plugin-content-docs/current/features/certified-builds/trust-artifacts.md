---
title: Trust Artifacts
sidebar_label: Trust Artifacts
sidebar_position: 1
certified:
  edition: Trust Artifacts
---

import PageLink from '@site/docs/_components/PageLink';
import TrustArtifactList from '@site/docs/_components/TrustArtifactList';

# Trust Artifacts

Trust Artifacts — дополнение для [Certified Builds](../../guide/builds/).
С каждым certified-релизом оно поставляет **compliance-пакет**, чтобы команды безопасности, закупок и аудиторы могли проверить, что Author Software собрал и подписал.

Пакет не заменяет [лицензионное соглашение](https://nvm-windows.com/eula.html) Certified Builds.
Он продаётся отдельно от deployment zip / MSI Certified.
Это не уровень продукта под именем Compliance.

## Что вы получаете \{#what-you-get\}

<TrustArtifactList />

В том же zip также лежат `VERIFY.md` и `Verify-NvmWindowsProvenance.ps1`, чтобы клиенты и аудиторы могли проверить provenance офлайн.
Отдельного файла AI-BOM **нет** — отсутствие AI/ML фиксируется внутри CycloneDX SBOM.

## Как получить пакет \{#get-the-pack\}

Лицензированные клиенты скачивают Trust Artifacts в [клиентском портале](https://portal.author.io).

| Кто | Как |
|:-|:-|
| **Клиент** | Войдите в портал. Скачайте `nvm-windows-<version>-trust-artifacts-<arch>.zip` для каждой архитектуры, которую разворачиваете (`amd64` / `arm64`). |
| **Аудитор** | Портал может доставить тот же пакет от Author аудиторам клиента. Аудиторы получают материалы через портал, а не только как пересылку от клиента. |

Через портал берите и файлы продукта Certified, и соответствующий zip Trust Artifacts для этой версии и архитектуры.
Держите trust zip рядом с файлами продукта, которые проверяете.

## Содержимое пакета \{#pack-layout\}

Имя zip: `nvm-windows-<version>-trust-artifacts-<arch>.zip`.

```text
nvm-windows-<version>-trust-artifacts-<arch>/
├── VERIFY.md
├── Verify-NvmWindowsProvenance.ps1
├── sbom/
│   ├── node.cdx.json
│   ├── proxy.cdx.json
│   ├── reshim.cdx.json
│   ├── nvm.cdx.json
│   ├── sync.cdx.json
│   ├── nvm-windows.cdx.json
│   ├── author-signing-public.pem
│   └── README.md
├── provenance/
│   ├── nvm-windows-<ver>-certified-<arch>.intoto.dsse.json
│   └── README.md
├── licenses/
│   ├── open-source-license-report.md
│   └── open-source-license-report.csv
└── sast/
    ├── gosec.sarif
    ├── psscriptanalyzer.sarif
    └── README.md
```

### Руководство и скрипт проверки

| Файл | Роль |
|:-|:-|
| `VERIFY.md` | Офлайн-чеклист для клиентов и аудиторов. Начните с него. |
| `Verify-NvmWindowsProvenance.ps1` | Верификатор PowerShell 7 для DSSE / in-toto provenance. Без Sigstore, cosign и `slsa-verifier`. |

### SBOM (`sbom/`)

Подписанный CycloneDX JSON (встроенная подпись JSF, когда подписание выполнялось).
Типичные файлы:

- SBOM компонентов: `node.cdx.json`, `proxy.cdx.json`, `reshim.cdx.json`, `nvm.cdx.json`, `sync.cdx.json`
- Сводка: `nvm-windows.cdx.json`
- Открытый ключ: `author-signing-public.pem`

Проверяйте через [cyclonedx-cli](https://github.com/CycloneDX/cyclonedx-cli) с поставленным PEM (см. `VERIFY.md` и `sbom/README.md`).

### SLSA provenance (`provenance/`)

Автономные конверты DSSE + in-toto (`.intoto.dsse.json`) для certified app pack.
Provenance релиза производится на уровне **SLSA Build Level 3** (изолированный attestor).
Криптографическая проверка полностью офлайн.
Для проверки не нужны закрытые исходники или YAML workflow.

Запускайте `Verify-NvmWindowsProvenance.ps1` с `-RequireBuildL3`, как описано в `VERIFY.md`.

### Отчёт по open-source лицензиям (`licenses/`)

| Файл | Роль |
|:-|:-|
| `open-source-license-report.md` | Сводка счётчиков |
| `open-source-license-report.csv` | Строки по компонентам из rollup SBOM |

Строка со статусом `unknown` требует проверки.
Отчёт не заменяет Certified EULA.

### SAST (`sast/`)

| Файл | Роль |
|:-|:-|
| `gosec.sarif` | Статический анализ Go (SARIF 2.1.0) |
| `psscriptanalyzer.sarif` | Статический анализ PowerShell (SARIF 2.1.0) |

Находка — пункт для проверки.
Пустой список `results` значит, что инструмент ничего не сообщил.
Эти файлы не являются тестом на проникновение.

## Как проверять \{#how-to-review\}

1. Скачайте файлы продукта Certified и соответствующий zip Trust Artifacts в [клиентском портале](https://portal.author.io) (или получите их как аудитор через портал).
2. Распакуйте trust-пакет рядом с файлами продукта для этой версии и архитектуры.
3. Следуйте `VERIFY.md` в zip — сначала provenance (`Verify-NvmWindowsProvenance.ps1 -RequireBuildL3`), затем SBOM, SAST и отчёт о лицензиях.
4. **Не** используйте cosign, Fulcio, Rekor, GitHub Attestations или `slsa-verifier` для этого пакета.

## Связанные материалы \{#related\}

- <PageLink id="choosingABuild" />
- [Понимание безопасности](../../guide/security)
- [Клиентский портал](https://portal.author.io)
