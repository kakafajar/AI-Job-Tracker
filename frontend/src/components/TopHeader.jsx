import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export function TopHeader() {
  const { currentUser, preferences, cvFile, extractedProfile, toggleMobileMenu, setActiveView, activeView, logoutUser } = useApp()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const menuRef = useRef(null)

  const today = new Date()
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const formattedDate = today.toLocaleDateString('id-ID', options)

  const userName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : (preferences.targetRole ? preferences.targetRole.split(' ')[0] : 'Sujon')

  const userProfile = currentUser?.profile || {}
  const targetRole = userProfile.target_role || preferences.targetRole || 'Belum ditentukan'
  const workType = userProfile.work_type || preferences.workType || 'Remote'
  const location = userProfile.location || preferences.location || 'Semua Lokasi'
  const skills = userProfile.skills && userProfile.skills.length > 0
    ? userProfile.skills
    : (extractedProfile?.skills || ['React', 'JavaScript', 'Tailwind CSS'])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Top Navbar above Welcome Back - Sticky at Top */}
      <nav className="top-navbar" aria-label="Navigasi Utama Atas">
        <div className="navbar-left">
          {/* Mobile Hamburger Button (< 1024px) */}
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
        </div>

        <div className="navbar-right">
          {/* Date Capsule */}
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

          {/* Profile Button in Top Right Navbar */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              type="button"
              className="profile-navbar-btn"
              onClick={() => setShowDropdown((prev) => !prev)}
              aria-label={`Profil Pengguna ${userName}`}
              aria-expanded={showDropdown}
              title="Buka Profil Pengguna"
            >
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-circle">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="profile-status-indicator" aria-label="Status Online" />
              </div>
              <span className="profile-navbar-name">{userName}</span>
            </button>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
                  border: '1px solid var(--color-border)',
                  padding: '8px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)', margin: 0 }}>
                    {currentUser?.name || userName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-subtle)', margin: '2px 0 0' }}>
                    {currentUser?.email || 'kandidat@example.com'}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-light)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    {targetRole}
                  </span>
                </div>

                {/* Buka Modal Profil Lengkap */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false)
                    setShowProfileModal(true)
                  }}
                  className="btn btn-sm btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', textAlign: 'left', fontSize: '13px', padding: '9px 12px' }}
                >
                  Lihat Profil Saya
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false)
                    setActiveView('preferences')
                  }}
                  className="btn btn-sm btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', textAlign: 'left', fontSize: '13px', padding: '9px 12px' }}
                >
                  Ubah Preferensi Kerja
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false)
                    logoutUser()
                  }}
                  className="btn btn-sm btn-danger-outline"
                  style={{ width: '100%', justifyContent: 'flex-start', fontSize: '13px', padding: '9px 12px' }}
                >
                  Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Welcome Back Greeting Row - Hanya tampil di halaman Dashboard */}
      {activeView === 'dashboard' && (
        <div className="welcome-greeting-row">
          <div className="welcome-title-group">
            <h1 className="welcome-title">Welcome Back,</h1>
            <span className="welcome-name">{userName}</span>
          </div>
        </div>
      )}

      {/* Modal Profil Pengguna Lengkap */}
      {showProfileModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 26, 18, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '28px',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #15803d 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 700
                  }}
                >
                  {userName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                    {currentUser?.name || userName}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    {currentUser?.email || 'kandidat@example.com'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setShowProfileModal(false)}
                style={{ padding: '6px 10px', minHeight: 'auto' }}
              >
                ✕
              </button>
            </div>

            {/* User Profile Details from Database */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                  Target Karier di Database
                </span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary)', margin: '4px 0 0' }}>
                  {targetRole}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px 14px', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                    Tipe Kerja
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>
                    {workType}
                  </p>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--color-surface-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                    Lokasi Preferensi
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0 0' }}>
                    {location}
                  </p>
                </div>
              </div>

              {/* Skills from Database */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '8px' }}>
                  Keahlian Utama (Database Profil)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {skills.map((s) => (
                    <span key={s} className="skill-tag" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* CV Status */}
              <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
                    Status Dokumen CV
                  </span>
                  <p style={{ fontSize: '13px', fontWeight: 600, margin: '2px 0 0', color: (cvFile || userProfile.cv_path) ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {cvFile ? cvFile.name : (userProfile.cv_path || 'Belum mengunggah CV')}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setShowProfileModal(false)
                    setActiveView('upload')
                  }}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  {cvFile || userProfile.cv_path ? 'Ganti CV' : 'Unggah CV'}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setShowProfileModal(false)
                  setActiveView('preferences')
                }}
              >
                Ubah Preferensi
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={() => {
                  setShowProfileModal(false)
                  logoutUser()
                }}
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
