import useBaseUrl from '@docusaurus/useBaseUrl';

export default function DocImage({src, ...props}) {
  const resolvedSrc = src?.startsWith('/') ? useBaseUrl(src) : src;
  return <img src={resolvedSrc} {...props} />;
}
