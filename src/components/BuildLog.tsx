import { useState } from 'react'
import type { BuildLogCounts, BuildLogEntry, BuildLogProject } from '../types'

interface Props {
  entries: BuildLogEntry[]
}

const COUNT_LABELS: [keyof BuildLogCounts, string][] = [
  ['commits', 'Commit'],
  ['pullRequests', 'PR'],
  ['issues', 'Issue'],
  ['comments', 'Comment'],
  ['reviews', 'Review'],
]

export function BuildLog({ entries }: Props) {
  if (entries.length === 0) return null

  return (
    <section className="build-log" id="build-log">
      <div className="section-head">
        <h2 className="section-title">Build Log</h2>
        <p className="section-note">GitHub 上の事実を、読める制作記録へ</p>
      </div>
      <div className="build-log-entries">
        {entries.map((entry, index) => (
          <BuildLogWeek key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </section>
  )
}

function BuildLogWeek({ entry, index }: { entry: BuildLogEntry; index: number }) {
  const [selectedId, setSelectedId] = useState(entry.projects[0]?.id)
  const selected = entry.projects.find((project) => project.id === selectedId) ?? entry.projects[0]

  if (!selected) return null

  const maxActivity = Math.max(...entry.projects.map(totalActivity), 1)

  return (
    <article className="build-log-week" style={{ animationDelay: `${Math.min(index * 90, 450)}ms` }}>
      <header className="build-log-hero">
        <div className="build-log-copy">
          <p className="build-log-period">Weekly build log · {entry.period}</p>
          <h3 className="build-log-title">{entry.title}</h3>
          <p className="build-log-intro">{entry.intro}</p>
        </div>
        <dl className="build-log-metrics" aria-label={`${entry.period} の活動概要`}>
          {entry.metrics.map((metric) => (
            <div className="build-log-metric" key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="build-log-pulse-head">
        <h4>Project pulse</h4>
        <p>プロジェクトを選ぶと、課題と成果を確認できます</p>
      </div>

      <div className="build-log-workspace">
        <div className="build-log-projects" aria-label={`${entry.period} に取り組んだプロジェクト`}>
          {entry.projects.map((project) => {
            const activity = totalActivity(project)
            const width = Math.max(4, (activity / maxActivity) * 100)
            const isSelected = project.id === selected.id
            return (
              <button
                type="button"
                className="build-log-project"
                aria-pressed={isSelected}
                aria-label={`${project.title}、活動記録 ${activity} 件`}
                key={project.id}
                onClick={() => setSelectedId(project.id)}
              >
                <span className="build-log-project-name">{project.title}</span>
                <span className="build-log-bar" aria-hidden="true">
                  <span style={{ width: `${width}%` }} />
                </span>
                <span className="build-log-activity" aria-hidden="true">
                  {activity}
                </span>
              </button>
            )
          })}
        </div>

        <ProjectDetail project={selected} />
      </div>
    </article>
  )
}

function ProjectDetail({ project }: { project: BuildLogProject }) {
  const counts = COUNT_LABELS.flatMap(([key, label]) => {
    const value = project.counts[key]
    return value ? [{ label, value }] : []
  })

  return (
    <div className="build-log-detail" aria-live="polite">
      <div className="build-log-detail-head">
        <h4 className="build-log-detail-title">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener">
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h4>
        <span className={`badge ${project.isPrivate ? 'badge-private' : 'badge-public'}`}>
          {project.isPrivate ? 'Private' : 'Public'}
        </span>
      </div>
      <p className="build-log-tagline">{project.tagline}</p>
      <p className="build-log-story">{project.story}</p>

      <div className="build-log-result-grid">
        <div>
          <span className="build-log-result-label">Problem</span>
          <p>{project.problem}</p>
        </div>
        <div>
          <span className="build-log-result-label">Outcome</span>
          <p>{project.outcome}</p>
        </div>
      </div>

      <div className="build-log-evidence" aria-label="GitHub 上の活動件数">
        {counts.map(({ label, value }) => (
          <span key={label}>
            {label} <strong>{value}</strong>
          </span>
        ))}
        {project.isPrivate && <span className="build-log-private-note">ソース非公開</span>}
      </div>
    </div>
  )
}

function totalActivity(project: BuildLogProject): number {
  return Object.values(project.counts).reduce<number>((sum, value) => sum + (value ?? 0), 0)
}
