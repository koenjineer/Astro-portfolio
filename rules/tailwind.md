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

## 行の高さは、文字サイズと一緒に書く（親の `leading-*` は子に届かない）

Tailwind v4 の `text-xs` / `text-sm` / `text-2xl` などは、文字サイズと同時に
`line-height: var(--tw-leading, <その文字サイズの既定値>)` を書き出す。
`--tw-leading` は **`inherits: false`** で登録されているので、親に付けた `leading-[1.5]` は子に引き継がれず、
**子に文字サイズのクラスがあると、その既定の行の高さに戻る**（`text-xs` なら約1.33）。

```tsx
// ✕ 子の行の高さが1.5にならない
<h2 className="leading-[1.5]"><span className="text-xs">アクセス</span></h2>
// ○ 文字サイズと行の高さを同じクラスで書く
<h2><span className="text-xs/[1.5]">アクセス</span></h2>
```

- 見た目の差は1行あたり数px なので目視では気づきにくい。**Figmaとの高さの差が端数で残ったら、まずこれを疑う**
- `text-[40px]` のような角括弧の文字サイズは行の高さを書き出さないので親の値が効くが、混在すると見分けにくい。
  **行の高さを指定したい要素には、角括弧の有無にかかわらず `/[1.5]` の形で書く**
- `<small>` などブラウザが文字サイズを変えるタグに `text-xs` を付けたときも同じ

## `--color-base`（白）はトークンに登録しない

`@theme` に `--color-base` を足すと文字色の `text-base` が生成され、
**文字サイズ16pxを指す既存の `text-base` と名前が衝突**して意味が判別できなくなる。
白は `text-white` / `bg-white` を使う。

デザイン側の変数名をそのままトークン名にする運用だと必ず踏むので、白だけは登録しない。
