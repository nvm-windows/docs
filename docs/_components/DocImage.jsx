import useBaseUrl from '@docusaurus/useBaseUrl';
import MDXImg from '@theme/MDXComponents/Img';

export default function DocImage({src, ...props}) {
  const resolvedSrc = src?.startsWith('/') ? useBaseUrl(src) : src;
  return <MDXImg src={resolvedSrc} {...props} />;
}
