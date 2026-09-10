/**
 * SPメニューを開いている間も操作できるままにする要素の印（SP固定バーに付ける）。
 * Figmaではメニューの上にSP固定バーが残るため、ヘッダー以外ではこれだけ inert にしない
 */
export const SP_MENU_KEEP_ACTIVE_ATTRIBUTE = "data-sp-menu-keep-active";

// スクリプトと、Next.jsがページ移動を読み上げるための要素は、画面の操作と関係ないので触らない
const UNTOUCHED_TAG_NAMES = new Set(["SCRIPT", "NEXT-ROUTE-ANNOUNCER"]);

/**
 * SPメニューを開いている間、ヘッダーとSP固定バー以外（本文・フッター・固定ボタン）に inert を付け、
 * Tabキーや読み上げソフトで裏のページへ移れないようにする。戻り値の関数で、付けた分だけ外す。
 * <dialog> の showModal() は最前面の層に出てSP固定バーまで覆ってしまい、Figmaと合わないので使わない
 */
export function makeOutsideSpMenuInert(header: HTMLElement): () => void {
  const inertedElements = Array.from(document.body.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement &&
      !element.contains(header) &&
      !element.hasAttribute(SP_MENU_KEEP_ACTIVE_ATTRIBUTE) &&
      !UNTOUCHED_TAG_NAMES.has(element.tagName) &&
      // 元から inert の要素は、閉じたときに外してしまわないよう対象にしない
      !element.inert,
  );

  for (const element of inertedElements) element.inert = true;

  return () => {
    for (const element of inertedElements) element.inert = false;
  };
}
