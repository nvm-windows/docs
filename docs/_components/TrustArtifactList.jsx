import React from 'react';
import Translate from '@docusaurus/Translate';
import {trustArtifactItems} from '@site/docs/_data/pages';

function ArtifactName({item}) {
  return (
    <Translate id={`docMeta.trustArtifacts.item.${item.id}.name`}>
      {item.name}
    </Translate>
  );
}

function ArtifactSummary({item}) {
  return (
    <Translate id={`docMeta.trustArtifacts.item.${item.id}.summary`}>
      {item.summary}
    </Translate>
  );
}

function InlineList() {
  const names = trustArtifactItems.map((item) => (
    <ArtifactName key={item.id} item={item} />
  ));
  if (names.length === 0) {
    return null;
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return (
      <>
        {names[0]}
        {' and '}
        {names[1]}
      </>
    );
  }
  return (
    <>
      {names.slice(0, -1).map((name, index) => (
        <React.Fragment key={trustArtifactItems[index].id}>
          {name}
          {', '}
        </React.Fragment>
      ))}
      {'and '}
      {names[names.length - 1]}
    </>
  );
}

function TableList() {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <Translate id="docMeta.trustArtifacts.table.artifact">
              Artifact
            </Translate>
          </th>
          <th>
            <Translate id="docMeta.trustArtifacts.table.what">
              What it is
            </Translate>
          </th>
        </tr>
      </thead>
      <tbody>
        {trustArtifactItems.map((item) => (
          <tr key={item.id}>
            <td>
              <ArtifactName item={item} />
            </td>
            <td>
              <ArtifactSummary item={item} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BulletList() {
  return (
    <ul>
      {trustArtifactItems.map((item) => (
        <li key={item.id}>
          <ArtifactName item={item} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Canonical Trust Artifacts contents. `format`: `table` | `inline` | `bullets`.
 *
 * @param {{ format?: 'table' | 'inline' | 'bullets' }} props
 */
export default function TrustArtifactList({format = 'table'}) {
  if (format === 'inline') {
    return <InlineList />;
  }
  if (format === 'bullets') {
    return <BulletList />;
  }
  return <TableList />;
}
