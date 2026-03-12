import { useRepos } from './hooks/useRepos'
import { Header } from './components/Header'
import { Controls } from './components/Controls'
import { RepoCard } from './components/RepoCard'

export default function App() {
  const {
    repos,
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
  } = useRepos()

  return (
    <>
      <div className="ambient" />
      <Header stats={stats} />
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
            repos.map((repo, i) => (
              <RepoCard key={repo.name} repo={repo} index={i} />
            ))
          )}
        </div>
      </main>
      <footer>
        <p>
          Built with data from{' '}
          <a href="https://github.com/sugasaki" target="_blank" rel="noopener">
            github.com/sugasaki
          </a>{' '}
          — Last updated {new Date().toLocaleDateString('ja-JP')}
        </p>
      </footer>
    </>
  )
}
