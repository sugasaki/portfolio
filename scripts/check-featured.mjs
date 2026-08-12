#!/usr/bin/env node
/**
 * src/data/featured.ts の掲載対象が public/repos.json に実在するかを検査する。
 *
 * リポジトリを改名すると featured.ts 側の repo 名だけが取り残され、
 * 画面から静かに消える（実際 truemem → memorybar の改名で発生した）。
 * 実行時は console.warn しか出ず気づけないため、CI で落とす。
 *
 * 使い方: node scripts/check-featured.mjs
 */
import { readFileSync } from 'node:fs'

const featuredSrc = readFileSync(new URL('../src/data/featured.ts', import.meta.url), 'utf8')
const reposFile = JSON.parse(
  readFileSync(new URL('../public/repos.json', import.meta.url), 'utf8'),
)

// featured.ts は TypeScript のためそのまま import できない。
// 掲載対象の判別に必要なのは repo 名だけなので、宣言行だけを取り出す。
const declared = [...featuredSrc.matchAll(/^\s*repo: '([^']+)',/gm)].map((m) => m[1])

if (declared.length === 0) {
  console.error('featured.ts から repo 名を1件も取り出せませんでした（書式が変わった可能性）')
  process.exit(1)
}

const names = new Set(reposFile.repos.map((r) => r.name))
const missing = declared.filter((name) => !names.has(name))
const duplicated = declared.filter((name, i) => declared.indexOf(name) !== i)

for (const name of missing) {
  console.error(`✗ featured.ts の "${name}" が repos.json にありません（改名・削除の可能性）`)
}
for (const name of duplicated) {
  console.error(`✗ featured.ts に "${name}" が重複しています`)
}

if (missing.length > 0 || duplicated.length > 0) {
  console.error('\n改名した場合は featured.ts の repo 名を新しい名前に更新してください。')
  process.exit(1)
}

console.log(`✓ 注目プロジェクト ${declared.length} 件はすべて repos.json に存在します`)
