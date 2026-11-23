import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { DEMO_JOBS } from '../data/demoJobs'
import { jobService } from '../services/jobService'

export function DashboardOverview() {
  const { currentUser, preferences, cvFile, trackedJobs, setActiveView } = useApp()
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [backendJobs, setBackendJobs] = useState([])
  const [isBackendConnected, setIsBackendConnected] = useState(false)

  // Ambil data lowongan sinkron dari database Laravel
  useEffect(() => {
    let isMounted = true
    const fetchDashboardJobs = async () => {
      try {
        const res = await jobService.getRecommendedJobs()
        if (isMounted && res && res.jobs) {
          setBackendJobs(res.jobs)
          setIsBackendConnected(Boolean(res.isBackendConnected))
        }
      } catch {
        // Fallback otomatis tertangani
      }
    }

    fetchDashboardJobs()
    return () => { isMounted = false }
  }, [])

  // Sample activity data for the custom rounded bar chart
  const monthlyChartData = [
    { label: 'JAN', height: '45%', active: false },
    { label: 'FEB', height: '65%', active: false },
    { label: 'MAR', height: '55%', active: false },
    { label: 'APR', height: '90%', active: true, badge: '+17.8%' },
    { label: 'MEI', height: '70%', active: false },
    { label: 'JUN', height: '80%', active: false }
  ]

  const weeklyChartData = [
    { label: 'SEN', height: '35%', active: false },
    { label: 'SEL', height: '50%', active: false },
    { label: 'RAB', height: '85%', active: true, badge: '+12.4%' },
    { label: 'KAM', height: '60%', active: false },
    { label: 'JUM', height: '75%', active: false },
    { label: 'SAB', height: '40%', active: false }
  ]

  const activeChart = chartPeriod === 'monthly' ? monthlyChartData : weeklyChartData

  // Tampilkan data lowongan dari database atau tracker
  const displayedRecentJobs = trackedJobs.length > 0
    ? trackedJobs.slice(0, 4)
    : (backendJobs.length > 0 ? backendJobs.slice(0, 4) : DEMO_JOBS.slice(0, 4))

  // Data profil user tersinkron dari Database Onboarding
  const targetRole = currentUser?.profile?.target_role || preferences.targetRole || 'Frontend React Developer'
  const workType = currentUser?.profile?.work_type || preferences.workType || 'Remote'
  const cvDocName = cvFile?.name || currentUser?.profile?.cv_path || null
  const userName = currentUser?.name || 'Fajar'

  // Company avatar color generator for modern look
  const getAvatarBg = (index) => {
    const colors = [
      { bg: '#fce7f3', text: '#db2777' }, // Pink vibe
      { bg: '#e0f2fe', text: '#0284c7' }, // Blue vibe
      { bg: '#fef3c7', text: '#d97706' }, // Amber vibe
      { bg: '#e8f5ee', text: '#0f764a' }  // Green vibe
    ]
    return colors[index % colors.length]
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Grid: Left Green Card + Right Chart Card */}
      <section className="dashboard-grid-top" aria-label="Ringkasan Target dan Aktivitas">
        {/* Left Card: Career Target & CV Status */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Target Karier & CV</h2>
              <p className="dash-card-subtitle">Profil tersinkron dengan database</p>
            </div>

            <button
              type="button"
              className="card-arrow-btn"
              onClick={() => setActiveView('preferences')}
              title="Ubah Preferensi Karier"
              aria-label="Ubah Preferensi Karier"
            >
              ↗
            </button>
          </div>

          {/* Signature Emerald Green Card matching the reference */}
          <div className="visa-style-card">
            <div className="card-top-row">
              <span className="card-brand-logo">AI TRACKER</span>
              <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>{userName}</span>
            </div>

            <span className="card-label-small">Posisi yang Ditargetkan</span>
            <div className="card-target-role">
              {targetRole}
            </div>

            <div className="card-footer-row">
              <div>
                <span style={{ fontSize: '10px', opacity: 0.8, display: 'block' }}>DOKUMEN CV</span>
                {cvDocName ? (
                  <span title={cvDocName}>
                    {cvDocName.length > 20 ? cvDocName.slice(0, 18) + '...' : cvDocName}
                  </span>
                ) : (
                  <span
                    onClick={() => setActiveView('upload')}
                    style={{ textDecoration: 'underline', cursor: 'pointer', opacity: 0.95 }}
                    title="Klik untuk mengunggah CV"
                  >
                    Belum Diunggah
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', opacity: 0.8, display: 'block' }}>TIPE KERJA</span>
                <span>{workType.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Sub-row stat below Green Card */}
          <div className="stat-subrow">
            <div>
              <span className="stat-subrow-title">Total Lowongan Terpantau</span>
              <div className="stat-subrow-val">
                {trackedJobs.length} Posisi Disimpan
              </div>
            </div>

            <div className="growth-pill">
              +12.8%
            </div>
          </div>
        </div>

        {/* Right Card: Engagement & Match Rate Bar Chart */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h2 className="dash-card-title">Tingkat Aktivitas & Lamaran</h2>
              <p className="dash-card-subtitle">Estimasi volume lowongan & interaksi seleksi</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Period toggle pills matching reference */}
              <div className="pill-toggle-container" role="radiogroup" aria-label="Periode Grafik">
                <button
                  type="button"
                  className={`pill-toggle-btn ${chartPeriod === 'weekly' ? 'active' : ''}`}
                  onClick={() => setChartPeriod('weekly')}
                >
                  Mingguan
                </button>
                <button
                  type="button"
                  className={`pill-toggle-btn ${chartPeriod === 'monthly' ? 'active' : ''}`}
                  onClick={() => setChartPeriod('monthly')}
                >
                  Bulanan
                </button>
              </div>

              <button
                type="button"
                className="card-arrow-btn"
                onClick={() => setActiveView('recommendations')}
                title="Buka Rekomendasi Lowongan"
                aria-label="Buka Rekomendasi Lowongan"
              >
                ↗
              </button>
            </div>
          </div>

          {/* Custom Rounded Bar Chart Area */}
          <div className="bar-chart-container">
            <div className="bar-chart-area">
              {activeChart.map((col, idx) => (
                <div key={idx} className="bar-col">
                  {col.active && col.badge && (
                    <div className="bar-badge-popup">
                      {col.badge}
                    </div>
                  )}
                  <div
                    className={`bar-pill ${col.active ? 'active' : ''}`}
                    style={{ height: col.height }}
                  />
                  <span className="bar-label">{col.label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '12px', color: 'var(--color-text-subtle)' }}>
              <span>Skor kecocokan profil CV rata-rata: <strong>89%</strong></span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Tinggi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Wide Card: Recent Job Tracker Table matching reference */}
      <section className="dash-card" aria-label="Pelacakan Lamaran Terkini">
        <div className="dash-card-header">
          <div>
            <h2 className="dash-card-title">Riwayat & Rekomendasi Lowongan</h2>
            <p className="dash-card-subtitle">
              {trackedJobs.length > 0
                ? `${trackedJobs.length} lowongan tersimpan di Job Tracker`
                : (isBackendConnected
                  ? 'Sinkron langsung dari database backend Laravel'
                  : 'Menampilkan data lowongan rekomendasi aktif')}
            </p>
          </div>

          <button
            type="button"
            className="card-arrow-btn"
            onClick={() => setActiveView('recommendations')}
            title="Buka Rekomendasi Lowongan Lengkap"
            aria-label="Buka Rekomendasi Lowongan Lengkap"
          >
            ↗
          </button>
        </div>

        {/* Table Container matching reference layout */}
        <div className="dash-table-container">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Posisi & Perusahaan</th>
                <th>Tanggal</th>
                <th>Tipe Kerja</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Kecocokan</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecentJobs.map((job, idx) => {
                const avatarStyle = getAvatarBg(idx)
                const currentStatus = job.status || 'Tersedia'
                const displayDate = job.postedDate || 'Baru saja'

                return (
                  <tr key={job.id || idx}>
                    <td>
                      <div className="table-company-cell">
                        <div
                          className="company-avatar"
                          style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
                          aria-hidden="true"
                        >
                          {job.company ? job.company.charAt(0) : 'J'}
                        </div>
                        <div className="company-title-wrap">
                          <span className="company-role-name">{job.title}</span>
                          <span className="company-name-sub">{job.company}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ color: 'var(--color-text-muted)' }}>
                      {displayDate}
                    </td>

                    <td>
                      <span className="status-badge badge-worktype">
                        {job.workType || 'Remote'}
                      </span>
                    </td>

                    <td>
                      <div className="status-dot-cell">
                        <span className="status-dot" aria-hidden="true" />
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                          {currentStatus}
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {job.matchScore || 85}% Cocok
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA within card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-subtle)' }}>
            {!cvDocName
              ? 'Anda belum mengunggah dokumen CV untuk analisis kecocokan mendalam.'
              : 'Profil dan CV Anda siap untuk dicocokkan dengan lowongan kerja baru.'}
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setActiveView('upload')}
            >
              {cvDocName ? 'Unggah CV Baru' : 'Unggah CV Sekarang'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => setActiveView('recommendations')}
            >
              Cari Rekomendasi Lowongan →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
