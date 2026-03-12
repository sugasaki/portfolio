# Copilot Code Review 設定ガイド

## 概要

- GitHub Copilot Code Review はPR作成時に自動でコードレビューを行う機能
- Rulesetとして設定することで、特定ブランチへのPR全てに自動適用される

## 前提条件

- GitHub Copilot が利用可能なプラン（Enterprise, Business, または個人Pro+）
- リポジトリの管理者権限

## 方法1: gh API でRulesetを作成（自動レビュー）

### 1. ruleset.json を作成

```json
{
  "name": "Copilot Code Review",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "copilot_code_review",
      "parameters": {
        "review_on_push": true,
        "review_draft_pull_requests": false
      }
    }
  ]
}
```

### 2. gh api で適用

```sh
gh api --method POST \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/{owner}/{repo}/rulesets \
  --input ruleset.json
```

### 3. 確認

```sh
gh ruleset list
```

## 方法2: PR単位で手動リクエスト（gh v2.88.0以降）

```sh
gh pr create --add-reviewer @copilot
gh pr edit <PR番号> --add-reviewer @copilot
```

## 方法3: GitHub Web UI

Settings → Rules → Rulesets → New ruleset → 「Copilot Code Review」ルールを追加

## パラメータ説明

| パラメータ | 型 | 説明 |
|---|---|---|
| `review_on_push` | bool | push毎に自動レビューを実行 |
| `review_draft_pull_requests` | bool | ドラフトPRもレビュー対象にする |

## Ruleset管理コマンド

```sh
# 一覧表示
gh ruleset list

# 詳細表示
gh ruleset view <ruleset_id>

# 更新
gh api --method PUT /repos/{owner}/{repo}/rulesets/{ruleset_id} --input ruleset.json

# 削除
gh api --method DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}
```

## Claude Codeでの活用

CLAUDE.mdに以下のレビュー対応規約を記述:

```markdown
### レビュー対応
- PRにはGitHub Copilotの自動レビューが入る
- レビュー指摘への修正をpushした後は、必ず以下の2つを行う:
  1. PRコメント欄に対応内容のサマリーを投稿する
  2. 対応済みのレビュースレッドをResolveする（GraphQL API `resolveReviewThread` を使用）
```

## 参考リンク

- [GitHub Docs - Copilot Code Review の設定](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/configure-automatic-review)
- [GitHub Changelog - gh CLI での Copilot レビューリクエスト (2026-03-11)](https://github.blog/changelog/2026-03-11-request-copilot-code-review-from-github-cli/)
- [GitHub Changelog - 独立ルールとしての Copilot Code Review (2025-09-10)](https://github.blog/changelog/2025-09-10-copilot-code-review-independent-repository-rule-for-automatic-reviews/)
