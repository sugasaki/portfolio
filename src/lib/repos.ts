import type { RawRepo, Repo } from '../types'
import type { FeaturedProject } from '../data/featured'

/** repos.json の生データを画面で扱う形に整える */
export function transformRepo(raw: RawRepo): Repo {
  return {
    name: raw.name,
    description: raw.description,
    url: raw.url,
    isPrivate: raw.isPrivate,
    language: raw.primaryLanguage?.name ?? 'Other',
    stars: raw.stargazerCount,
    updatedAt: raw.updatedAt,
    topics: raw.repositoryTopics.nodes.map((n) => n.topic.name),
  }
}

export interface YearGroup {
  year: string
  repos: Repo[]
}

/**
 * 更新年ごとに区切る。渡された順序をそのまま保ち、隣り合う同年だけをまとめるので、
 * 昇順・降順どちらのソート結果でも年の並びが破綻しない。
 */
export function groupByYear(repos: Repo[]): YearGroup[] {
  const result: YearGroup[] = []
  repos.forEach((repo) => {
    const year = repo.updatedAt.slice(0, 4)
    const last = result[result.length - 1]
    if (last?.year === year) {
      last.repos.push(repo)
    } else {
      result.push({ year, repos: [repo] })
    }
  })
  return result
}

export interface FeaturedEntry extends FeaturedProject {
  meta: Repo
}

/**
 * 手書きのキュレーション情報に repos.json 側のメタ情報を結合する。
 * 対応するリポジトリが無いものは掲載順から除外し、名前を onMissing で知らせる
 * (改名・削除に気づけるようにするため、静かに落とさない)。
 */
export function joinFeatured(
  featured: FeaturedProject[],
  repos: Repo[],
  onMissing?: (repoName: string) => void,
): FeaturedEntry[] {
  const byName = new Map(repos.map((r) => [r.name, r]))
  return featured.flatMap((f) => {
    const meta = byName.get(f.repo)
    if (!meta) {
      onMissing?.(f.repo)
      return []
    }
    return [{ ...f, meta }]
  })
}
