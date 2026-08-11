import { Fragment } from 'react'
import { useRepos } from './hooks/useRepos'
import { Header } from './components/Header'
import { Featured } from './components/Featured'
import { Controls } from './components/Controls'
import { RepoCard } from './components/RepoCard'

export default function App() {
  const {
    repos,
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
  } = useRepos()

  return (
    <>
      <div className="ambient" />
      <Header stats={stats} />
      <Featured entries={featured} />
      <div className="section-head archive-head">
        <h2 className="section-title">All Repositories</h2>
        <p className="section-note">GitHub 上の全リポジトリ。振り返りと検索のための一覧</p>
      </div>
      <Controls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        langCounts={langCounts}
        activeLang={activeLang}
        onLangChange={setActiveLang}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        resultCount={repos.length}
        totalCount={stats.total}
      />
      <main className="grid-wrapper">
        <div className="repo-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="repo-card skeleton-card">
                <div className="skeleton" style={{ width: '60%', height: 16 }} />
                <div className="skeleton" style={{ width: '90%', height: 12, marginTop: 12 }} />
                <div className="skeleton" style={{ width: '40%', height: 12, marginTop: 12 }} />
              </div>
            ))
          ) : repos.length === 0 ? (
            <div className="empty-state">
              <p>No repositories match the current filters.</p>
            </div>
          ) : (
            groups.map((group, gi) => (
              <Fragment key={group.year}>
                <div className="year-row">
                  <span className="year-label">{group.year}</span>
                  <span className="year-count">{group.repos.length}</span>
                </div>
                {group.repos.map((repo, i) => (
                  <RepoCard key={repo.name} repo={repo} index={gi === 0 ? i : 0} />
                ))}
              </Fragment>
            ))
          )}
        </div>
      </main>
      <footer>
        <p>
          Built with data from{' '}
          <a href="https://github.com/sugasaki" target="_blank" rel="noopener">
            github.com/sugasaki
          </a>
          {generatedAt && ` — Last updated ${new Date(generatedAt).toLocaleDateString('ja-JP')}`}
        </p>
      </footer>
    </>
  )
}
