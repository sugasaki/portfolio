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

`public/repos.json` を再取得して更新する場合:

```sh
gh api graphql --paginate -f query='
query($endCursor: String) {
  viewer {
    repositories(first: 100, after: $endCursor, ownerAffiliations: OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        description
        url
        isPrivate
        primaryLanguage { name }
        stargazerCount
        updatedAt
        repositoryTopics(first: 10) { nodes { topic { name } } }
      }
    }
  }
}' | jq '[.data.viewer.repositories.nodes[]]' | jq -s 'add' > public/repos.json
```
