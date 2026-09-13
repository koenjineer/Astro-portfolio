# いずれ処理したいこと

すぐには着手しないが、いつかやりたい作業の置き場所。**着手するときは必ず現物を見直す**
（件数もPR番号も時間とともに変わる）。**終わったらこのファイルから消す**。完了ログにはしない。

最終更新：2026-09-13

---

## 優先度：高

### 依存パッケージの脆弱性に対応する

GitHubの **Security → Dependabot alerts** に未対応が**51件**（2026-09-13 時点。
critical 2 / high 27 / medium 15 / low 7）。`package.json` と `pnpm-lock.yaml` で
二重に数えられているので、実質は約半分。

- **ほぼ全部が `apps/astro-portfolio`**（Astro本体とビルド用の依存）。
  `apps/minami-dental-next` と `apps/global-standard-next` はほぼ無傷
- **実害は限定的**：内容の大半は「ビルドするときだけ動く道具」の脆弱性で、
  公開中のポートフォリオは書き出した静的ファイルを配信しているだけ。Astroは動いていない。
  criticalの1件も、細工した画像を自分のビルドに混ぜられる場合の話
- ただし**リポジトリは公開**していて、採用担当が見る可能性がある。放置し続ける理由はない

やること：**Astro本体を上げる**（下の `#67`）と大半がまとめて解決する見込み。
ただし **5.18.2 → 7.2.8 はメジャー2つ分**なので、上げたあとに次を確認する。

- `pnpm --dir apps/astro-portfolio build` が通る
- ポートフォリオ本体と `src/pages/mock_site/` の6サイトが壊れていない
  （実機のChromeで見る。プレビューペインだと画像が白く出て誤判断する）

---

## 優先度：中

### Dependabot のプルリクエスト6件を処理する

2026-09-10〜11から開いたまま。

| PR | 内容 |
|---|---|
| [#67](https://github.com/koenjineer/Astro-portfolio/pull/67) | astro 5.18.2 → 7.2.8 ／ **上の脆弱性対応と同じ作業。一緒に処理する** |
| [#60](https://github.com/koenjineer/Astro-portfolio/pull/60) | playwright 1.60.0 → 1.63.0 |
| [#59](https://github.com/koenjineer/Astro-portfolio/pull/59) | sharp 0.34.5 → 0.35.4 |
| [#58](https://github.com/koenjineer/Astro-portfolio/pull/58) | prettier 3.8.3 → 3.9.6 |
| [#57](https://github.com/koenjineer/Astro-portfolio/pull/57) | react と @types/react |
| [#56](https://github.com/koenjineer/Astro-portfolio/pull/56) | sass 1.99.0 → 1.104.0 |

`#67` 以外はメジャー更新ではないので、CIが通れば単独でマージできる見込み。

---

## 優先度：低

### 制作実績のサムネイルの作り方を残す

`apps/astro-portfolio/CLAUDE.md` に数行。3件目のサイトを追加するときに同じ回り道をしないため。

- 公開した本番サイトのトップをヘッドレスChromeで撮り、**1150×670**のwebpにする（既存と同じ寸法）
- **カンプと同じ幅で撮って縮小する。** 1150pxで直接撮ると、サイトによってはヘッダーが
  スマホ表示に切り替わり、既存のサムネイルと見え方がそろわない（みなみ歯科で発生）
- 自動で動く部分があるなら `--force-prefers-reduced-motion` で止めてから撮る

### マージ済みのローカルブランチを掃除する

26本残っている（`git branch --merged main`）。害はないが見通しが悪い。

### みなみ歯科のWordPress原稿の誤字を直す（**ユーザー作業**）

お知らせ本文の「させていただきいます」が15件すべてに残っている。**管理画面で直す**
（コードでは書き換えない）。詳細は `apps/minami-dental-next/docs/progress.md`。
