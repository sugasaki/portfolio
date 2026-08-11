#!/usr/bin/env bash
# GitHub からリポジトリ一覧を取得し public/repos.json を再生成する。
#
# 使い方: ./scripts/fetch-repos.sh
#
# このリポジトリは Public のため、生成物に含まれる Private リポジトリの
# 名前・説明は commit した時点で恒久的に公開される。
# 新たに公開対象へ入る Private リポジトリを最後に一覧表示するので、
# commit 前に必ず確認すること。
set -euo pipefail

cd "$(dirname "$0")/.."
OUT="public/repos.json"
PREV="$(mktemp)"
NEW="$(mktemp)"
trap 'rm -f "$PREV" "$NEW"' EXIT

command -v gh >/dev/null || { echo "gh CLI が必要です" >&2; exit 1; }
command -v jq >/dev/null || { echo "jq が必要です" >&2; exit 1; }
gh auth status >/dev/null

# 差分表示用に、更新前の Private リポジトリ名を控えておく
if [ -f "$OUT" ]; then
  jq -r '(if type == "array" then . else .repos end)[] | select(.isPrivate) | .name' "$OUT" | sort > "$PREV"
else
  : > "$PREV"
fi

echo "GitHub からリポジトリ一覧を取得中..."
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
}' \
  | jq -s '[.[].data.viewer.repositories.nodes[]]' \
  | jq --arg now "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '{generatedAt: $now, repos: .}' > "$NEW"

count=$(jq '.repos | length' "$NEW")
[ "$count" -gt 0 ] || { echo "取得結果が0件のため中断します（$OUT は変更しません）" >&2; exit 1; }
mv "$NEW" "$OUT"

private_count=$(jq '[.repos[] | select(.isPrivate)] | length' "$OUT")
echo "完了: 全 ${count} 件（うち Private ${private_count} 件）を $OUT に書き出しました"

# 今回から新しく公開される Private リポジトリ名を提示する
jq -r '.repos[] | select(.isPrivate) | .name' "$OUT" | sort > "$PREV.new"
if added=$(comm -13 "$PREV" "$PREV.new") && [ -n "$added" ]; then
  echo
  echo "▼ 今回から新しく公開される Private リポジトリ名（PR 本文に記載すること）:"
  echo "$added" | sed 's/^/  - /'
fi
rm -f "$PREV.new"
