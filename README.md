# sugasaki Portfolio

GitHub の全リポジトリ（Public / Private）を一覧表示するポートフォリオサイト。

**https://sugasaki.github.io/portfolio/**

## 機能

- 言語別フィルタ（TypeScript, JavaScript, C#, Kotlin 等）
- リポジトリ名・説明文の検索（`/` キーでフォーカス）
- 更新日順ソート（昇順・降順切替）
- Public / Private バッジ表示
- レスポンシブデザイン

## 構成

```
index.html   — ポートフォリオページ（単一HTMLファイル）
repos.json   — GitHub API から取得したリポジトリデータ
```

## データ更新

`repos.json` を再取得して更新する場合:

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
}' | jq '[.data.viewer.repositories.nodes[]]' | jq -s 'add' > repos.json
```

## 技術スタック

- HTML / CSS / Vanilla JS（フレームワーク不使用）
- GitHub Pages でホスティング
- GitHub GraphQL API でリポジトリ情報を取得
