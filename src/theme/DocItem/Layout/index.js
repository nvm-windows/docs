import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

/** @typedef {{ edition: string | null, comment: string | null }} CertifiedBanner */

const CERTIFIED_EDITIONS = ['Governance', 'Audit', 'Trust', 'Trust Artifacts'];

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function normalizeEdition(value) {
  if (value == null || value === '') {
    return null;
  }

  const text = String(value).trim();
  const match = CERTIFIED_EDITIONS.find(
    (edition) => edition.toLowerCase() === text.toLowerCase(),
  );

  return match ?? null;
}

/**
 * @param {unknown} tag
 * @returns {string}
 */
function tagText(tag) {
  if (typeof tag === 'string') {
    return tag;
  }

  return String(tag?.label ?? tag?.value ?? '');
}

/**
 * @param {import('@docusaurus/plugin-content-docs').FrontMatter} frontMatter
 * @param {import('@docusaurus/plugin-content-docs').FrontMatter['tags']} tags
 * @returns {CertifiedBanner | null}
 */
function parseCertifiedBanner(frontMatter, tags) {
  let edition = null;
  let comment = null;
  let show = false;

  const certified = frontMatter.certified;

  if (certified === true) {
    show = true;
  } else if (typeof certified === 'string') {
    const normalized = normalizeEdition(certified);
    if (normalized) {
      show = true;
      edition = normalized;
    } else if (certified.toLowerCase() === 'true') {
      show = true;
    }
  } else if (certified && typeof certified === 'object') {
    show = true;
    edition = normalizeEdition(
      certified.edition ?? certified.build ?? certified.flavor,
    );
    comment = certified.comment ?? certified.note ?? null;
  }

  for (const tag of tags) {
    const raw = tagText(tag).trim();
    if (!raw) {
      continue;
    }

    const lower = raw.toLowerCase();

    if (lower === 'certified') {
      show = true;
      continue;
    }

    const prefixed = lower.match(/^certified[:/](.+)$/);
    if (prefixed) {
      show = true;
      edition = normalizeEdition(prefixed[1]) ?? edition;
      continue;
    }

    const fromTag = normalizeEdition(raw);
    if (fromTag) {
      show = true;
      edition = fromTag;
    }
  }

  if (frontMatter.certified_comment && !comment) {
    comment = String(frontMatter.certified_comment);
  }

  if (!show) {
    return null;
  }

  return {edition, comment};
}

export default function LayoutWrapper(props) {
  const {frontMatter} = useDoc();
  const tags = frontMatter.tags ?? [];
  const banner = parseCertifiedBanner(frontMatter, tags);

  return (
    <>
      {banner && (
        <div className={styles.proBanner} role="note">
          <div className={styles.proBannerMain}>
            <span className={styles.proBadge}>Certified Build</span>
            <span className={styles.proBannerText}>
              {banner.edition ? (
                <>
                  Requires the <strong>{banner.edition.toLowerCase()}</strong> package.
                </>
              ) : (
                <>
                  Available for <strong>certified builds</strong>.
                </>
              )}
            </span>
          </div>
          {banner.comment && (
            <p className={styles.proBannerComment}>{banner.comment}</p>
          )}
        </div>
      )}
      <Layout {...props} />
    </>
  );
}
