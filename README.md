# sugasaki Portfolio

GitHub の全リポジトリ（Public / Private）を一覧表示するポートフォリオサイト。

**https://sugasaki.github.io/portfolio/**

画面は2層構成:

1. **Selected Work** — 手で書いたキュレーション情報を持つ注目プロジェクト（人に見せる層）
2. **All Repositories** — 全リポジトリの一覧（振り返り・検索の層）

## 機能

- 注目プロジェクトの紹介（説明文・技術スタック・スクリーンショット）
- 言語別フィルタ（TypeScript, JavaScript, C#, Kotlin 等）
- リポジトリ名・説明文の検索（`/` キーでフォーカス）
- 更新日順ソート（昇順・降順切替）
- Public / Private バッジ表示
- レスポンシブデザイン

## Tech Stack

- React 19 + TypeScript + Vite 7
- GitHub Pages + GitHub Actions でデプロイ

## 開発

```sh
npm install
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run lint     # ESLint
```

## 注目プロジェクトの編集

`src/data/featured.ts` が正本。掲載順がそのまま表示順になり、**先頭の1件は大きく表示される**。

`repo` は `public/repos.json` の `name` と一致させる（一致しない場合は掲載されず、開発者コンソールに警告が出る）。言語・更新日・Public/Private バッジは `repos.json` 側の値が自動で使われるので、手で書くのは名前・説明・技術スタックだけでよい。

### スクリーンショットの追加

1. 画像を `public/shots/` に置く（例: `public/shots/truemem.png`）
2. `src/data/featured.ts` の該当プロジェクトに `shot: 'truemem.png'` を追加する

画像は横長（16:9 前後）を想定し、上端基準で切り抜かれる。**未設定でも問題なく、その場合は言語色から生成した代替パネルが表示される**ので、撮れたものから順に足していけばよい。

Private リポジトリはコードを公開しないためリンクを張らないが、画面（スクリーンショット）は掲載してよい。公開中のデモがある場合は `liveUrl` を指定するとタイトルがリンクになる。

## データ更新

`public/repos.json` は GitHub GraphQL API から取得した静的データ。再取得するには:

```sh
./scripts/fetch-repos.sh
```

取得日時は `generatedAt` としてファイルに記録され、サイトのフッターに表示される（実行時の日付ではなくデータの日付）。

このリポジトリは Public のため、**生成物に含まれる Private リポジトリの名前・説明は commit した時点で恒久的に公開される**。スクリプトは新たに公開対象へ入る Private リポジトリ名を最後に一覧表示するので、commit 前に確認すること。
