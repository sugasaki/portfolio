# Claude Code プロジェクトテンプレート

Claude Code を活用した開発プロジェクトのテンプレート集。
開発規約・CI/CD・Copilot Code Review 設定を含む。

## テンプレート

| テンプレート | Tech Stack | 説明 |
|---|---|---|
| [Web](templates/web/) | React + TypeScript + Vite | Webアプリケーション用 |
| [Mobile](templates/mobile/) | React Native + Expo | モバイルアプリケーション用 |

## 使い方

### 1. テンプレートファイルをコピー

```sh
# Web プロジェクトの場合
./scripts/setup.sh web /path/to/your-project

# Mobile プロジェクトの場合
./scripts/setup.sh mobile /path/to/your-project
```

### 2. CLAUDE.md をカスタマイズ

コピーされた `.claude/CLAUDE.md` を開き、以下を自分のプロジェクトに合わせて編集:
- プロジェクト概要
- Tech Stack の詳細
- ファイル構成
- プロジェクト固有の開発パターン

### 3. Copilot Code Review を有効化

[設定ガイド](docs/copilot-code-review-setup.md) を参照。

```sh
# Ruleset で自動レビューを有効化
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/{owner}/{repo}/rulesets \
  --input ruleset.json
```

### 4. CI ワークフローを確認

`.github/workflows/ci.yml` がプロジェクトのビルド・テストコマンドと一致していることを確認。

## ドキュメント

- [開発規約](docs/development-conventions.md) — ブランチ戦略、コミットメッセージ、PR運用、レビュー対応
- [Copilot Code Review 設定ガイド](docs/copilot-code-review-setup.md) — gh CLI での設定方法
