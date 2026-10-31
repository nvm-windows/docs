import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import {mergeSearchStrings, useHistorySelector} from '@docusaurus/theme-common';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import IconLanguage from '@theme/Icon/Language';

import aiTranslatedLabels from './aiTranslatedLabels';
import styles from './styles.module.css';

function useLocaleDropdownUtils() {
  const {
    siteConfig,
    i18n: {localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  const getLocaleConfig = (locale) => {
    const localeConfig = localeConfigs[locale];
    if (!localeConfig) {
      throw new Error(
        `Docusaurus bug, no locale config found for locale=${locale}`,
      );
    }
    return localeConfig;
  };

  const getBaseURLForLocale = (locale) => {
    const localeConfig = getLocaleConfig(locale);
    const isSameDomain = localeConfig.url === siteConfig.url;
    if (isSameDomain) {
      return `pathname://${alternatePageUtils.createUrl({
        locale,
        fullyQualified: false,
      })}`;
    }
    return alternatePageUtils.createUrl({
      locale,
      fullyQualified: true,
    });
  };

  return {
    getURL: (locale, options) => {
      const finalSearch = mergeSearchStrings(
        [search, options.queryString],
        'append',
      );
      return `${getBaseURLForLocale(locale)}${finalSearch}${hash}`;
    },
    getLang: (locale) => getLocaleConfig(locale).htmlLang,
  };
}

/**
 * Non-source locales are machine translations. The source locale is
 * `i18n.defaultLocale`, so a new locale in the config gets this tag
 * without a per-page edit.
 */
function LocaleLabel({locale}) {
  const {
    i18n: {defaultLocale, localeConfigs},
  } = useDocusaurusContext();
  const name = localeConfigs[locale].label;

  if (locale === defaultLocale) {
    return name;
  }

  const aiLabel = aiTranslatedLabels[locale];

  return (
    <span className={styles.localeLabel}>
      {name}
      {aiLabel ? <span className={styles.aiTag}>{aiLabel}</span> : null}
    </span>
  );
}

export default function LocaleDropdownNavbarItem({
  mobile,
  dropdownItemsBefore,
  dropdownItemsAfter,
  queryString,
  ...props
}) {
  const utils = useLocaleDropdownUtils();
  const {
    i18n: {currentLocale, locales, defaultLocale, localeConfigs},
  } = useDocusaurusContext();

  const localeItems = locales.map((locale) => {
    return {
      label: <LocaleLabel locale={locale} />,
      lang: utils.getLang(locale),
      to: utils.getURL(locale, {queryString}),
      target: '_self',
      autoAddBaseUrl: false,
      className:
        locale === currentLocale
          ? mobile
            ? 'menu__link--active'
            : 'dropdown__link--active'
          : '',
    };
  });

  const items = [...dropdownItemsBefore, ...localeItems, ...dropdownItemsAfter];

  const dropdownLabel = mobile
    ? translate({
        message: 'Languages',
        id: 'theme.navbar.mobileLanguageDropdown.label',
        description: 'The label for the mobile language switcher dropdown',
      })
    : localeConfigs[currentLocale].label;

  const showTagOnButton = !mobile && currentLocale !== defaultLocale;

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={
        <>
          <IconLanguage className={styles.iconLanguage} />
          {showTagOnButton ? (
            <LocaleLabel locale={currentLocale} />
          ) : (
            dropdownLabel
          )}
        </>
      }
      items={items}
    />
  );
}
