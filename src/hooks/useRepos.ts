import { useState, useEffect, useMemo } from 'react'
import type { RawRepo, Repo, ReposFile, VisibilityFilter, SortOrder } from '../types'
import { FEATURED } from '../data/featured'
import type { FeaturedEntry } from '../components/Featured'

function transformRepo(raw: RawRepo): Repo {
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

export function useRepos() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLang, setActiveLang] = useState('all')
  const [visibility, setVisibility] = useState<VisibilityFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}repos.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`repos.json の取得に失敗しました (${r.status})`)
        return r.json()
      })
      .then((data: ReposFile) => {
        setRepos(data.repos.map(transformRepo).sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ))
        setGeneratedAt(data.generatedAt)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // 手書きのキュレーション情報に、repos.json 側のメタ情報を結合する。
  // repos.json に存在しない repo 名（改名・削除など）は静かに落とさず警告する。
  const featured = useMemo<FeaturedEntry[]>(() => {
    if (repos.length === 0) return []
    const byName = new Map(repos.map((r) => [r.name, r]))
    return FEATURED.flatMap((f) => {
      const meta = byName.get(f.repo)
      if (!meta) {
        console.warn(`featured.ts の "${f.repo}" が repos.json に見つかりません`)
        return []
      }
      return [{ ...f, meta }]
    })
  }, [repos])

  const langCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    repos.forEach((r) => {
      counts[r.language] = (counts[r.language] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [repos])

  const filtered = useMemo(() => {
    let result = repos

    if (activeLang !== 'all') {
      result = result.filter((r) => r.language === activeLang)
    }

    if (visibility === 'public') {
      result = result.filter((r) => !r.isPrivate)
    } else if (visibility === 'private') {
      result = result.filter((r) => r.isPrivate)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q) ||
          r.language.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q)),
      )
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      return sortOrder === 'asc' ? -diff : diff
    })

    return result
  }, [repos, activeLang, visibility, searchQuery, sortOrder])

  // 一覧を更新年で区切る。並びは filtered の順序をそのまま保つので、
  // 昇順・降順どちらでも年の順序が破綻しない。
  const groups = useMemo(() => {
    const result: { year: string; repos: Repo[] }[] = []
    filtered.forEach((repo) => {
      const year = repo.updatedAt.slice(0, 4)
      const last = result[result.length - 1]
      if (last?.year === year) {
        last.repos.push(repo)
      } else {
        result.push({ year, repos: [repo] })
      }
    })
    return result
  }, [filtered])

  const stats = useMemo(
    () => ({
      total: repos.length,
      stars: repos.reduce((s, r) => s + r.stars, 0),
      languages: new Set(repos.map((r) => r.language)).size,
      publicCount: repos.filter((r) => !r.isPrivate).length,
    }),
    [repos],
  )

  return {
    repos: filtered,
    groups,
    featured,
    loading,
    generatedAt,
    stats,
    langCounts,
    searchQuery,
    setSearchQuery,
    activeLang,
    setActiveLang,
    visibility,
    setVisibility,
    sortOrder,
    setSortOrder,
  }
}
