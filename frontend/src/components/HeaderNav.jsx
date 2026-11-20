import { useApp } from '../context/AppContext'

export function HeaderNav() {
  const { activeView, setActiveView, trackedJobs } = useApp()

  const isFunnelView = [
    'preferences',
    'upload',
    'review',
    'recommendations'
  ].includes(activeView)

  return (
    <header className="site-header">
      <div className="header-container">
        <button
          type="button"
          className="brand-button"
          onClick={() => setActiveView('landing')}
          aria-label="Kembali ke halaman utama AI Job Tracker"
        >
          <div className="brand-icon" aria-hidden="true">
            JT
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">AI Job Tracker</span>
            <span className="brand-subtitle">CV Analyzer & Job Monitor</span>
          </div>
        </button>

        <nav className="header-nav" aria-label="Navigasi Utama">
          <button
            type="button"
            className={`nav-link-btn ${activeView === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveView('landing')}
          >
            Beranda
          </button>

          <button
            type="button"
            className={`nav-link-btn ${isFunnelView ? 'active' : ''}`}
            onClick={() => {
              if (activeView === 'landing' || activeView === 'tracker') {
                setActiveView('preferences')
              }
            }}
          >
            Cari Lowongan
          </button>

          <button
            type="button"
            className={`nav-link-btn ${activeView === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveView('tracker')}
          >
            Job Tracker
            {trackedJobs.length > 0 && (
              <span className="badge-count" aria-label={`${trackedJobs.length} lowongan tersimpan`}>
                {trackedJobs.length}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
