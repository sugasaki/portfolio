import { useState, useEffect, useMemo } from 'react'
import type { RawRepo, Repo, VisibilityFilter, SortOrder } from '../types'

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
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLang, setActiveLang] = useState('all')
  const [visibility, setVisibility] = useState<VisibilityFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}repos.json`)
      .then((r) => r.json())
      .then((data: RawRepo[]) => {
        setRepos(data.map(transformRepo).sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ))
        setLoading(false)
      })
  }, [])

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
    loading,
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
