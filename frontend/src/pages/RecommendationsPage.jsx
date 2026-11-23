import { useEffect, useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { StepProgress } from '../components/StepProgress'
import { JobCard } from '../components/JobCard'
import { jobService } from '../services/jobService'

export function RecommendationsPage() {
  const { preferences, cvFile, extractedProfile, setActiveView } = useApp()

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [jobs, setJobs] = useState([])

  // Filters state
  const [locationFilter, setLocationFilter] = useState(preferences.location || '')
  const [workTypeFilter, setWorkTypeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('score-desc')

  // Fetch / simulate recommendation query
  const fetchRecommendations = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await jobService.getRecommendedJobs({
        location: locationFilter,
        workType: workTypeFilter,
        sortBy
      })
      setJobs(response.jobs)
    } catch {
      setErrorMessage('Terjadi kesalahan saat memuat daftar rekomendasi lowongan. Silakan coba kembali.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [locationFilter, workTypeFilter, sortBy])

  // Filtered and sorted jobs
  const displayedJobs = useMemo(() => {
    return jobs
  }, [jobs])

  const handleResetFilters = () => {
    setLocationFilter('')
    setWorkTypeFilter('All')
    setSortBy('score-desc')
  }

  // Kunci halaman Rekomendasi jika CV belum diunggah & dianalisis
  if (!extractedProfile || !cvFile) {
    return (
      <div style={{ width: '100%' }}>
        <StepProgress />

        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
            Rekomendasi Lowongan Terkunci
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Rekomendasi lowongan kerja disinkronkan langsung dari hasil ekstraksi keahlian CV Anda. Silakan unggah dokumen CV terlebih dahulu agar sistem dapat mencocokkan kriteria lowongan yang relevan.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setActiveView('upload')}
              style={{ fontWeight: 600, padding: '10px 24px' }}
            >
              Unggah Dokumen CV Sekarang →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <StepProgress />

      {/* Header section */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
          Rekomendasi Lowongan
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Berdasarkan profil {extractedProfile?.matchedRole || 'kandidat'} dan preferensi kerja Anda.
        </p>
      </div>

      {/* Filter and Sort Controls */}
      <div className="filter-bar" role="search" aria-label="Filter lowongan kerja">
        {/* Location filter */}
        <div className="filter-item">
          <label htmlFor="filter-loc" className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
            Filter Lokasi
          </label>
          <input
            id="filter-loc"
            type="text"
            className="input-text"
            style={{ minHeight: '38px', fontSize: '13px' }}
            placeholder="Ketik kota (misal: Jakarta)"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>

        {/* Work Type filter */}
        <div className="filter-item">
          <label htmlFor="filter-worktype" className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
            Tipe Kerja
          </label>
          <select
            id="filter-worktype"
            className="input-select"
            style={{ minHeight: '38px', fontSize: '13px' }}
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
          >
            <option value="All">Semua Tipe Kerja</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Sort by score */}
        <div className="filter-item">
          <label htmlFor="filter-sort" className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>
            Pengurutan Skor
          </label>
          <select
            id="filter-sort"
            className="input-select"
            style={{ minHeight: '38px', fontSize: '13px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score-desc">Skor Tertinggi ke Terendah</option>
            <option value="score-asc">Skor Terendah ke Tertinggi</option>
          </select>
        </div>

        {/* Reset filters button */}
        {(locationFilter !== '' || workTypeFilter !== 'All') && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleResetFilters}
              style={{ minHeight: '38px' }}
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="state-box">
          <div className="spinner" aria-hidden="true"></div>
          <div>
            <p className="state-title">Memuat Rekomendasi Lowongan...</p>
            <p className="state-desc">
              Sedang mencocokkan keahlian Anda dengan data lowongan yang tersedia.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <div className="state-box" style={{ borderColor: 'var(--status-rejected-border)' }}>
            <div>
            <p className="state-title">Gagal Memuat Lowongan</p>
            <p className="state-desc">{errorMessage}</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={fetchRecommendations}
          >
            Coba Muat Ulang
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && displayedJobs.length === 0 && (
        <div className="state-box">
            <div>
            <p className="state-title">Tidak Ada Lowongan yang Sesuai</p>
            <p className="state-desc">
              Tidak ditemukan lowongan dengan filter lokasi "{locationFilter}" dan tipe kerja "{workTypeFilter}". Coba sesuaikan kata kunci filter Anda.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetFilters}
          >
            Bersihkan Filter
          </button>
        </div>
      )}

      {/* Results List */}
      {!isLoading && !errorMessage && displayedJobs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-subtle)' }}>
              {displayedJobs.length} lowongan ditemukan
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)' }}>
              Simpan lowongan untuk memantau proses seleksi di Job Tracker
            </span>
          </div>

          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} isTrackerView={false} />
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setActiveView('review')}
        >
          ← Kembali ke Tinjau Profil
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setActiveView('tracker')}
        >
          Buka Job Tracker →
        </button>
      </div>
    </div>
  )
}
