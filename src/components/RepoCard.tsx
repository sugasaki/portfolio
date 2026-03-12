import type { Repo } from '../types'
import { LANG_COLORS } from '../constants'

interface Props {
  repo: Repo
  index: number
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`
  return `${Math.floor(diffDays / 365)}y ago`
}

export function RepoCard({ repo, index }: Props) {
  const color = LANG_COLORS[repo.language] ?? LANG_COLORS.Other
  const delay = Math.min(index * 30, 600)

  const Tag = repo.isPrivate ? 'div' : 'a'
  const linkProps = repo.isPrivate
    ? {}
    : { href: repo.url, target: '_blank' as const, rel: 'noopener' }

  return (
    <Tag
      className="repo-card"
      style={{ '--lang-color': color, animationDelay: `${delay}ms` } as React.CSSProperties}
      {...linkProps}
    >
      <div className="card-header">
        <span className="repo-name">{repo.name}</span>
        <div className="badges">
          <span className={`badge ${repo.isPrivate ? 'badge-private' : 'badge-public'}`}>
            {repo.isPrivate ? 'Private' : 'Public'}
          </span>
        </div>
      </div>
      {repo.description && <p className="repo-desc">{repo.description}</p>}
      <div className="repo-meta">
        <span className="meta-item">
          <span className="lang-dot" style={{ background: color }} />
          {repo.language}
        </span>
        {repo.stars > 0 && (
          <span className="meta-item">
            <span className="star-icon">★</span> {repo.stars}
          </span>
        )}
        <span className="meta-item">{formatDate(repo.updatedAt)}</span>
      </div>
    </Tag>
  )
}
