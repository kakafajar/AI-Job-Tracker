import { useApp } from '../context/AppContext'

export function TopHeader() {
  const { preferences, toggleMobileMenu } = useApp()

  const today = new Date()
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('id-ID', options)

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Hamburger Button (visible on mobile/tablet screens < 1024px) */}
        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={toggleMobileMenu}
          aria-label="Buka Menu Navigasi"
          title="Buka Menu Navigasi"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="welcome-title-group">
          <h1 className="welcome-title">Welcome Back,</h1>
          <span className="welcome-name">
            {preferences.targetRole ? preferences.targetRole.split(' ')[0] : 'Sujon'}
          </span>
        </div>
      </div>

      <div className="header-meta-actions">
        <div className="date-capsule">
          <svg className="date-capsule-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="date-text-full">{formattedDate} - Status Aktif</span>
          <span className="date-text-short">{formattedDate}</span>
        </div>
      </div>
    </header>
  )
}
