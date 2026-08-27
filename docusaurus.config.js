// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const algoliaAppId = process.env.ALGOLIA_APP_ID;
const algoliaSearchApiKey = process.env.ALGOLIA_SEARCH_API_KEY;
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME;
const algoliaValues = [algoliaAppId, algoliaSearchApiKey, algoliaIndexName];
const configuredAlgoliaValues = algoliaValues.filter(Boolean).length;

if (
  configuredAlgoliaValues > 0 &&
  configuredAlgoliaValues < algoliaValues.length
) {
  throw new Error(
    'Algolia DocSearch requires ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY, and ALGOLIA_INDEX_NAME.',
  );
}

const algolia =
  configuredAlgoliaValues === algoliaValues.length
    ? {
        appId: algoliaAppId,
        apiKey: algoliaSearchApiKey,
        indexName: algoliaIndexName,
        contextualSearch: true,
        searchPagePath: 'search',
      }
    : undefined;

const searchNavbarItem = algolia
  ? /** @type {const} */ ({
      type: 'search',
      position: 'right',
    })
  : undefined;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nvm-windows Documentation',
  // tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.nvm-windows.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nvm-windows', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      ru: {
        label: 'Русский',
        htmlLang: 'ru-RU',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nvm-windows/docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@writechoice/docusaurus-plugin-llms-txt',
      {
        // Defaults are true for these three; set explicitly for clarity.
        generateLlmsTxt: true,
        generateLlmsFullTxt: true,
        generateMarkdownFiles: true,
        description:
          'NVM for Windows documentation — installers, features, configuration, and enterprise deployment.',
        // Deploy uses Cloudflare Pages (`wrangler pages deploy ./build`).
        // Writes functions/[[path]].js (Accept: text/markdown) plus MCP at /mcp.
        deployTarget: null, //'cloudflare',
        generateMcp: false,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      ...(algolia ? {algolia} : {}),
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'NVM for Windows',
        logo: {
          alt: 'NVM for Windows',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'localeDropdown',
            position: 'right',
          },
          ...(searchNavbarItem ? [searchNavbarItem] : []),
          {
            href: 'https://github.com/nvm-windows/docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/install/installers',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/nvm-windows/docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Author Software Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['powershell', 'ini'],
      },
    }),
};

export default config;
