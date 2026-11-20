import { useApp } from '../context/AppContext'

export function LandingPage() {
  const { setActiveView, trackedJobs } = useApp()

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
      <section style={{ padding: '36px 0 28px' }}>
        <h1
          style={{
            fontSize: '32px',
            lineHeight: 1.25,
            fontWeight: 800,
            color: 'var(--color-text)',
            letterSpacing: '-0.8px',
            marginBottom: '16px'
          }}
        >
          AI Job Tracker & CV Analyzer
        </h1>

        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            maxWidth: '640px',
            margin: '0 auto 28px'
          }}
        >
          Aplikasi asisten pencari kerja pribadi. Unggah CV dan tentukan preferensi karier Anda untuk menemukan rekomendasi lowongan yang relevan dari berbagai sumber web, lalu pantau seluruh status lamaran Anda dalam satu tempat.
        </p>

        {/* Honest note about application scope */}
        <div
          className="info-banner info-banner-primary"
          style={{ maxWidth: '640px', margin: '0 auto 32px', textAlign: 'left' }}
        >
          <span style={{ fontSize: '18px' }} aria-hidden="true">💡</span>
          <div>
            <strong>Catatan:</strong> Aplikasi ini dirancang untuk pencari kerja individu, bukan portal pasang lowongan bagi perusahaan. Data rekomendasi dianalisis dari kesesuaian skill CV Anda.
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ minHeight: '48px', padding: '12px 24px', fontSize: '15px' }}
            onClick={() => setActiveView('preferences')}
          >
            Cari Lowongan dari CV
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ minHeight: '48px', padding: '12px 24px', fontSize: '15px' }}
            onClick={() => setActiveView('tracker')}
          >
            Buka Job Tracker ({trackedJobs.length})
          </button>
        </div>
      </section>

      {/* Workflow preview without AI-slop template */}
      <section
        style={{
          marginTop: '36px',
          paddingTop: '32px',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'left'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text)' }}>
          Alur Penggunaan Aplikasi
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>Langkah 1</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 8px' }}>Tentukan Preferensi</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Pilih lokasi kerja idaman, tipe kerja (Remote, Hybrid, On-site), dan jenis pekerjaan (Full-time, dll).
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>Langkah 2</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 8px' }}>Unggah & Analisis CV</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Unggah resume file PDF atau DOCX Anda untuk diekstraksi keahlian dan riwayat pengalamannya.
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>Langkah 3</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 8px' }}>Tinjau & Rekomendasi</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Sesuaikan daftar skill hasil ekstraksi lalu dapatkan kartu lowongan dengan penjelasan alasan kecocokan.
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>Langkah 4</span>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 8px' }}>Pantau di Tracker</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Simpan lowongan incaran dan perbarui status lamaran mulai dari Disimpan hingga Wawancara dan Diterima.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
