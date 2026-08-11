# sugasaki Portfolio

GitHub の全リポジトリ（Public / Private）を一覧表示するポートフォリオサイト。

**https://sugasaki.github.io/portfolio/**

## 機能

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

## データ更新

`public/repos.json` は GitHub GraphQL API から取得した静的データ。再取得するには:

```sh
./scripts/fetch-repos.sh
```

取得日時は `generatedAt` としてファイルに記録され、サイトのフッターに表示される（実行時の日付ではなくデータの日付）。

このリポジトリは Public のため、**生成物に含まれる Private リポジトリの名前・説明は commit した時点で恒久的に公開される**。スクリプトは新たに公開対象へ入る Private リポジトリ名を最後に一覧表示するので、commit 前に確認すること。
