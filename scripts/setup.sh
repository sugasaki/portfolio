#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/../templates"

usage() {
  echo "Usage: $0 <web|mobile> <target-directory>"
  echo ""
  echo "テンプレートファイルをターゲットディレクトリにコピーします。"
  echo "既存ファイルは上書きしません。"
  echo ""
  echo "Examples:"
  echo "  $0 web /path/to/my-web-app"
  echo "  $0 mobile /path/to/my-mobile-app"
  exit 1
}

if [ $# -ne 2 ]; then
  usage
fi

TYPE="$1"
TARGET="$2"

if [ "$TYPE" != "web" ] && [ "$TYPE" != "mobile" ]; then
  echo "Error: テンプレートタイプは 'web' または 'mobile' を指定してください。"
  usage
fi

SOURCE="$TEMPLATE_DIR/$TYPE"

if [ ! -d "$SOURCE" ]; then
  echo "Error: テンプレートディレクトリが見つかりません: $SOURCE"
  exit 1
fi

if [ ! -d "$TARGET" ]; then
  echo "Error: ターゲットディレクトリが存在しません: $TARGET"
  exit 1
fi

echo "テンプレート '$TYPE' を $TARGET にコピーします..."

# Copy .claude/CLAUDE.md
mkdir -p "$TARGET/.claude"
if [ -f "$TARGET/.claude/CLAUDE.md" ]; then
  echo "  SKIP: .claude/CLAUDE.md (既に存在)"
else
  cp "$SOURCE/.claude/CLAUDE.md" "$TARGET/.claude/CLAUDE.md"
  echo "  COPY: .claude/CLAUDE.md"
fi

# Copy .github/workflows/ci.yml
mkdir -p "$TARGET/.github/workflows"
if [ -f "$TARGET/.github/workflows/ci.yml" ]; then
  echo "  SKIP: .github/workflows/ci.yml (既に存在)"
else
  cp "$SOURCE/.github/workflows/ci.yml" "$TARGET/.github/workflows/ci.yml"
  echo "  COPY: .github/workflows/ci.yml"
fi

# Copy .gitignore (merge if exists)
if [ -f "$TARGET/.gitignore" ]; then
  echo "  SKIP: .gitignore (既に存在。必要に応じて手動でマージしてください)"
else
  cp "$SOURCE/.gitignore" "$TARGET/.gitignore"
  echo "  COPY: .gitignore"
fi

echo ""
echo "完了しました！次のステップ:"
echo "  1. $TARGET/.claude/CLAUDE.md を編集してプロジェクト情報を記入"
echo "  2. $TARGET/.github/workflows/ci.yml のビルドコマンドを確認"
echo "  3. Copilot Code Review を有効化 (docs/copilot-code-review-setup.md 参照)"
