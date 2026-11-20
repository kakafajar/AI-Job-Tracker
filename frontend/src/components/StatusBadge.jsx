export function StatusBadge({ type, value, label }) {
  if (type === 'demo') {
    return (
      <span className="status-badge badge-demo" title="Data demo simulasi">
        Data demo
      </span>
    )
  }

  if (type === 'score') {
    return (
      <span className="status-badge badge-score" title="Estimasi kecocokan kualifikasi">
        {value}% Cocok
      </span>
    )
  }

  if (type === 'workType') {
    return (
      <span className="status-badge badge-worktype">
        {value}
      </span>
    )
  }

  if (type === 'tracking') {
    const classMap = {
      Disimpan: 'badge-saved',
      'Sudah Melamar': 'badge-applied',
      Wawancara: 'badge-interview',
      Diterima: 'badge-accepted',
      Ditolak: 'badge-rejected'
    }

    const badgeClass = classMap[value] || 'badge-saved'

    return (
      <span className={`status-badge ${badgeClass}`}>
        {label || value}
      </span>
    )
  }

  return (
    <span className="status-badge">
      {value}
    </span>
  )
}
