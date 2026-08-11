# portfolio — AI エージェント向けガイド

このリポジトリで作業するすべての AI エージェント向けのガイド（特定製品に依存せず、`AGENTS.md` を読むエージェントすべてが対象。Claude Code / Codex / opencode / GLM / Cursor / Gemini など）。
**このファイルが正本**。`CLAUDE.md` は Claude Code 用の参照スタブで、中身はここに集約する。

## プロジェクト概要
GitHub の全リポジトリ（Public / Private）を一覧表示するポートフォリオサイト。
GitHub Pages でホスティングし、`repos.json` のデータを元に動的にカード表示する。

**目的**: 人に見せることと自分の中での整理が半々。プライベートリポジトリのコードは公開しないが、成果物としての画面（スクリーンショット等）はパブリックに公開してよい。

公開URL: https://sugasaki.github.io/portfolio/

## Tech Stack
- React 19 + TypeScript + Vite 7
- 追加の実行時ライブラリなし（react / react-dom のみ）
- GitHub Pages（ホスティング、GitHub Actions でビルド・デプロイ）
- GitHub GraphQL API（`gh api graphql` でリポジトリ情報を取得し `public/repos.json` に静的保存）

## プロジェクト初期化
package.json が存在しない場合、以下のコマンドでプロジェクトを初期化すること:
```sh
npm create vite@latest . -- --template react-ts
npm install
```
- **必ず React + TypeScript + Vite の構成で作成する**
- **scaffold は空ディレクトリで行う**。テンプレート（このファイル等）を先に置いた状態だと `npm create vite` が上書き確認プロンプトになり失敗しやすい。新規プロジェクトは「scaffold → テンプレート適用」の順にする
- 初期化後に必要なライブラリを追加でインストールする
- Vanilla HTML/JS で作成してはならない

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
  ci.yml                — CI（lint・build）
  deploy.yml            — GitHub Pages デプロイ
```

## 開発パターン
- `repos.json` は `public/` 配下に配置し、`fetch()` で読み込む（README にデータ更新手順あり）
- **Private リポジトリの名前・説明・スクリーンショットは表示してよい**（振り返り・成果物公開の用途）。ただしコード・認証情報・内部URLは公開しない
- スタイルは `index.css` に集約（CSS Modules 不使用）

## 開発規約

### Issue 運用ルール
| 変更の種類 | Issue | 例 |
|-----------|-------|----|
| 機能追加・バグ修正 | **必須** | 新機能、バグ修正 |
| 小規模な改善・リファクタ | 任意（推奨） | パフォーマンス改善、コード整理 |
| chore/docs/CI/typo | 不要 | ドキュメント更新、依存更新、タイポ修正 |

- 要件にない機能を無断で追加しない（提案は歓迎、実装は利用者の確認後）
- **エージェントがIssueを作成する場合、Issue本文の最上部（先頭）に `作成者: <エージェント名>` を必ず明記**する
  - エージェント名は `<ツール名>` または `<ツール名> (<モデル名>)` で統一（例: `作成者: Claude Code` / `作成者: Codex (GPT-5)`）
  - 署名漏れに気づいた場合は別コメントを追加せず、Issue本文を編集して最上部へ追記する

### ブランチ運用
- **mainブランチへの直接プッシュは禁止**。必ずブランチを作成し、PRを経由してマージすること
- Issue あり: `feature/{issue番号}-{概要}` (例: `feature/3-add-login`)
- Issue なし: `chore/{概要}` (例: `chore/update-dependencies`)
- **`{概要}` は半角英数字とハイフンを基本にする**（URL や CI で問題が出にくい。日本語は避ける）
- **Git worktree を使う条件**: 複数ブランチを同時に触る、または現在の作業とは別の作業を新しく始めるとき。単一タスクでブランチを切り替えるだけなら通常の `git switch` でよい
  - `git worktree add` で作成（Claude Code の場合は `EnterWorktree` コマンドでも可）
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
- **PR 本文の先頭（上段）に `作成者: <エージェント名>` を必ず明記**する
  - エージェント名は `<ツール名>` または `<ツール名> (<モデル名>)` で統一（例: `作成者: Claude Code` / `作成者: Codex (GPT-5)`）
- **Issue がある場合**: body に `Closes #{issue番号}` を **必ず** 含める
- **Issue がない場合**: body に変更理由と変更内容を書く（最低限このテンプレート）:
  ```markdown
  作成者: <エージェント名>

  ## 変更理由
  - 何のために / どの問題を解決するか
  ## 変更内容
  - 主な変更点
  ```
- **PRのマージは利用者の明示的な承認なしに実行しない**（エージェントが作成したPRを自分でマージしない）

### レビュー対応
- PRにはGitHub Copilotの自動レビューが入る
- **エージェントがPRレビュー/コメントを投稿する場合、本文の先頭（上段）に `レビュアー: <エージェント名>` を必ず明記**する
  （例: `レビュアー: Claude Code` / `レビュアー: Codex (GPT-5)`。署名漏れは別コメントではなく既存本文を編集して直す）
- レビュー指摘への修正をpushした後は、**必ず以下の2つを行う**:
  1. PRコメント欄に対応内容のサマリーを投稿する
  2. 対応した（コード修正で解消した）レビュースレッドを Resolve する。推奨 ruleset は未解決スレッドのままでもマージ可能だが、対応済みを未対応に見せないための作業規律として行う:
     ```sh
     # スレッドID一覧を取得
     gh api graphql -f query='
       { repository(owner:"<owner>",name:"<repo>"){ pullRequest(number:<PR番号>){
         reviewThreads(first:50){ nodes{ id isResolved path } } } } }'
     # 対応済みスレッドを Resolve
     gh api graphql -f query='
       mutation($id:ID!){ resolveReviewThread(input:{threadId:$id}){ thread{ id isResolved } } }' \
       -f id=<スレッドID>
     ```

### ビルド・lint確認
- 実装後は必ず `npm run build` でエラーがないことを確認する
- **push前に必ず `npm run lint` を実行し、エラーが0件であることを確認する**

### CLIツールの注意点
- **`gh` を使う前に `gh auth status` で認証を確認する**（未認証だと `Bad credentials` で詰まる）
- `gh pr checks` の終了コード: 0=全pass / 8=保留(実行中) / それ以外=失敗
- **`|| true` を付けて失敗を握り潰さない**。終了コードを退避して分岐し、保留(8)はポーリングで待つ:
  ```sh
  for i in 1 2 3 4 5 6; do
    gh pr checks <PR番号>; ec=$?
    case "$ec" in
      0) break ;;                        # 全pass → 次へ進む
      8) sleep 20 ;;                     # 実行中 → 20秒待って再確認
      *) echo "失敗/認証エラー: exit=$ec"; exit "$ec" ;;  # 中断
    esac
  done
  ```

### デザイン作業（opt-in スキル）
- `.claude/skills/frontend-design/SKILL.md`（英語）を、UI を意図的に作り込むデザインパス用に同梱している。通常のコンポーネント実装では使わない
- Claude Code は自動で読み込む。それ以外のエージェント（Codex / opencode / GLM など）は自動ロードされない。**デザインの作り込みが必要かどうかは自分で判断し、必要と判断したら `SKILL.md` を直接読んで適用する**（人手の設定・移設は不要。ファイルはプロジェクトに同梱されている）
