// @ts-check
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
*/

const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Install',
      collapsed: false,
      collapsible: true,
      items: [
        {
          type: 'doc',
          label: 'Installers & Packages',
          id: 'install/installers',
        },
        {
          type: 'category',
          label: 'Enterprise Deployment',
          key: 'install-enterprise-deployment',
          collapsed: true,
          collapsible: true,
          items: [
            'install/enterprise/requirements',
            'install/enterprise/intune',
            'install/enterprise/ad',
          ],
        },
        {
          type: 'doc',
          label: 'Build from Source',
          id: 'install/source',
        },
        {
          type: 'doc',
          label: 'Uninstall',
          id: 'install/uninstall',
        },
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: true,
      collapsible: true,
      items: [
        'features/newv2',
        'features/modes',
        'features/windows-apps',
        'features/log',
        'features/notifications',
        'features/windows-registry',
        'features/mirrors',
        'features/author-mirror',
        'features/local-installations',
        'features/cache',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      collapsed: true,
      collapsible: true,
      items: [
        'cfg/core',
        {
          type: 'category',
          label: 'Enterprise policy',
          collapsed: true,
          collapsible: true,
          items: [
            'cfg/ad',
            'cfg/registry'
          ],
        }
      ],
    },
    {
      type: 'category',
      label: 'Commands',
      collapsed: true,
      collapsible: true,
      link: {
        type: 'generated-index',
        title: 'Command Reference',
        description:
          'Detailed command documentation for nvm install, use, list, config, cache, and related operations.',
        slug: '/commands',
      },
      items: [
        {
          type: 'category',
          label: 'install',
          collapsed: true,
          link: {type: 'doc', id: 'command/install/index'},
          items: ['command/install/native-tools'],
        },
        'command/uninstall',
        {
          type: 'category',
          label: 'use',
          collapsed: true,
          link: {type: 'doc', id: 'command/use/index'},
          items: [
            'command/use/lts',
            'command/use/latest',
            'command/use/last',
            'command/use/shim',
            'command/use/link',
          ],
        },
        'command/pin',
        {
          type: 'category',
          label: 'list',
          collapsed: true,
          link: {type: 'doc', id: 'command/list/index'},
          items: ['command/list/releases', 'command/list/cached'],
        },
        {
          type: 'category',
          label: 'alias',
          collapsed: true,
          link: {type: 'doc', id: 'command/alias/index'},
          items: [
            'command/alias/add',
            'command/alias/list',
            'command/alias/remove',
          ],
        },
        'command/default',
        'command/env',
        {
          type: 'category',
          label: 'cache',
          collapsed: true,
          link: {type: 'doc', id: 'command/cache/index'},
          items: [
            'command/cache/add',
            'command/cache/list',
            {
              type: 'category',
              label: 'remove',
              collapsed: true,
              link: {type: 'doc', id: 'command/cache/remove/index'},
              items: [
                'command/cache/remove/version',
                'command/cache/remove/metadata',
                'command/cache/remove/all',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'config',
          collapsed: true,
          link: {type: 'doc', id: 'command/config/index'},
          items: [
            'command/config/list',
            'command/config/get',
            'command/config/set',
            'command/config/reset',
            'command/config/docs',
          ],
        },
        'command/on',
        'command/off',
        'command/sync-doctor',
        'command/sync-upgrade',
      ],
    },
    'permissions',
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      collapsible: true,
      link: {
        type: 'generated-index',
        title: 'Guides',
        description:
          'Deep dives on NVM for Windows capabilities and workflows.',
        slug: '/guides',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'guide',
        },
      ],
    },
    'troubleshooting',
  ],
};

export default sidebars;