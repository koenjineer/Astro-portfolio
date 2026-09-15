// スクリプトと、Next.jsがページ移動を読み上げるための要素は、画面の操作と関係ないので触らない
const UNTOUCHED_TAG_NAMES = new Set(["SCRIPT", "NEXT-ROUTE-ANNOUNCER"]);

/**
 * ドロワーを開いている間、ドロワー以外のすべてに inert を付け、Tabキーや読み上げソフトで裏のページへ移れないようにする。
 * 戻り値の関数で、付けた分だけ外す。
 *
 * ドロワーは写真の右上（ページ本文の中）に置いているので、body直下だけを inert にすると本文ごと
 * ドロワーまで操作できなくなる。そこでドロワーから body まで親をたどり、各階層の「兄弟」だけに付ける。
 * <dialog> の showModal() を使わないのは、閉じるときの右へ抜ける動きを付けられないため
 */
export function makeOutsideDrawerInert(drawer: HTMLElement): () => void {
  const inertedElements: HTMLElement[] = [];

  let current = drawer;
  while (current !== document.body && current.parentElement) {
    for (const sibling of Array.from(current.parentElement.children)) {
      if (
        sibling === current ||
        !(sibling instanceof HTMLElement) ||
        UNTOUCHED_TAG_NAMES.has(sibling.tagName) ||
        // 元から inert の要素は、閉じたときに外してしまわないよう対象にしない
        sibling.inert
      ) {
        continue;
      }
      sibling.inert = true;
      inertedElements.push(sibling);
    }
    current = current.parentElement;
  }

  return () => {
    for (const element of inertedElements) element.inert = false;
  };
}
