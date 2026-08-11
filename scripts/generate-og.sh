#!/usr/bin/env bash
# scripts/og-image.html を 1200x630 で描画して public/og.png を生成する。
#
# 使い方: ./scripts/generate-og.sh
#
# Google Fonts をネットワーク越しに読むため、オフラインだとフォントが
# 既定のものに落ちる。生成後は必ず画像を目視で確認すること。
set -euo pipefail

cd "$(dirname "$0")/.."
SRC="scripts/og-image.html"
OUT="public/og.png"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || {
  echo "Chrome が見つかりません: $CHROME" >&2
  echo "環境変数 CHROME で実行ファイルのパスを指定してください" >&2
  exit 1
}

echo "OG 画像を生成中..."
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --virtual-time-budget=5000 \
  --screenshot="$OUT" \
  "file://$PWD/$SRC" 2>/dev/null

[ -s "$OUT" ] || { echo "生成に失敗しました" >&2; exit 1; }
echo "完了: $OUT"
