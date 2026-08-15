import { describe, expect, it } from 'vitest'
import { BUILD_LOG } from './buildLog'

describe('BUILD_LOG', () => {
  it('週とプロジェクトの識別子が重複しない', () => {
    const weekIds = BUILD_LOG.map((entry) => entry.id)
    expect(new Set(weekIds).size).toBe(weekIds.length)

    for (const entry of BUILD_LOG) {
      const projectIds = entry.projects.map((project) => project.id)
      expect(new Set(projectIds).size).toBe(projectIds.length)
    }
  })

  it('Private プロジェクトは外部 URL を持たない', () => {
    for (const entry of BUILD_LOG) {
      for (const project of entry.projects.filter((project) => project.isPrivate)) {
        expect(project.url).toBeUndefined()
      }
    }
  })

  it('Public プロジェクトの URL は本人の GitHub リポジトリだけを指す', () => {
    for (const entry of BUILD_LOG) {
      for (const project of entry.projects.filter((project) => !project.isPrivate)) {
        expect(project.url).toMatch(/^https:\/\/github\.com\/sugasaki\/[a-z0-9-]+$/)
      }
    }
  })

  it('初回ログは GitHub 集計と同じ12プロジェクトを含む', () => {
    expect(BUILD_LOG[0].projects).toHaveLength(12)
    expect(BUILD_LOG[0].metrics).toEqual([
      { value: 12, label: 'Projects' },
      { value: 186, label: 'Commits' },
      { value: 103, label: 'Pull requests' },
      { value: 96, label: 'Merged' },
    ])
  })
})
