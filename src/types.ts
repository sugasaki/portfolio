export interface ReposFile {
  /** データ取得日時 (ISO8601, UTC)。フッターの「最終更新」表示に使う */
  generatedAt: string
  repos: RawRepo[]
}

export interface RawRepo {
  name: string
  description: string | null
  url: string
  isPrivate: boolean
  primaryLanguage: { name: string } | null
  stargazerCount: number
  updatedAt: string
  repositoryTopics: { nodes: { topic: { name: string } }[] }
}

export interface Repo {
  name: string
  description: string | null
  url: string
  isPrivate: boolean
  language: string
  stars: number
  updatedAt: string
  topics: string[]
}

export type VisibilityFilter = 'all' | 'public' | 'private'
export type SortOrder = 'desc' | 'asc'
