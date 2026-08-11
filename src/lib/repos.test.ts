import { describe, it, expect, vi } from 'vitest'
import { transformRepo, groupByYear, joinFeatured } from './repos'
import type { RawRepo, Repo } from '../types'
import type { FeaturedProject } from '../data/featured'

function repo(name: string, updatedAt: string): Repo {
  return {
    name,
    description: null,
    url: `https://github.com/sugasaki/${name}`,
    isPrivate: false,
    language: 'TypeScript',
    stars: 0,
    updatedAt,
    topics: [],
  }
}

describe('transformRepo', () => {
  const raw: RawRepo = {
    name: 'truemem',
    description: 'メモリモニタ',
    url: 'https://github.com/sugasaki/truemem',
    isPrivate: true,
    primaryLanguage: { name: 'Swift' },
    stargazerCount: 3,
    updatedAt: '2026-08-11T00:00:00Z',
    repositoryTopics: { nodes: [{ topic: { name: 'macos' } }] },
  }

  it('生データを画面用の形に整える', () => {
    expect(transformRepo(raw)).toEqual({
      name: 'truemem',
      description: 'メモリモニタ',
      url: 'https://github.com/sugasaki/truemem',
      isPrivate: true,
      language: 'Swift',
      stars: 3,
      updatedAt: '2026-08-11T00:00:00Z',
      topics: ['macos'],
    })
  })

  it('言語が無いリポジトリは Other になる', () => {
    expect(transformRepo({ ...raw, primaryLanguage: null }).language).toBe('Other')
  })
})

describe('groupByYear', () => {
  it('更新年ごとにまとめ、件数の合計が元と一致する', () => {
    const repos = [
      repo('a', '2026-08-11T00:00:00Z'),
      repo('b', '2026-01-02T00:00:00Z'),
      repo('c', '2025-12-31T00:00:00Z'),
      repo('d', '2023-05-01T00:00:00Z'),
    ]
    const groups = groupByYear(repos)
    expect(groups.map((g) => [g.year, g.repos.length])).toEqual([
      ['2026', 2],
      ['2025', 1],
      ['2023', 1],
    ])
    expect(groups.reduce((s, g) => s + g.repos.length, 0)).toBe(repos.length)
  })

  it('昇順で渡しても年が重複せず、順序が逆になる', () => {
    const asc = [
      repo('d', '2023-05-01T00:00:00Z'),
      repo('c', '2025-12-31T00:00:00Z'),
      repo('b', '2026-01-02T00:00:00Z'),
      repo('a', '2026-08-11T00:00:00Z'),
    ]
    const years = groupByYear(asc).map((g) => g.year)
    expect(years).toEqual(['2023', '2025', '2026'])
    expect(new Set(years).size).toBe(years.length)
  })

  it('渡された並び順を変えない', () => {
    const repos = [repo('a', '2026-08-11T00:00:00Z'), repo('b', '2026-01-02T00:00:00Z')]
    expect(groupByYear(repos)[0].repos.map((r) => r.name)).toEqual(['a', 'b'])
  })

  it('空配列では空を返す', () => {
    expect(groupByYear([])).toEqual([])
  })
})

describe('joinFeatured', () => {
  const featured: FeaturedProject[] = [
    { repo: 'truemem', title: 'TrueMem', tagline: 't', story: 's', tech: ['Swift'] },
    { repo: 'stayput', title: 'StayPut', tagline: 't', story: 's', tech: ['Swift'] },
  ]

  it('repos.json 側のメタ情報を結合し、掲載順を保つ', () => {
    const repos = [repo('stayput', '2026-08-11T00:00:00Z'), repo('truemem', '2026-08-10T00:00:00Z')]
    const joined = joinFeatured(featured, repos)
    expect(joined.map((e) => e.repo)).toEqual(['truemem', 'stayput'])
    expect(joined[0].meta.updatedAt).toBe('2026-08-10T00:00:00Z')
  })

  it('対応するリポジトリが無いものは除外し、名前を通知する', () => {
    const onMissing = vi.fn()
    const joined = joinFeatured(featured, [repo('truemem', '2026-08-10T00:00:00Z')], onMissing)
    expect(joined.map((e) => e.repo)).toEqual(['truemem'])
    expect(onMissing).toHaveBeenCalledWith('stayput')
  })

  it('通知先を渡さなくても落ちない', () => {
    expect(joinFeatured(featured, [])).toEqual([])
  })
})
