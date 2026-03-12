# {プロジェクト名} - Claude Code ガイド

## プロジェクト概要
{プロジェクトの概要を記述}

## Tech Stack
- React Native + Expo
- {追加のライブラリ}

## ファイル構成
{プロジェクトのファイル構成を記述}

## 開発パターン
{プロジェクト固有の開発パターン・制約を記述}
{例: ナビゲーション構成、ネイティブモジュール、プラットフォーム固有コード等}

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
  - **`.env.local` は Git 管理外のため worktree に自動コピーされない**。環境変数が必要な場合は手動でコピーすること:
    ```sh
    cp /path/to/main-repo/.env.local /path/to/worktree/.env.local
    ```

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
- 実装後は必ず `npx expo export` でビルドエラーがないことを確認する
- **push前に必ず `npm run lint` を実行し、エラーが0件であることを確認する**

### CLIツールの注意点
- `gh pr checks` はチェック失敗時に終了コード1を返す
- 認証エラーやネットワーク障害を握りつぶさないよう、**常に `|| true` を付けるのは避ける**
- 終了コード1（チェック失敗）だけ無視したい場合:
  ```sh
  gh pr checks <PR番号> || [ $? -eq 1 ]
  ```
