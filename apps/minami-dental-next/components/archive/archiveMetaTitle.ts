import { SITE_NAME } from "@/lib/clinic";

/**
 * お知らせ・ブログの `<title>`。「記事名やカテゴリー名 | セクション名 | みなみ歯科」の順に並べる。
 * 並べ方をセクションごとに書くとずれるおそれがあるので、ここ1か所で決める
 * （セクション名はお知らせ・ブログ固有なので使う側から渡す）
 */
export function archiveMetaTitle(
  sectionTitle: string,
  ...leadingParts: string[]
): string {
  return [...leadingParts, sectionTitle, SITE_NAME].join(" | ");
}
