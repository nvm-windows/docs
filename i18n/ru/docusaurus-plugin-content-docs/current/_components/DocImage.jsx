import useBaseUrl from '@docusaurus/useBaseUrl';
import MDXImg from '@theme/MDXComponents/Img';

export default function DocImage({src, ...props}) {
  const baseUrlSrc = useBaseUrl(src ?? '');
  const resolvedSrc = src?.startsWith('/') ? baseUrlSrc : src;
  return <MDXImg src={resolvedSrc} {...props} />;
}
