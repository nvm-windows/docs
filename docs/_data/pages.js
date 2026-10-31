/**
 * Shared page titles, descriptions, hrefs, and Trust Artifacts contents.
 *
 * Render with PageLink, PageDescription, and TrustArtifactList so locales
 * pick up `docMeta.*` keys in `i18n/<locale>/code.json`.
 *
 * Add an entry when another page reuses this title or description.
 */

/** @typedef {{ id: string, name: string, summary: string }} TrustArtifactItem */
/** @typedef {{ title: string, description: string, href: string, sidebarLabel?: string, edition?: string }} PageMeta */

/** Public recommendation pages. Use these URLs whenever we cite Microsoft or Google. */
export const recommendationLinks = {
  microsoft:
    'https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows',
  google: 'https://docs.cloud.google.com/nodejs/docs/setup#installing_nvm',
};

/** @type {Record<string, PageMeta>} */
export const pages = {
  choosingABuild: {
    title: 'Choosing a Build',
    description:
      'Differences between NVM for Windows Community Builds and Certified Builds.',
    href: '/guide/builds/',
  },
  trustArtifacts: {
    title: 'Trust Artifacts',
    description:
      'SBOM, SLSA provenance, license and SAST materials for Certified Builds — download from the customer portal for your team or auditors.',
    href: '/features/certified-builds/trust-artifacts',
    edition: 'Trust Artifacts',
  },
  advancedLogging: {
    title: 'Advanced Logging',
    description: 'Structured logging for SIEM integration.',
    href: '/features/certified-builds/advanced-logging',
    edition: 'Advanced Logging',
  },
  governance: {
    title: 'Governance',
    description:
      'Policy pack for fleets that lock settings and control downloads.',
    href: '/features/certified-builds/governance',
    edition: 'Governance',
  },
  oem: {
    title: 'Preconfiguring a Windows Image',
    sidebarLabel: 'OEM / Factory Images',
    description: 'Preconfigure NVM for Windows on a Windows image.',
    href: '/guide/oem',
  },
};

/**
 * Canonical Trust Artifacts pack contents (what the zip ships).
 * Do not add a separate AI-BOM file — AI/ML absence is recorded inside the CycloneDX SBOM.
 * Do not list "SLSA Build L3" as its own row — that is the SLSA attestation level.
 *
 * @type {TrustArtifactItem[]}
 */
export const trustArtifactItems = [
  {
    id: 'sbom',
    name: 'Signed Bill of Materials (SBOM)',
    summary:
      'CycloneDX component and rollup SBOMs (`node`, `proxy`, `reshim`, `nvm`, `sync`, `nvm-windows`), signed when the release signing step runs.',
  },
  {
    id: 'slsa',
    name: 'SLSA Attestations',
    summary:
      'Offline-verifiable DSSE / in-toto provenance for the certified app pack (SLSA Build L3).',
  },
  {
    id: 'sast',
    name: 'SAST results',
    summary:
      'SARIF 2.1.0 from gosec (Go) and PSScriptAnalyzer (PowerShell). Not a penetration test; no CodeQL or DAST.',
  },
  {
    id: 'licenses',
    name: 'Open-source license report',
    summary:
      'Markdown summary and CSV inventory derived from the rollup SBOM. Rows marked `unknown` need review.',
  },
  {
    id: 'vex',
    name: 'VEX Reporting',
    summary:
      'Vulnerability exploitability statements when required for the release.',
  },
];

/**
 * @param {string} id
 * @returns {PageMeta}
 */
export function getPage(id) {
  const page = pages[id];
  if (!page) {
    throw new Error(`Unknown docs page id: ${id}`);
  }
  return page;
}
