import { useState, useMemo } from 'react'
import { useApp, TRACKING_STATUSES } from '../context/AppContext'
import { JobCard } from '../components/JobCard'

export function JobTrackerPage() {
  const { trackedJobs, setActiveView, trackJob } = useApp()
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Semua')

  // Optional manual job addition modal or toggle
  const [showAddModal, setShowAddModal] = useState(false)
  const [manualTitle, setManualTitle] = useState('')
  const [manualCompany, setManualCompany] = useState('')
  const [manualLocation, setManualLocation] = useState('')
  const [manualWorkType, setManualWorkType] = useState('Remote')
  const [manualSourceUrl, setManualSourceUrl] = useState('')
  const [manualError, setManualError] = useState('')

  // Calculate real counts per status from local state
  const statusCounts = useMemo(() => {
    const counts = {
      Semua: trackedJobs.length,
      Disimpan: 0,
      'Sudah Melamar': 0,
      Wawancara: 0,
      Diterima: 0,
      Ditolak: 0
    }

    trackedJobs.forEach((job) => {
      const s = job.status || 'Disimpan'
      if (counts[s] !== undefined) {
        counts[s] += 1
      }
    })

    return counts
  }, [trackedJobs])

  // Filtered jobs by status
  const filteredJobs = useMemo(() => {
    if (selectedStatusFilter === 'Semua') {
      return trackedJobs
    }
    return trackedJobs.filter((job) => job.status === selectedStatusFilter)
  }, [trackedJobs, selectedStatusFilter])

  // Handle manual job tracking
  const handleAddManualJob = (e) => {
    e.preventDefault()
    if (!manualTitle.trim() || !manualCompany.trim()) {
      setManualError('Judul posisi dan nama perusahaan wajib diisi.')
      return
    }

    const newJob = {
      id: `manual-job-${Date.now()}`,
      isDemo: false,
      title: manualTitle.trim(),
      company: manualCompany.trim(),
      location: manualLocation.trim() || 'Indonesia',
      workType: manualWorkType,
      jobType: 'Full-time',
      matchScore: 90,
      matchReason: 'Lowongan yang ditambahkan secara manual oleh pengguna.',
      matchedSkills: ['Keahlian Relevan'],
      source: 'Input Manual',
      sourceUrl: manualSourceUrl.trim() || '#',
      postedDate: 'Baru saja'
    }

    trackJob(newJob, 'Disimpan')

    // Reset form
    setManualTitle('')
    setManualCompany('')
    setManualLocation('')
    setManualSourceUrl('')
    setManualError('')
    setShowAddModal(false)
  }

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
            Job Tracker
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
            Pantau dan kelola seluruh perkembangan proses lamaran kerja Anda secara terpusat.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAddModal(!showAddModal)}
          >
            {showAddModal ? 'Tutup Form Manual' : '+ Tambah Lowongan Manual'}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveView('preferences')}
          >
            Cari Lowongan dari CV
          </button>
        </div>
      </div>

      {/* Manual job creation drawer/form */}
      {showAddModal && (
        <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--color-primary-border)' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px' }}>
            Tambah Lowongan Kerja Manual
          </h2>

          {manualError && (
            <div className="info-banner info-banner-danger" style={{ marginBottom: '14px' }}>
              <span>⚠️</span>
              <span>{manualError}</span>
            </div>
          )}

          <form onSubmit={handleAddManualJob}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" htmlFor="manual-title">
                  Posisi Pekerjaan <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  id="manual-title"
                  type="text"
                  className="input-text"
                  placeholder="Contoh: Frontend React Engineer"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" htmlFor="manual-company">
                  Nama Perusahaan <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  id="manual-company"
                  type="text"
                  className="input-text"
                  placeholder="Contoh: PT Teknologi Bangsa"
                  value={manualCompany}
                  onChange={(e) => setManualCompany(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" htmlFor="manual-location">
                  Lokasi
                </label>
                <input
                  id="manual-location"
                  type="text"
                  className="input-text"
                  placeholder="Contoh: Jakarta / Remote"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" htmlFor="manual-worktype">
                  Tipe Kerja
                </label>
                <select
                  id="manual-worktype"
                  className="input-select"
                  value={manualWorkType}
                  onChange={(e) => setManualWorkType(e.target.value)}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="manual-url">
                Tautan Sumber Lowongan
              </label>
              <input
                id="manual-url"
                type="url"
                className="input-text"
                placeholder="https://..."
                value={manualSourceUrl}
                onChange={(e) => setManualSourceUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Batal
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                Simpan ke Tracker
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Real Status Metrics Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--color-border)'
        }}
        role="tablist"
        aria-label="Filter status lowongan"
      >
        {['Semua', ...TRACKING_STATUSES].map((status) => {
          const isSelected = selectedStatusFilter === status
          const count = statusCounts[status] || 0

          return (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`nav-link-btn ${isSelected ? 'active' : ''}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                minHeight: '38px',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setSelectedStatusFilter(status)}
            >
              <span>{status}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  padding: '0 5px',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  color: isSelected ? 'var(--color-primary-contrast)' : 'var(--color-text-muted)',
                  fontWeight: 700
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Empty State: No jobs saved at all */}
      {trackedJobs.length === 0 ? (
        <div className="state-box">
          <div style={{ fontSize: '42px' }} aria-hidden="true">📋</div>
          <div>
            <h2 className="state-title">Belum Ada Lowongan di Job Tracker</h2>
            <p className="state-desc">
              Anda belum menyimpan lowongan kerja apa pun. Cari rekomendasi lowongan berdasarkan preferensi dan CV Anda untuk mulai memantau.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveView('preferences')}
          >
            Cari Lowongan dari CV
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* Empty State: No jobs matching selected status filter */
        <div className="state-box">
          <div style={{ fontSize: '36px' }} aria-hidden="true">🔍</div>
          <div>
            <h2 className="state-title">Tidak Ada Lowongan Berstatus "{selectedStatusFilter}"</h2>
            <p className="state-desc">
              Saat ini belum ada data lowongan kerja dengan status tersebut.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSelectedStatusFilter('Semua')}
          >
            Tampilkan Semua Status ({trackedJobs.length})
          </button>
        </div>
      ) : (
        /* Tracked Job Cards List */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} isTrackerView={true} />
          ))}
        </div>
      )}
    </div>
  )
}
