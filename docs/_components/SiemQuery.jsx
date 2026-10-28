import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Translate from '@docusaurus/Translate';
import {siemPlatforms, siemQueries} from '@site/docs/_data/siemQueries';

/**
 * One SIEM sample in Microsoft Sentinel, Splunk, Elastic, and Event Viewer tabs.
 * Tabs share groupId `siem` so the whole page stays on one platform.
 *
 * @param {{ id: string }} props
 */
export default function SiemQuery({id}) {
  const query = siemQueries[id];
  if (!query) {
    throw new Error(`Unknown SIEM query id: ${id}`);
  }

  return (
    <Tabs groupId="siem" queryString>
      {siemPlatforms.map((platform) => (
        <TabItem key={platform.id} value={platform.id} label={platform.label}>
          {platform.id === 'splunk' ? (
            <p>
              <Translate id="siem.splunk.indexHint">
                Change `index=wineventlog` to your Splunk index.
              </Translate>
            </p>
          ) : null}
          {platform.id === 'elastic' ? (
            <p>
              <Translate id="siem.elastic.dataStreamHint">
                Change `FROM logs-*` to your Elastic data stream.
              </Translate>
            </p>
          ) : null}
          {platform.id === 'wevtutil' && query.wevtutilListsOnly ? (
            <p>
              <Translate id="siem.wevtutil.listsOnly">
                Event Viewer lists matching events. It does not count or group them.
              </Translate>
            </p>
          ) : null}
          <CodeBlock language={platform.language}>{query[platform.id]}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}
