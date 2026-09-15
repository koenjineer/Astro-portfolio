/**
 * WPGraphQLの画像の形。アイキャッチ（`featuredImage`）もACFの画像欄（`image`）も
 * `{ node: { sourceUrl } }` の入れ子で返り、未設定だと null になる
 */
export interface ImageConnection {
  node: { sourceUrl: string };
}

/**
 * WordPressの画像URLからファイル名だけを取り出し、リポジトリ内の画像を指すパスに置き換える。
 * WordPressはユーザーのMac内にしかなく、書き出した静的サイトの閲覧者からは
 * `open-cafe-cms.local` の画像に到達できないため、
 * 「どの記事にどの画像か」だけをWordPressに持たせ、画像の実体はリポジトリから配る。
 *
 * @param imageDir `public/` からの画像ディレクトリ（例: `/images/news`）
 * @returns 画像が無ければ null
 */
export function toLocalImageSrc(
  image: ImageConnection | null,
  imageDir: string
): string | null {
  const fileName = image?.node.sourceUrl.split("/").pop();

  return fileName ? `${imageDir}/${fileName}` : null;
}

/**
 * `toLocalImageSrc` の、画像が無いことを許さない版。全件に画像がある前提の種類で
 * 未設定のまま書き出さず、ビルドを止めて気づかせる。
 *
 * @param label エラーメッセージで対象を特定するための名前（例: `ギフト（いちごマカロンギフト）`）
 */
export function requireLocalImageSrc(
  image: ImageConnection | null,
  imageDir: string,
  label: string
): string {
  const src = toLocalImageSrc(image, imageDir);

  if (!src) {
    throw new Error(`${label}に画像が設定されていません`);
  }

  return src;
}
