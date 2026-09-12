# Tailwind CSS v4 の書き方と罠

`global-standard-next`・`minami-dental-next`（ともにTailwind CSS v4）で**2案件とも踏んだ**ものだけを書く。

## `transition` の対象は、角括弧で囲むと変わる

Tailwind v4の `translate-x-*` / `scale-*` は `transform` ではなく
`translate` / `scale` プロパティに書き出す。ただし**クラス名の `transition-transform` は
`transform, translate, scale, rotate` をまとめて対象にする**ので、角括弧なしなら動く。

- `transition-transform` … 動く
- `transition-[transform]` … **動かない**（`translate` / `scale` が外れる）
- `transition-[color,transform]` … **動かない**。`transition-[color,translate]` にする

**同じ要素で色と動きを両方変えるなら、1つのクラスにまとめる。**
`transition-colors` と `transition-transform` を並べると、どちらも同じ
`transition-property` を上書きするので**後に来た方しか効かない**。

動きには `motion-reduce:transition-none` を添える（`/rules/design-to-code.md`）。

## `--color-base`（白）はトークンに登録しない

`@theme` に `--color-base` を足すと文字色の `text-base` が生成され、
**文字サイズ16pxを指す既存の `text-base` と名前が衝突**して意味が判別できなくなる。
白は `text-white` / `bg-white` を使う。

デザイン側の変数名をそのままトークン名にする運用だと必ず踏むので、白だけは登録しない。
