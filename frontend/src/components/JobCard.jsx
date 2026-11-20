import { useApp, TRACKING_STATUSES } from '../context/AppContext'
import { StatusBadge } from './StatusBadge'

export function JobCard({ job, isTrackerView = false }) {
  const { trackJob, updateJobStatus, untrackJob, isJobTracked, getJobTrackedStatus } = useApp()

  const tracked = isJobTracked(job.id)
  const currentStatus = isTrackerView ? job.status : getJobTrackedStatus(job.id)

  const handleSaveToggle = () => {
    if (tracked) {
      untrackJob(job.id)
    } else {
      trackJob(job, 'Disimpan')
    }
  }

  return (
    <article className="job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <StatusBadge type="demo" />
            <StatusBadge type="score" value={job.matchScore} />
            <StatusBadge type="workType" value={job.workType} />
            {isTrackerView && (
              <StatusBadge type="tracking" value={currentStatus || 'Disimpan'} />
            )}
          </div>
          <h3 id={`job-title-${job.id}`} className="job-title">
            {job.title}
          </h3>
          <p className="job-company">{job.company}</p>
        </div>

        {/* Action button in header for desktop */}
        {!isTrackerView && (
          <button
            type="button"
            className={`btn btn-sm ${tracked ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleSaveToggle}
            aria-pressed={tracked}
          >
            {tracked ? '✓ Tersimpan di Tracker' : '+ Simpan ke Tracker'}
          </button>
        )}
      </div>

      {/* Metadata info */}
      <div className="job-meta-row">
        <span className="job-meta-item">
          📍 {job.location}
        </span>
        <span className="job-meta-item">
          💼 {job.jobType}
        </span>
        {job.salaryRange && (
          <span className="job-meta-item">
            💰 {job.salaryRange}
          </span>
        )}
        {job.postedDate && (
          <span className="job-meta-item">
            🕒 Dipasang {job.postedDate}
          </span>
        )}
      </div>

      {/* Match explanation box */}
      {job.matchReason && (
        <div className="job-reason-box">
          <span className="job-reason-label">Alasan Kecocokan:</span>
          <span>{job.matchReason}</span>
        </div>
      )}

      {/* Matched skills */}
      {job.matchedSkills && job.matchedSkills.length > 0 && (
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-subtle)', display: 'block', marginBottom: '6px' }}>
            Skill yang Cocok:
          </span>
          <div className="skill-tags-group">
            {job.matchedSkills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="job-card-footer">
        <div className="job-source-tag">
          Sumber: <strong>{job.source}</strong> (Tautan Asli)
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Tracker status controls */}
          {isTrackerView ? (
            <>
              <label htmlFor={`status-select-${job.id}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Status:
              </label>
              <select
                id={`status-select-${job.id}`}
                className="input-select"
                style={{ width: 'auto', minHeight: '38px', padding: '6px 12px', fontSize: '13px' }}
                value={currentStatus || 'Disimpan'}
                onChange={(e) => updateJobStatus(job.id, e.target.value)}
              >
                {TRACKING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="btn btn-sm btn-danger-outline"
                onClick={() => untrackJob(job.id)}
                title="Hapus lowongan ini dari daftar tracker"
              >
                Hapus
              </button>
            </>
          ) : (
            /* Mobile save button fallback */
            <button
              type="button"
              className={`btn btn-sm ${tracked ? 'btn-secondary' : 'btn-primary'}`}
              style={{ display: 'none' }}
              onClick={handleSaveToggle}
            >
              {tracked ? '✓ Tersimpan' : '+ Simpan'}
            </button>
          )}

          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-secondary"
            title={`Buka lowongan di ${job.source}`}
          >
            Lihat Lowongan ↗
          </a>
        </div>
      </div>
    </article>
  )
}
