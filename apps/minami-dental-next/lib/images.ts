/** WPGraphQLの `featuredImage` の形。アイキャッチ未設定の記事では null になる */
export interface FeaturedImageNode {
  node: { sourceUrl: string };
}

/**
 * WordPressの画像URLからファイル名だけを取り出し、リポジトリ内の画像を指すパスに置き換える。
 * WordPressはユーザーのMac内にしかなく、書き出した静的サイトの閲覧者からは
 * `minami-dental-cms.local` の画像に到達できないため、
 * 「どの記事にどの画像か」だけをWordPressに持たせ、画像の実体はリポジトリから配る。
 *
 * @param imageDir `public/` からの画像ディレクトリ（例: `/images/blog`）
 * @param fallbackSrc アイキャッチが無いときに返すパス
 */
export function toLocalImageSrc(
  featuredImage: FeaturedImageNode | null,
  imageDir: string,
  fallbackSrc: string
): string {
  const fileName = featuredImage?.node.sourceUrl.split("/").pop();

  return fileName ? `${imageDir}/${fileName}` : fallbackSrc;
}

/**
 * `toLocalImageSrc` の、代わりの画像を持たない版。ブログ・診療案内・スタッフは
 * 全件にアイキャッチがある前提のデザインで代わりの画像を用意していないため、
 * 未設定のまま書き出さず、ビルドを止めて気づかせる。
 *
 * @param label エラーメッセージで記事を特定するための名前（例: `ブログ（slug: blog-01）`）
 */
export function requireLocalImageSrc(
  featuredImage: FeaturedImageNode | null,
  imageDir: string,
  label: string
): string {
  const fileName = featuredImage?.node.sourceUrl.split("/").pop();

  if (!fileName) {
    throw new Error(`${label}にアイキャッチが設定されていません`);
  }

  return `${imageDir}/${fileName}`;
}
