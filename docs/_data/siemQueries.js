/**
 * SIEM copy/paste samples for NVM for Windows/Operational.
 *
 * Field names follow common Windows Event Log collectors.
 * Collectors flatten EventData differently. If a field is missing, open one
 * event and use the names your platform created.
 */

export const CHANNEL = 'NVM for Windows/Operational';

/** @typedef {{ id: string, label: string, language: string }} SiemPlatform */

/** @type {SiemPlatform[]} */
export const siemPlatforms = [
  {id: 'sentinel', label: 'Microsoft Sentinel', language: 'kusto'},
  {id: 'splunk', label: 'Splunk', language: 'text'},
  {id: 'elastic', label: 'Elastic', language: 'sql'},
  {id: 'wevtutil', label: 'Event Viewer', language: 'powershell'},
];

/**
 * @typedef {{
 *   sentinel: string,
 *   splunk: string,
 *   elastic: string,
 *   wevtutil: string,
 *   wevtutilListsOnly?: boolean,
 * }} SiemQuerySet
 */

/** @type {Record<string, SiemQuerySet>} */
export const siemQueries = {
  nvmCode: {
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventData.Code == 4312`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventData.Code=4312`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_data.Code == 4312`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[EventData[Data[@Name='Code']='4312']]" /f:text /c:20`,
  },
  versionsInUse: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 200
| summarize Launches = count() by tostring(EventData.NodeVersion), Computer
| order by Launches desc`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=200
| stats count as Launches by EventData.NodeVersion, Computer
| sort -Launches`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 200
| STATS Launches = COUNT(*) BY version = winlog.event_data.NodeVersion, host = winlog.computer_name
| SORT Launches DESC`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=200)]]" /f:text /c:20`,
  },
  nodejsExecuted: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.EventName == "nodejs.executed"
| extend Payload = parse_json(tostring(EventData.Payload))
| summarize Launches = dcount(Computer) by tostring(EventData.EventName)`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nodejs.executed"
| stats dc(Computer) as Hosts`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nodejs.executed"
| STATS Hosts = COUNT_DISTINCT(winlog.computer_name)`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nodejs.executed']]" /f:text /c:20`,
  },
  installedVersions: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.EventName == "nvm.system.changed"
| extend Payload = parse_json(tostring(EventData.Payload))
| where Payload.Action == "install"
| where Payload.Outcome == "Succeeded"
| summarize Installs = count() by tostring(Payload.NodeVersion), tostring(Payload.User), tostring(Payload.hostname)`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nvm.system.changed"
| eval action=json_extract('EventData.Payload',"Action"), outcome=json_extract('EventData.Payload',"Outcome"), node_version=json_extract('EventData.Payload',"NodeVersion"), user=json_extract('EventData.Payload',"User"), hostname=json_extract('EventData.Payload',"hostname")
| search action=install outcome=Succeeded
| stats count as Installs by node_version, user, hostname`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nvm.system.changed" AND winlog.event_data.Payload LIKE "*\\"Action\\":\\"install\\"*" AND winlog.event_data.Payload LIKE "*\\"Outcome\\":\\"Succeeded\\"*"
| STATS Installs = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nvm.system.changed']]" /f:text /c:20`,
  },
  installedNode20: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| extend Payload = parse_json(tostring(EventData.Payload))
| where EventData.EventName == "nvm.system.changed"
| where Payload.Action == "install"
| where Payload.Outcome == "Succeeded"
| where tostring(Payload.NodeVersion) startswith "20."
| summarize People = dcount(tostring(Payload.User))`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nvm.system.changed"
| eval action=json_extract('EventData.Payload',"Action"), outcome=json_extract('EventData.Payload',"Outcome"), node_version=json_extract('EventData.Payload',"NodeVersion"), user=json_extract('EventData.Payload',"User")
| search action=install outcome=Succeeded
| search node_version="20.*"
| stats dc(user) as People`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nvm.system.changed" AND winlog.event_data.Payload LIKE "*\\"Action\\":\\"install\\"*" AND winlog.event_data.Payload LIKE "*\\"Outcome\\":\\"Succeeded\\"*" AND winlog.event_data.Payload LIKE "*\\"NodeVersion\\":\\"20.*"
| STATS People = COUNT_DISTINCT(winlog.computer_name)`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nvm.system.changed']]" /f:text /c:20`,
  },
  uninstalledVersions: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.EventName == "nvm.system.changed"
| extend Payload = parse_json(tostring(EventData.Payload))
| where Payload.Action == "uninstall"
| where Payload.Outcome == "Succeeded"
| summarize Uninstalls = count() by tostring(Payload.NodeVersion), tostring(Payload.User), tostring(Payload.hostname)`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nvm.system.changed"
| eval action=json_extract('EventData.Payload',"Action"), outcome=json_extract('EventData.Payload',"Outcome"), node_version=json_extract('EventData.Payload',"NodeVersion"), user=json_extract('EventData.Payload',"User"), hostname=json_extract('EventData.Payload',"hostname")
| search action=uninstall outcome=Succeeded
| stats count as Uninstalls by node_version, user, hostname`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nvm.system.changed" AND winlog.event_data.Payload LIKE "*\\"Action\\":\\"uninstall\\"*" AND winlog.event_data.Payload LIKE "*\\"Outcome\\":\\"Succeeded\\"*"
| STATS Uninstalls = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nvm.system.changed']]" /f:text /c:20`,
  },
  versionActivated: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.EventName == "nvm.version.activated"
| extend Payload = parse_json(tostring(EventData.Payload))
| summarize Activations = count() by tostring(Payload.version), tostring(Payload.user), tostring(Payload.hostname)`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nvm.version.activated"
| eval version=json_extract('EventData.Payload',"version"), user=json_extract('EventData.Payload',"user"), hostname=json_extract('EventData.Payload',"hostname")
| stats count as Activations by version, user, hostname`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nvm.version.activated"
| STATS Activations = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nvm.version.activated']]" /f:text /c:20`,
  },
  packageManagerInstall: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID in (120, 122)
| where EventData.EventName == "package_manager.install"
| summarize Events = count() by Computer, EventData.Code`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode IN (120,122) EventData.EventName="package_manager.install"
| stats count as Events by Computer, EventData.Code`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id IN (120, 122) AND winlog.event_data.EventName == "package_manager.install"
| STATS Events = COUNT(*) BY host = winlog.computer_name, code = winlog.event_data.Code`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120 or EventID=122)] and EventData[Data[@Name='EventName']='package_manager.install']]" /f:text /c:20`,
  },
  malwareBlocks: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.Code == 4602
| where EventData.EventName == "malware.package_blocked"
| summarize Blocks = count() by Computer`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.Code=4602 EventData.EventName="malware.package_blocked"
| stats count as Blocks by Computer`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.Code == 4602 AND winlog.event_data.EventName == "malware.package_blocked"
| STATS Blocks = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='Code']='4602'] and EventData[Data[@Name='EventName']='malware.package_blocked']]" /f:text /c:20`,
  },
  integrityFailures: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventData.Code in (4301, 4314)
| summarize Failures = count() by Computer, EventID, EventData.EventName, EventData.Code`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventData.Code IN (4301,4314)
| stats count as Failures by Computer, EventCode, EventData.EventName, EventData.Code`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_data.Code IN (4301, 4314)
| STATS Failures = COUNT(*) BY host = winlog.computer_name, event_id = winlog.event_id, name = winlog.event_data.EventName, code = winlog.event_data.Code`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[EventData[Data[@Name='Code']='4301' or Data[@Name='Code']='4314']]" /f:text /c:20`,
  },
  versionFirewall: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventData.Code == 4411
| where EventData.EventName == "node.security.version_firewall_blocked"
| summarize Blocks = count() by Computer`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventData.Code=4411 EventData.EventName="node.security.version_firewall_blocked"
| stats count as Blocks by Computer`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_data.Code == 4411 AND winlog.event_data.EventName == "node.security.version_firewall_blocked"
| STATS Blocks = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[EventData[Data[@Name='Code']='4411'] and EventData[Data[@Name='EventName']='node.security.version_firewall_blocked']]" /f:text /c:20`,
  },
  configurationChanges: {
    wevtutilListsOnly: true,
    sentinel: `Event
| where EventLog == "${CHANNEL}"
| where EventID == 120
| where EventData.EventName == "nvm.configuration.changed"
| extend Payload = parse_json(tostring(EventData.Payload))
| summarize Changes = count() by tostring(Payload.Configuration), tostring(Payload.User), tostring(Payload.hostname)`,
    splunk: `index=wineventlog Channel="${CHANNEL}" EventCode=120 EventData.EventName="nvm.configuration.changed"
| eval configuration=json_extract('EventData.Payload',"Configuration"), user=json_extract('EventData.Payload',"User"), hostname=json_extract('EventData.Payload',"hostname")
| stats count as Changes by configuration, user, hostname`,
    elastic: `FROM logs-*
| WHERE winlog.channel == "${CHANNEL}" AND winlog.event_id == 120 AND winlog.event_data.EventName == "nvm.configuration.changed"
| STATS Changes = COUNT(*) BY host = winlog.computer_name`,
    wevtutil: `wevtutil qe "${CHANNEL}" /q:"*[System[(EventID=120)] and EventData[Data[@Name='EventName']='nvm.configuration.changed']]" /f:text /c:20`,
  },
};
