import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Img({src, ...props}) {
  const resolvedSrc = src?.startsWith('/') ? useBaseUrl(src) : src;
  return <img src={resolvedSrc} {...props} />;
}

export default {
  ...MDXComponents,
  img: Img,
};
