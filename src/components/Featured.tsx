import type { Repo } from '../types'
import type { FeaturedProject } from '../data/featured'
import { LANG_COLORS } from '../constants'

export interface FeaturedEntry extends FeaturedProject {
  /** repos.json 側から結合したメタ情報 */
  meta: Repo
}

interface Props {
  entries: FeaturedEntry[]
}

export function Featured({ entries }: Props) {
  if (entries.length === 0) return null

  return (
    <section className="featured" id="featured">
      <div className="section-head">
        <h2 className="section-title">Selected Work</h2>
        <p className="section-note">手を動かした期間が長く、説明する価値のあるものを選んでいる</p>
      </div>
      <div className="featured-grid">
        {entries.map((entry, i) => (
          <FeaturedCard key={entry.repo} entry={entry} index={i} lead={i === 0} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({
  entry,
  index,
  lead,
}: {
  entry: FeaturedEntry
  index: number
  lead: boolean
}) {
  const { meta } = entry
  const color = LANG_COLORS[meta.language] ?? LANG_COLORS.Other
  const isLinkable = !meta.isPrivate || Boolean(entry.liveUrl)
  const href = entry.liveUrl ?? (meta.isPrivate ? undefined : meta.url)

  return (
    <article
      className={`featured-card${lead ? ' featured-lead' : ''}`}
      style={{ '--lang-color': color, animationDelay: `${Math.min(index * 80, 480)}ms` } as React.CSSProperties}
    >
      <div className={`shot${entry.shot ? '' : ' shot-empty'}`}>
        {entry.shot ? (
          <img
            src={`${import.meta.env.BASE_URL}shots/${entry.shot}`}
            alt={`${entry.title} の画面`}
            loading="lazy"
          />
        ) : (
          <div className="shot-fallback" aria-hidden="true">
            <span className="shot-initial">{entry.title.slice(0, 1)}</span>
          </div>
        )}
        <span className="shot-index">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="featured-body">
        <div className="featured-head">
          <h3 className="featured-title">
            {href ? (
              <a href={href} target="_blank" rel="noopener">
                {entry.title}
              </a>
            ) : (
              entry.title
            )}
          </h3>
          <span className={`badge ${meta.isPrivate ? 'badge-private' : 'badge-public'}`}>
            {meta.isPrivate ? 'Private' : 'Public'}
          </span>
        </div>

        <p className="featured-tagline">{entry.tagline}</p>
        <p className="featured-story">{entry.story}</p>

        <ul className="tech-list">
          {entry.tech.map((t) => (
            <li key={t} className="tech-chip">
              {t}
            </li>
          ))}
        </ul>

        <div className="featured-foot">
          <span className="meta-item">
            <span className="lang-dot" style={{ background: color }} />
            {meta.language}
          </span>
          <span className="repo-slug">{meta.name}</span>
          {!isLinkable && <span className="featured-note">ソース非公開</span>}
        </div>
      </div>
    </article>
  )
}
