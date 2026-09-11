# プルリクエストの自動チェック（CI）とGitHubの安全設定

`main` へのプルリクエストを出すと、GitHubが自動でコードを検査する。
設定ファイルは `.github/workflows/ci.yml`。

## 何が走るか

3つのアプリそれぞれで、次の2つを行う。アプリごとに別々のチェックとして表示される。

| チェック名 | 中身 |
| --- | --- |
| check (astro-portfolio) | `pnpm lint` → `pnpm exec astro check` |
| check (global-standard-next) | `pnpm lint` → `pnpm exec next typegen && pnpm exec tsc --noEmit` |
| check (minami-dental-next) | `pnpm lint` → `pnpm exec next typegen && pnpm exec tsc --noEmit` |

- **lint**：書き方のルール違反を探す。**警告（warning）では落ちない。エラーだけで落ちる**
- **型チェック**：TypeScriptの型の食い違いを探す
- Next.jsの2サイトは、型チェックの前に `next typegen` を挟む。
  型チェックに必要な自動生成ファイル（next-env.d.ts）がGitに入っていないため
- 同じブランチに続けてプッシュすると、古い実行は止まって最新だけが走る
- チェック名はマージ条件に使っている。**ci.yml の `name` や `app` の名前を変えると、
  マージできなくなる**（GitHub側の設定も直す必要がある）

## ビルドは含めない

Next.jsの2サイトは、ビルド時に**手元のMacにしか無いWordPress**を読みに行く。
GitHub上からは見えないので、ビルドはここでは行わない。
ビルドとデプロイは今までどおり手元で行う（`/rules/nextjs-static-export.md`）。

→ CIが緑でも「ビルドが通る」保証にはならない。デプロイ前の手元ビルドは続ける。

## チェックが通るまでマージできない

`main` には「上の3つのチェックが通っていること」をマージ条件にする設定を入れる。
1つでも赤（失敗）なら、マージボタンが押せない。直してプッシュし直せば自動で再検査される。

## GitHubの安全設定（有効にしてあるもの）

このリポジトリは公開（Public）なので、次を有効にしてある。

- **シークレットスキャン**：APIキーやパスワードらしき文字列がコードに入っていないか見張る
- **プッシュ保護**：それらしき文字列を含むプッシュを、GitHub側で止める。
  止められたら、無理に通さず中身を確認する
- **Dependabotアラート**：使っている部品（パッケージ）に危険な欠陥が見つかると知らせる
- **Dependabotセキュリティ更新**：直せる欠陥は、修正版へ上げるプルリクエストを自動で作る。
  これにも上のチェックが走るので、緑を確認してからマージする

## 失敗したときの見方

1. プルリクエストの画面で **Checks** タブを開く
2. 左の一覧から、赤い ✗ の付いた **check (アプリ名)** を選ぶ
3. 赤くなっている手順（Install / Lint / Type check）を開くと、エラーの本文が読める

手元で再現するには、**そのアプリのフォルダで同じコマンドを叩く**。

```
cd apps/<アプリ名>
pnpm install --frozen-lockfile
pnpm lint
pnpm exec astro check                               # astro-portfolio の場合
pnpm exec next typegen && pnpm exec tsc --noEmit    # Next.jsの2サイトの場合
```

- **Install で落ちた**：package.json を変えたのにロックファイルを更新していない。
  そのアプリで `pnpm install` をしてロックファイルもコミットする
- **Lint / Type check で落ちた**：エラー本文のファイル名と行番号を見て直す
