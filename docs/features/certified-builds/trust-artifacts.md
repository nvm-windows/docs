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

Trust Artifacts is an add-on for [Certified Builds](../../guide/builds/).
It ships a **compliance pack** with each certified release so security, procurement, and auditors can review what Author Software built and signed.

The pack does not replace the Certified Build [End User License Agreement](https://nvm-windows.com/eula.html).
It is sold separately from the Certified Builds deployment zip / MSI.

## What you get

<TrustArtifactList />

The same zip also includes `VERIFY.md` and `Verify-NvmWindowsProvenance.ps1` so customers and auditors can verify provenance offline.
There is **no** separate AI-BOM file — AI/ML absence is recorded inside the CycloneDX SBOM.

## Get the pack \{#get-the-pack\}

Licensed customers download Trust Artifacts from the [customer portal](https://portal.author.io).

| Who | How |
|:-|:-|
| **Customer** | Sign in to the portal. Download `nvm-windows-<version>-trust-artifacts-<arch>.zip` for each architecture you deploy (`amd64` / `arm64`). |
| **Auditor** | The portal can deliver the same Author-issued pack to the customer's auditors. Auditors receive the materials through the portal instead of relying on a customer-forwarded copy. |

Use the portal for both the Certified product files and the matching Trust Artifacts zip for that version and architecture.
Keep the trust zip next to the product files you are verifying.

## Pack layout \{#pack-layout\}

Zip name: `nvm-windows-<version>-trust-artifacts-<arch>.zip`.

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

### Verification guide and script

| File | Role |
|:-|:-|
| `VERIFY.md` | Offline checklist for customers and auditors. Start here. |
| `Verify-NvmWindowsProvenance.ps1` | PowerShell 7 verifier for DSSE / in-toto provenance. No Sigstore, cosign, or `slsa-verifier`. |

### SBOM (`sbom/`)

Signed CycloneDX JSON (embedded JSF signature when signing ran).
Typical files:

- Component SBOMs: `node.cdx.json`, `proxy.cdx.json`, `reshim.cdx.json`, `nvm.cdx.json`, `sync.cdx.json`
- Rollup: `nvm-windows.cdx.json`
- Public key: `author-signing-public.pem`

Verify with [cyclonedx-cli](https://github.com/CycloneDX/cyclonedx-cli) using the shipped PEM (see `VERIFY.md` and `sbom/README.md`).

### SLSA provenance (`provenance/`)

Self-contained DSSE + in-toto envelopes (`.intoto.dsse.json`) for the certified app pack.
Release provenance is produced under **SLSA Build Level 3** (isolated attestor).
Cryptographic verification is fully offline.
You do not need private source repos or workflow YAML to verify.

Run `Verify-NvmWindowsProvenance.ps1` with `-RequireBuildL3` as documented in `VERIFY.md`.

### Open-source license report (`licenses/`)

| File | Role |
|:-|:-|
| `open-source-license-report.md` | Summary counts |
| `open-source-license-report.csv` | Per-component rows from the rollup SBOM |

A row marked `unknown` needs review.
The report does not replace the Certified EULA.

### SAST (`sast/`)

| File | Role |
|:-|:-|
| `gosec.sarif` | Go static analysis (SARIF 2.1.0) |
| `psscriptanalyzer.sarif` | PowerShell static analysis (SARIF 2.1.0) |

A finding is a review item.
An empty `results` list means that tool reported nothing.
These files are not a penetration test.

## How to review \{#how-to-review\}

1. Download the Certified product files and the matching Trust Artifacts zip from the [customer portal](https://portal.author.io) (or receive them as an auditor through the portal).
2. Unzip the trust pack next to the product files for that version and architecture.
3. Follow `VERIFY.md` in the zip — provenance first (`Verify-NvmWindowsProvenance.ps1 -RequireBuildL3`), then SBOM, SAST, and license report.
4. Do **not** use cosign, Fulcio, Rekor, GitHub Attestations, or `slsa-verifier` on this pack.

## Related

- <PageLink id="choosingABuild" />
- [Understanding Security](../../guide/security)
- [Customer portal](https://portal.author.io)
