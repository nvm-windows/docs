import React, {useEffect, useState} from 'react';
import Translate from '@docusaurus/Translate';

import styles from './WingetStatus.module.css';

const PACKAGE_ID = 'AuthorSoftware.NVMWindows';
const RELEASES_URL = 'https://api.github.com/repos/nvm-windows/nvm/releases/latest';
const WINGET_CONTENTS_URL =
  'https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/a/AuthorSoftware/NVMWindows';
const OPEN_PR_URL =
  'https://api.github.com/search/issues?q=' +
  encodeURIComponent(
    `repo:microsoft/winget-pkgs "${PACKAGE_ID}" is:pr is:open`,
  );

const CACHE_KEY = 'nvm-docs-winget-status-v1';
const CACHE_MS = 10 * 60 * 1000;

/**
 * @param {string} version
 * @returns {{nums: number[], pre: string | null}}
 */
function splitVersion(version) {
  const [core, pre] = String(version).replace(/^v/i, '').split('-');
  return {
    nums: core.split('.').map((part) => {
      const value = parseInt(part, 10);
      return Number.isFinite(value) ? value : 0;
    }),
    pre: pre ?? null,
  };
}

/**
 * @param {string} left
 * @param {string} right
 * @returns {number}
 */
function compareVersions(left, right) {
  const a = splitVersion(left);
  const b = splitVersion(right);
  const length = Math.max(a.nums.length, b.nums.length);

  for (let index = 0; index < length; index += 1) {
    const delta = (a.nums[index] ?? 0) - (b.nums[index] ?? 0);
    if (delta !== 0) {
      return delta;
    }
  }

  if (a.pre === b.pre) {
    return 0;
  }
  if (a.pre && !b.pre) {
    return -1;
  }
  if (!a.pre && b.pre) {
    return 1;
  }
  return a.pre < b.pre ? -1 : 1;
}

/**
 * @param {string} title
 * @returns {string | null}
 */
function versionFromPullRequestTitle(title) {
  const match = title.match(
    new RegExp(`${PACKAGE_ID.replaceAll('.', '\\.')} version (\\S+)`),
  );
  return match ? match[1].replace(/[.,;:]+$/, '') : null;
}

/**
 * @param {string} url
 * @returns {Promise<unknown | null>}
 */
async function fetchJson(url) {
  // No custom headers. A non-simple Accept value fails the GitHub CORS preflight.
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(String(response.status));
  }

  return response.json();
}

async function loadStatus() {
  const [releaseResult, wingetResult, pullRequestResult] = await Promise.all([
    fetchJson(RELEASES_URL),
    fetchJson(WINGET_CONTENTS_URL),
    fetchJson(OPEN_PR_URL),
  ]);

  const releaseTag = releaseResult?.tag_name
    ? String(releaseResult.tag_name).replace(/^v/i, '')
    : null;

  const publishedVersions = Array.isArray(wingetResult)
    ? wingetResult
        .filter((entry) => entry.type === 'dir' && /^\d+\.\d+/.test(entry.name))
        .map((entry) => entry.name)
    : [];
  publishedVersions.sort(compareVersions);
  const wingetVersion = publishedVersions.at(-1) ?? null;
  const wingetUrl = wingetVersion
    ? `https://github.com/microsoft/winget-pkgs/tree/master/manifests/a/AuthorSoftware/NVMWindows/${wingetVersion}`
    : null;

  const pendingCandidates = (pullRequestResult?.items ?? [])
    .filter((item) => String(item.title ?? '').includes(PACKAGE_ID))
    .map((item) => ({
      version: versionFromPullRequestTitle(String(item.title ?? '')),
      url: item.html_url,
    }))
    .filter((item) => item.version)
    .filter(
      (item) => !wingetVersion || compareVersions(item.version, wingetVersion) > 0,
    );
  pendingCandidates.sort((left, right) =>
    compareVersions(right.version, left.version),
  );

  const newestTracked = [wingetVersion, pendingCandidates[0]?.version]
    .filter(Boolean)
    .sort(compareVersions)
    .at(-1);

  return {
    release: releaseTag,
    releaseUrl: releaseResult?.html_url ?? 'https://github.com/nvm-windows/nvm/releases',
    winget: wingetVersion,
    wingetUrl,
    pending: pendingCandidates[0] ?? null,
    releaseAhead: Boolean(
      releaseTag && (!newestTracked || compareVersions(releaseTag, newestTracked) > 0),
    ),
  };
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const cached = JSON.parse(raw);
    if (!cached?.savedAt || Date.now() - cached.savedAt > CACHE_MS) {
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({savedAt: Date.now(), data}),
    );
  } catch {
    // Private mode can reject sessionStorage. The page still renders.
  }
}

export default function WingetStatus() {
  const [state, setState] = useState({status: 'loading', data: null});

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setState({status: 'ready', data: cached});
      return undefined;
    }

    let active = true;
    loadStatus()
      .then((data) => {
        writeCache(data);
        if (active) {
          setState({status: 'ready', data});
        }
      })
      .catch(() => {
        if (active) {
          setState({status: 'error', data: null});
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={styles.panel} aria-live="polite" data-winget-status={state.status}>
      {state.status === 'loading' && (
        <p className={styles.line}>
          <Translate id="wingetStatus.checking" description="Shown while release and winget versions load">
            Checking versions.
          </Translate>
        </p>
      )}
      {state.status === 'error' && (
        <p className={styles.line}>
          <Translate id="wingetStatus.unavailable" description="Shown when GitHub version lookups fail">
            Version check is unavailable.
          </Translate>
        </p>
      )}
      {state.status === 'ready' && state.data && (
        <dl className={styles.list}>
          <dt>
            <Translate id="wingetStatus.latestRelease" description="Label for the newest GitHub release">
              Latest release
            </Translate>
          </dt>
          <dd>
            {state.data.release ? (
              <a href={state.data.releaseUrl}>{state.data.release}</a>
            ) : (
              <Translate id="wingetStatus.unknown" description="Shown when a version cannot be read">
                Unknown
              </Translate>
            )}
          </dd>
          <dt>
            <Translate id="wingetStatus.latestWinget" description="Label for the newest merged winget manifest">
              Latest on winget
            </Translate>
          </dt>
          <dd>
            {state.data.winget ? (
              <a href={state.data.wingetUrl}>{state.data.winget}</a>
            ) : (
              <Translate id="wingetStatus.notPublished" description="Shown when the package has no merged winget manifest">
                Not published
              </Translate>
            )}
          </dd>
          {state.data.pending && (
            <>
              <dt>
                <Translate id="wingetStatus.pending" description="Label when a newer winget pull request is still open">
                  Pending approval
                </Translate>
              </dt>
              <dd>
                <a href={state.data.pending.url}>{state.data.pending.version}</a>
              </dd>
            </>
          )}
          {state.data.releaseAhead && (
            <>
              <dt>
                <Translate id="wingetStatus.notSubmittedLabel" description="Label when the latest release has no open winget pull request">
                  Not on winget
                </Translate>
              </dt>
              <dd>
                <Translate
                  id="wingetStatus.notSubmitted"
                  description="Shown when the latest release is newer than winget and no pull request is open"
                  values={{version: state.data.release}}>
                  {'{version} is not on winget yet.'}
                </Translate>
              </dd>
            </>
          )}
        </dl>
      )}
    </div>
  );
}
