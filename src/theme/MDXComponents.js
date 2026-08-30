import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import useBaseUrl from '@docusaurus/useBaseUrl';

const MDXImg = MDXComponents.img;

function Img({src, ...props}) {
  const resolvedSrc = src?.startsWith('/') ? useBaseUrl(src) : src;
  return <MDXImg src={resolvedSrc} {...props} />;
}

export default {
  ...MDXComponents,
  img: Img,
};
