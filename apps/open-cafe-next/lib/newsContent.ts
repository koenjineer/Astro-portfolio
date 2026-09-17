/**
 * WordPressが組み立てたお知らせ本文のHTMLを、公開先でそのまま出せる形に直す。
 *
 * WordPressはユーザーのMac内にしかないので、本文に埋め込まれた `open-cafe-cms.local` の画像は
 * 閲覧者から見えない。`lib/images.ts` と同じ考え方で、「どの記事にどの画像か」だけをWordPressに持たせ、
 * 画像の実体はリポジトリの `public/images/news/` から配る。
 */

/** 置き換え先。アイキャッチと同じ場所に置く（`lib/queries/news.ts` の NEWS_THUMBNAIL_DIR と揃える） */
const CONTENT_IMAGE_DIR = "/images/news";

// WordPressのアップロード先。ホスト名は環境で変わりうるので、`/wp-content/uploads/` から後ろだけを見る。
// 年月のフォルダ（2026/09/）は最後のスラッシュまで貪欲に読み飛ばし、ファイル名だけを取り出す
const UPLOAD_URL_PATTERN =
  /https?:\/\/[^"'\s]*?\/wp-content\/uploads\/(?:[^"'\s]*\/)?([^"'\s/]+)/g;

// WordPressが自動で作るサイズ違い（img_firstview_concept-1024x372.webp）。原本の1枚に寄せる
const SIZE_SUFFIX_PATTERN = /-\d+x\d+(\.[A-Za-z0-9]+)$/;

// 置き換え後は1枚しか指さないので、サイズ違いの候補一覧は不要になる
const SRCSET_OR_SIZES_PATTERN = /\s(?:srcset|sizes)="[^"]*"/g;

// `<p>本文<br><br>引用元：<a …>…</a></p>` の後ろ半分（Figmaのquoteは本文と引用元が別の行）。
// 閉じタグまで飲み込んで、空の `<p></p>` が残らないようにする
const CITE_PATTERN = /(?:<br\s*\/?>\s*){1,2}(引用元[：:][\s\S]*?)<\/p>/;

function toLocalImageSrc(fileName: string): string {
  return `${CONTENT_IMAGE_DIR}/${fileName.replace(SIZE_SUFFIX_PATTERN, "$1")}`;
}

/**
 * 引用元の行を `<footer>` に出し、Figmaどおり本文と分けて右端に寄せられるようにする。
 * WordPressの引用ブロックは本文と引用元を1つの `<p>` に `<br><br>` で入れるため、
 * CSSだけでは後ろ半分だけを小さく・右寄せにできない。
 * `<footer>` はHTMLの仕様が引用元の置き場所として挙げているタグなので、クラスを足さずにCSSから狙える
 * （管理画面で足されるブロックにクラスは付けられない。`/rules/nextjs-static-export.md`）
 */
function splitQuoteCitation(html: string): string {
  return html.replace(
    /<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/g,
    (blockquote) =>
      blockquote.replace(CITE_PATTERN, (_match, citation: string) => {
        // 引用元の末尾に残る <br> は、行が増えて見えるので落とす
        const cleaned = citation.replace(/(?:<br\s*\/?>\s*)+$/, "");

        return `</p><footer>${cleaned}</footer>`;
      })
  );
}

/**
 * 本文HTMLを、リポジトリ内の画像を指す形に直して返す。
 *
 * @throws 置き換えられないWordPressのURLが残った場合。画像が切れたまま公開されるのを防ぐためビルドを止める
 */
export function toLocalContentHtml(html: string, slug: string): string {
  const localized = splitQuoteCitation(html)
    .replace(SRCSET_OR_SIZES_PATTERN, "")
    // width/height はサイズ違いの値（例 1024×372）のまま残す。原本（1032×375）と縦横比が同じで、
    // ブラウザが場所を取っておくのに使うだけなので、実寸を調べ直す必要がない
    .replace(UPLOAD_URL_PATTERN, (_match, fileName: string) =>
      toLocalImageSrc(fileName)
    );

  if (localized.includes("/wp-content/")) {
    throw new Error(
      `お知らせ（slug: ${slug}）の本文に、置き換えられなかったWordPressのURLが残っています`
    );
  }

  return localized;
}

// WordPressの抜粋に付く「 [&hellip;]」（本文を途中で切ったしるし）。見た目の省略は CSS の line-clamp が付けるので落とす
const EXCERPT_MORE_PATTERN = /\s*\[(?:&hellip;|&#8230;|…)\]\s*$/;

// 抜粋に出てくる文字参照。WordPressの wptexturize が作るものに絞る
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
};

/**
 * WordPressの抜粋（`<p>…本文の冒頭… [&hellip;]</p>`）を、画面にそのまま出せる1行の文字列にする。
 * TOPのお知らせの大きいカードだけが使う（Figma: card-news-large-pc）
 */
export function toPlainExcerpt(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .trim()
    .replace(EXCERPT_MORE_PATTERN, "")
    .replace(/&[#a-z0-9]+;/gi, (entity) => HTML_ENTITIES[entity] ?? entity);
}
