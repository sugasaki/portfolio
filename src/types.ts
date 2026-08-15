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

export interface BuildLogCounts {
  commits?: number
  pullRequests?: number
  issues?: number
  comments?: number
  reviews?: number
}

export interface BuildLogProject {
  /** 週次ログ内だけで使う安定した識別子 */
  id: string
  /** 公開向けの作品名。Private リポジトリはリポジトリ名と同じでなくてよい */
  title: string
  /** Public リポジトリだけ指定できる。Private では必ず省略する */
  url?: string
  isPrivate: boolean
  tagline: string
  story: string
  problem: string
  outcome: string
  counts: BuildLogCounts
}

export interface BuildLogMetric {
  value: number
  label: string
}

export interface BuildLogEntry {
  id: string
  period: string
  title: string
  intro: string
  metrics: BuildLogMetric[]
  projects: BuildLogProject[]
}
