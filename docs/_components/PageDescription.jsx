import React from 'react';
import Translate from '@docusaurus/Translate';
import {getPage} from '@site/docs/_data/pages';

/**
 * Shared page description from the catalog.
 *
 * @param {{ id: string }} props
 */
export default function PageDescription({id}) {
  const page = getPage(id);
  return (
    <Translate id={`docMeta.${id}.description`}>{page.description}</Translate>
  );
}
