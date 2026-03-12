# 開発規約

Claude Code との協業で培った開発規約。CLAUDE.md に記載する規約の詳細解説。

## Issue 運用

| 変更の種類 | Issue | 例 |
|-----------|-------|----|
| 機能追加・バグ修正 | **必須** | 新機能、バグ修正 |
| 小規模な改善・リファクタ | 任意（推奨） | パフォーマンス改善、コード整理 |
| chore/docs/CI/typo | 不要 | CLAUDE.md更新、依存更新、タイポ修正 |

## ブランチ戦略

### ブランチ命名
- Issue あり: `feature/{issue番号}-{概要}`
- Issue なし: `chore/{概要}`
- mainブランチへの直接プッシュは**禁止**

### Git Worktree の活用
- Claude Code は並行作業時にブランチ切り替えで衝突が起きやすい
- Worktree を使うことで、各作業が独立したディレクトリで進行し安全
- Claude Code の `EnterWorktree` コマンドで簡単に作成可能
- `.env.local` など Git 管理外ファイルは手動コピーが必要

## コミットメッセージ
- 日本語で記述
- 1行目: 変更の要約（50文字程度）
- 空行後に詳細（必要に応じて）
- Issue がある場合: `Closes #{issue番号}` で自動クローズ

## PR 運用

### 作成
- `gh pr create` で作成
- タイトル: 70文字以内
- Issue がある場合: body に `Closes #{issue番号}` を必ず含める
- Issue がない場合: body で変更理由を明記

### マージ
- **PRのマージはユーザーの明示的な承認なしに実行しない**
- これはClaude Codeが勝手にマージしないようにするための重要なルール

## レビュー対応

Claude Code がレビュー指摘に対応する際のルール:

1. 修正をpush
2. **PRコメント欄に対応内容のサマリーを投稿**
3. **対応済みのレビュースレッドをResolve**（GraphQL API `resolveReviewThread` を使用）

### なぜこのルールが必要か
- push後にコメントがないと、レビュワーが何が変わったか追跡しにくい
- スレッドをResolveしないと、対応済みの指摘が未対応に見える
- 特にCopilot Code Reviewの自動レビューでは、複数ラウンドのレビューが入るため重要

## ビルド・lint確認

### push前に必ず確認するコマンド
```sh
# Web (Vite)
npm run build
npm run lint

# Mobile (Expo)
npx expo export --platform web
npm run lint
```

### なぜ重要か
- CIで失敗するとレビューが遅れる
- lintエラーが残ったままpushするとCopilotレビューでも指摘される

## CLI ツールの注意点

### `gh pr checks` の終了コード
```sh
# NG: 認証エラーも握りつぶす
gh pr checks 123 || true

# OK: チェック失敗(exit 1)だけ無視
gh pr checks 123 || [ $? -eq 1 ]
```

### `gh pr create` のbody
HEREDOCを使うとフォーマットが崩れない:
```sh
gh pr create --title "タイトル" --body "$(cat <<'EOF'
## Summary
- 変更点1
- 変更点2

Closes #123
EOF
)"
```
