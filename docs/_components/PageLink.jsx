import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {getPage} from '@site/docs/_data/pages';

/**
 * Locale-aware link that uses the shared page catalog title (or sidebar label).
 *
 * @param {{ id: string, label?: 'title' | 'sidebar', children?: React.ReactNode }} props
 */
export default function PageLink({id, label = 'title', children}) {
  const page = getPage(id);
  const useSidebar = label === 'sidebar' && page.sidebarLabel;
  const text =
    children ??
    (useSidebar ? (
      <Translate id={`docMeta.${id}.sidebarLabel`}>{page.sidebarLabel}</Translate>
    ) : (
      <Translate id={`docMeta.${id}.title`}>{page.title}</Translate>
    ));

  return <Link to={page.href}>{text}</Link>;
}
