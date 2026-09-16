import { existsSync } from "node:fs";
import path from "node:path";
import { requireLocalImageSrc, type ImageConnection } from "@/lib/images";

/**
 * `requireLocalImageSrc` に加えて、差し替えた先の画像が `public/` に実際にあるかも確かめる。
 * 管理画面で画像を差し替えてもリポジトリへのコピーを忘れると、画像が切れたまま公開されるため、ビルドを止める。
 *
 * ファイルを読むので、ビルド時のデータ取得（`lib/queries/`）からだけ呼ぶ。`lib/images.ts` と分けたのは、
 * 画面側の部品から images.ts を読んでも `node:fs` がブラウザ向けに混ざらないようにするため。
 * 画像がまだリポジトリに無い種類（店舗・TOPのランチ）に使うとビルドが通らないので、そのページを作るときに切り替える。
 */
export function requireExistingLocalImageSrc(
  image: ImageConnection | null,
  imageDir: string,
  label: string
): string {
  const src = requireLocalImageSrc(image, imageDir, label);
  // next build はアプリのディレクトリで動くので、cwd の public/ が配信元になる
  const filePath = path.join(process.cwd(), "public", src);

  // Macのディスクは大文字小文字を区別しないので、ファイル名の大文字小文字違いはここでは検出できない（Vercelでは404になる）
  if (!existsSync(filePath)) {
    throw new Error(
      `${label}の画像 public${src} がありません。WordPressと同じファイル名で置いてください`
    );
  }

  return src;
}
