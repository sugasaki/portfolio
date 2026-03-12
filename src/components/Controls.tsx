import { useEffect, useRef } from 'react'
import type { VisibilityFilter, SortOrder } from '../types'

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  langCounts: [string, number][]
  activeLang: string
  onLangChange: (lang: string) => void
  visibility: VisibilityFilter
  onVisibilityChange: (v: VisibilityFilter) => void
  sortOrder: SortOrder
  onSortChange: (s: SortOrder) => void
  resultCount: number
  totalCount: number
}

export function Controls({
  searchQuery,
  onSearchChange,
  langCounts,
  activeLang,
  onLangChange,
  visibility,
  onVisibilityChange,
  sortOrder,
  onSortChange,
  resultCount,
  totalCount,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <nav className="controls">
      <div className="controls-inner">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <button
            className={`filter-btn ${activeLang === 'all' ? 'active' : ''}`}
            onClick={() => onLangChange('all')}
          >
            All<span className="count">{totalCount}</span>
          </button>
          {langCounts.map(([lang, count]) => (
            <button
              key={lang}
              className={`filter-btn ${activeLang === lang ? 'active' : ''}`}
              onClick={() => onLangChange(lang)}
            >
              {lang}<span className="count">{count}</span>
            </button>
          ))}
        </div>

        <div className="visibility-toggle">
          {(['all', 'public', 'private'] as VisibilityFilter[]).map((v) => (
            <button
              key={v}
              className={`vis-btn ${visibility === v ? 'active' : ''}`}
              onClick={() => onVisibilityChange(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="sort-btn"
          onClick={() => onSortChange(sortOrder === 'desc' ? 'asc' : 'desc')}
          title="Toggle sort order"
        >
          <span>Updated</span>
          <svg width={12} height={12} viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1L10 5H2L6 1ZM6 11L2 7H10L6 11Z" opacity={0.4} />
            <path d={sortOrder === 'desc' ? 'M6 1L10 5H2L6 1Z' : 'M6 11L2 7H10L6 11Z'} />
          </svg>
        </button>

        <span className="result-count">{resultCount} repos</span>
      </div>
    </nav>
  )
}
