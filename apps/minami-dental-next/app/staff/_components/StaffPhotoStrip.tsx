import Image from "next/image";

// 書き出した写真の実寸（Figmaの PC 305×229 を2倍で書き出している）
const STRIP_IMAGE_WIDTH = 610;
const STRIP_IMAGE_HEIGHT = 458;
const STRIP_IMAGE_COUNT = 5;

const STRIP_IMAGE_SRCS = Array.from(
  { length: STRIP_IMAGE_COUNT },
  (_, index) => `/images/staff/strip-${String(index + 1).padStart(2, "0")}.webp`
);

/**
 * 同じ5枚を4周分並べ、半分（2周分）動いた所で先頭に戻すと継ぎ目なく流れ続ける。
 * 2周分だと、1周分（PC 1625px）動いた時点で右端が足りなくなり、1626px以上の画面（1920pxのモニターなど）で
 * 右に空白が出る。4周分なら、2周分動いても残りの2周分（PC 3250px）が画面を埋めるので、幅3250pxの画面まで途切れない
 */
const LOOP_COPIES = [0, 1, 2, 3];

/**
 * 院長のあいさつとスタッフ紹介の間の写真の帯。画面の端から端まで、ゆっくり流れ続ける（CSSだけで動かす）。
 * 写真は飾りで情報を持たないので、帯ごと読み上げの対象から外す。
 * 一時停止の操作は付けない（ユーザー判断）。動きを減らす設定の人には止めて表示する。
 *
 * 写真どうしの間（20px）は flex の gap ではなく各写真の右の余白で作る。
 * gap だと末尾に間が付かず、全体の半分の位置が2周分の長さとずれて、戻る瞬間に写真が跳ねるため。
 *
 * 止めて表示するときは、Figmaどおり3枚目を画面の横の中央に置く。ただし1周目の3枚目だと、広い画面では
 * 左端より左に写真が足りず左に空白が出るので、2周目の3枚目を中央に置く（左に1周分の写真が控える）。
 * 1周の長さは (写真＋間)×5 ＝ SP 220×5＝1100px / PC 325×5＝1625px。
 * 3枚目の中心は周の左端から「(写真＋間)×2＋写真の半分」＝ SP 540px / PC 802.5px。
 * よって2周目の3枚目は列の左端から SP 1100+540＝1640px / PC 1625+802.5＝2427.5px。
 * 列を左に（その値－画面幅の半分）ずらせば中央に来る（margin-left の % は画面幅＝帯の幅に対する割合）
 */
export function StaffPhotoStrip() {
  return (
    <div aria-hidden="true" className="overflow-hidden">
      <div className="flex w-max animate-staff-strip motion-reduce:ml-[calc(50%-1640px)] motion-reduce:animate-none lg:motion-reduce:ml-[calc(50%-2427.5px)]">
        {LOOP_COPIES.map((copy) =>
          STRIP_IMAGE_SRCS.map((src) => (
            <div key={`${copy}-${src}`} className="shrink-0 pr-5">
              <Image
                src={src}
                alt=""
                width={STRIP_IMAGE_WIDTH}
                height={STRIP_IMAGE_HEIGHT}
                loading="lazy"
                className="h-[151px] w-[200px] rounded-[20px] object-cover lg:h-[229px] lg:w-[305px]"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
