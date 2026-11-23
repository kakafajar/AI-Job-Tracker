import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    cvFile,
    extractedProfile,
    trackedJobs,
    resetFlow,
    isSidebarExpanded,
    toggleSidebarExpanded,
    isMobileMenuOpen,
    closeMobileMenu
  } = useApp()

  const hasCv = Boolean(cvFile && extractedProfile)

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen, closeMobileMenu])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* ======================================================== */}
      {/* 1. DESKTOP FLOATING SIDEBAR (Icon-only or Expanded)       */}
      {/* ======================================================== */}
      <aside
        className={`sidebar-container ${isSidebarExpanded ? 'expanded' : ''}`}
        aria-label="Menu Navigasi Samping"
      >
        {/* Toggle Expand / Collapse Button on top of Sidebar */}
        <div className="sidebar-island toggle-island">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={toggleSidebarExpanded}
            title={isSidebarExpanded ? 'Sembunyikan Label Menu' : 'Tampilkan Label Menu'}
            aria-label={isSidebarExpanded ? 'Sembunyikan Label Menu' : 'Tampilkan Label Menu'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {isSidebarExpanded && (
              <span className="sidebar-brand-name">Menu</span>
            )}
          </button>
        </div>

        {/* Top Floating Island */}
        <div className="sidebar-island">
          {/* Dashboard */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
            title="Dashboard Ringkasan"
            aria-label="Dashboard Ringkasan"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Dashboard</span>}
          </button>

          {/* Career Preferences */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveView('preferences')}
            title="Preferensi Pekerjaan"
            aria-label="Preferensi Pekerjaan"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Preferensi</span>}
          </button>

          {/* Upload CV */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveView('upload')}
            title="Unggah Dokumen CV"
            aria-label="Unggah Dokumen CV"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Unggah CV</span>}
          </button>

          {/* Profile Review - Terkunci jika CV belum diunggah & dianalisis */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'review' ? 'active' : ''}`}
            onClick={() => {
              if (!hasCv) {
                setActiveView('upload')
              } else {
                setActiveView('review')
              }
            }}
            title={hasCv ? 'Tinjau Profil & Keahlian' : 'Kunci: Unggah CV terlebih dahulu'}
            aria-label="Tinjau Profil & Keahlian"
            style={{ opacity: !hasCv ? 0.5 : 1, cursor: !hasCv ? 'not-allowed' : 'pointer' }}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {isSidebarExpanded && (
              <span className="sidebar-btn-label">
                Tinjau Profil {!hasCv && '🔒'}
              </span>
            )}
          </button>
        </div>

        {/* Middle Floating Island */}
        <div className="sidebar-island">
          {/* Recommendations - Terkunci jika CV belum diunggah & dianalisis */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'recommendations' ? 'active' : ''}`}
            onClick={() => {
              if (!hasCv) {
                setActiveView('upload')
              } else {
                setActiveView('recommendations')
              }
            }}
            title={hasCv ? 'Rekomendasi Lowongan Kerja' : 'Kunci: Unggah CV terlebih dahulu'}
            aria-label="Rekomendasi Lowongan Kerja"
            style={{ opacity: !hasCv ? 0.5 : 1, cursor: !hasCv ? 'not-allowed' : 'pointer' }}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {isSidebarExpanded && (
              <span className="sidebar-btn-label">
                Rekomendasi {!hasCv && '🔒'}
              </span>
            )}
          </button>

          {/* Job Tracker */}
          <button
            type="button"
            className={`sidebar-btn ${activeView === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveView('tracker')}
            title="Job Tracker (Pelacakan Lamaran)"
            aria-label="Job Tracker"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Job Tracker</span>}
            {trackedJobs.length > 0 && (
              <span className="sidebar-btn-badge" aria-hidden="true">
                {trackedJobs.length}
              </span>
            )}
          </button>
        </div>

        {/* Bottom Floating Island */}
        <div className="sidebar-island">
          {/* Reset search */}
          <button
            type="button"
            className="sidebar-btn"
            onClick={resetFlow}
            title="Mulai Ulang Pencarian Baru"
            aria-label="Mulai Ulang Pencarian Baru"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="1 4 1 10 7 10" />
              <polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Mulai Ulang</span>}
          </button>

          {/* About / Info */}
          <button
            type="button"
            className="sidebar-btn"
            onClick={() => setActiveView('dashboard')}
            title="Informasi AI Job Tracker"
            aria-label="Informasi AI Job Tracker"
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            {isSidebarExpanded && <span className="sidebar-btn-label">Info Aplikasi</span>}
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE OVERLAY DRAWER (Muncul saat Hamburger diklik)   */}
      {/* ======================================================== */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`mobile-drawer-sheet ${isMobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Navigasi Mobile"
      >
        <div className="mobile-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              JT
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>
                AI Job Tracker
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                CV Analyzer & Monitor
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={closeMobileMenu}
            aria-label="Tutup Menu"
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <div className="mobile-nav-group-title">Menu Utama</div>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="3" width="7" height="7" rx="2" />
              <rect x="14" y="14" width="7" height="7" rx="2" />
              <rect x="3" y="14" width="7" height="7" rx="2" />
            </svg>
            <span>Dashboard Ringkasan</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveView('preferences')}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Preferensi Kerja</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveView('upload')}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 12 15 15" />
            </svg>
            <span>Unggah CV</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'review' ? 'active' : ''}`}
            onClick={() => {
              if (!hasCv) {
                setActiveView('upload')
              } else {
                setActiveView('review')
              }
            }}
            style={{ opacity: !hasCv ? 0.5 : 1 }}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Tinjau Profil {!hasCv && '(Kunci: Isi CV Dulu)'}</span>
          </button>

          <div className="mobile-nav-group-title" style={{ marginTop: '16px' }}>Pencarian & Pelacakan</div>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'recommendations' ? 'active' : ''}`}
            onClick={() => {
              if (!hasCv) {
                setActiveView('upload')
              } else {
                setActiveView('recommendations')
              }
            }}
            style={{ opacity: !hasCv ? 0.5 : 1 }}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Rekomendasi Lowongan {!hasCv && '(Kunci: Isi CV Dulu)'}</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-link ${activeView === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveView('tracker')}
          >
            <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span style={{ flex: 1, textAlign: 'left' }}>Job Tracker</span>
            {trackedJobs.length > 0 && (
              <span className="badge-count" style={{ marginLeft: 'auto' }}>
                {trackedJobs.length}
              </span>
            )}
          </button>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
              onClick={resetFlow}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <polyline points="23 20 23 14 17 14" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              <span>Mulai Ulang Pencarian</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
