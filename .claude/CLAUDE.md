# sugasaki Portfolio - Claude Code ガイド

## プロジェクト概要
GitHub の全リポジトリ（Public / Private）を一覧表示するポートフォリオサイト。
GitHub Pages でホスティングし、repos.json のデータを元に動的にカード表示する。

## Tech Stack
- React 19 + TypeScript + Vite 7
- GitHub Pages（ホスティング、GitHub Actions でビルド・デプロイ）
- GitHub GraphQL API（リポジトリ情報取得）

## ファイル構成
```
src/
  main.tsx              — エントリーポイント
  App.tsx               — ルートコンポーネント
  index.css             — グローバルスタイル
  types.ts              — 型定義
  constants.ts          — 言語カラー等の定数
  hooks/useRepos.ts     — リポジトリデータ取得・フィルタ・ソートのカスタムフック
  components/
    Header.tsx          — ヘッダー（アバター、統計）
    Controls.tsx        — 検索・フィルタ・ソートUI
    RepoCard.tsx        — リポジトリカード
public/
  repos.json            — GitHub API から取得したリポジトリデータ
index.html              — HTMLテンプレート
vite.config.ts          — Vite設定（base: '/portfolio/'）
.github/workflows/
  deploy.yml            — GitHub Pages デプロイ
```

## 開発パターン
- `repos.json` は `public/` 配下に配置し、`fetch()` で読み込む
- Private リポジトリの名前・説明は表示してよい（自分用の振り返り用途）
- スタイルは `index.css` に集約（CSS Modules 不使用）

## 開発規約

### Issue 運用ルール
| 変更の種類 | Issue | 例 |
|-----------|-------|----|
| 機能追加・バグ修正 | **必須** | 新機能、バグ修正 |
| 小規模な改善・リファクタ | 任意（推奨） | パフォーマンス改善、コード整理 |
| chore/docs/CI/typo | 不要 | CLAUDE.md更新、依存更新、タイポ修正 |

### ブランチ運用
- **mainブランチへの直接プッシュは禁止**。必ずブランチを作成し、PRを経由してマージすること
- Issue あり: `feature/{issue番号}-{概要}` (例: `feature/3-add-login`)
- Issue なし: `chore/{概要}` (例: `chore/update-dependencies`)
- **作業時は Git worktree を使用する**
  - ブランチ切り替えによる衝突を防ぐため、新しい作業を開始するたびに新しい worktree を作成する
  - Claude Code を使う場合: `EnterWorktree` コマンドを実行して worktree を作成する
  - 複数の Issue を並行して作業する場合も、それぞれ別の worktree で独立して進める

### コミットメッセージ
- 日本語で記述
- 1行目: 変更の要約
- 空行後に詳細 (必要に応じて)
- Issue がある場合は `Closes #{issue番号}` で自動クローズ

### PR
- タイトル: 日本語OK、70文字以内
- `gh pr create` で作成
- **Issue がある場合**: body に `Closes #{issue番号}` を **必ず** 含める
- **Issue がない場合**: body の Summary で変更理由を明記する
- **PRのマージはユーザーの明示的な承認なしに実行しない**

### レビュー対応
- PRにはGitHub Copilotの自動レビューが入る
- レビュー指摘への修正をpushした後は、**必ず以下の2つを行う**:
  1. PRコメント欄に対応内容のサマリーを投稿する
  2. 対応済みのレビュースレッドをResolveする（GraphQL API `resolveReviewThread` を使用）

### ビルド・lint確認
- 実装後は必ず `npm run build` でエラーがないことを確認する
- **push前に必ず `npm run lint` を実行し、エラーが0件であることを確認する**

### CLIツールの注意点
- `gh pr checks` はチェック失敗時に終了コード1を返す
- 認証エラーやネットワーク障害を握りつぶさないよう、**常に `|| true` を付けるのは避ける**
- 終了コード1（チェック失敗）だけ無視したい場合:
  ```sh
  gh pr checks <PR番号> || [ $? -eq 1 ]
  ```
