import { DEMO_JOBS } from '../data/demoJobs'
import { apiClient } from './apiClient'

/**
 * Service layer for CV analysis and job search
 * Mengambil data lowongan langsung dari backend Laravel database,
 * dengan fallback aman ke demo data lokal jika backend belum berjalan.
 */
export const jobService = {
  /**
   * Simulates parsing a CV file and extracting relevant candidate profile
   */
  async analyzeCv(file, preferences = {}) {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const preferredRole = preferences.targetRole?.trim() || 'Frontend Web Developer'

    const baseSkills = [
      'React',
      'JavaScript (ES6+)',
      'HTML5 & CSS3',
      'Tailwind CSS',
      'RESTful API',
      'Git & GitHub',
      'Responsive Web Design'
    ]

    return {
      isSimulated: true,
      fileName: file.name,
      fileSize: file.size,
      extractedAt: new Date().toISOString(),
      matchedRole: preferredRole,
      experienceLevel: '1 - 3 Tahun Pengalaman',
      experienceSummary: 'Pengalaman membangun aplikasi web berbasis React, mengonsumsi REST API, dan mengelola state antarmuka pengguna.',
      skills: baseSkills,
      education: 'S1 Teknik Informatika / Ilmu Komputer (atau setara)',
      contactEmail: 'kandidat@example.com'
    }
  },

  /**
   * Mengambil rekomendasi lowongan kerja dari Backend Laravel Database
   */
  async getRecommendedJobs(filters = {}) {
    const { location = '', workType = 'All', sortBy = 'score-desc' } = filters

    try {
      // Coba request ke Backend Laravel
      const params = new URLSearchParams()
      if (location) params.append('location', location)
      if (workType && workType !== 'All') params.append('workType', workType)
      if (sortBy) params.append('sortBy', sortBy)

      const response = await apiClient.get(`/jobs/recommendations?${params.toString()}`)
      if (response && response.jobs) {
        return {
          total: response.jobs.length,
          jobs: response.jobs,
          isBackendConnected: true
        }
      }
    } catch {
      // Fallback ke data lokal jika koneksi backend belum aktif
    }

    // Fallback logic
    let filtered = [...DEMO_JOBS]

    if (location && location.trim() !== '') {
      const q = location.toLowerCase().trim()
      filtered = filtered.filter(
        (job) => job.location.toLowerCase().includes(q) || job.workType.toLowerCase() === 'remote'
      )
    }

    if (workType && workType !== 'All') {
      filtered = filtered.filter((job) => job.workType === workType)
    }

    if (sortBy === 'score-asc') {
      filtered.sort((a, b) => a.matchScore - b.matchScore)
    } else {
      filtered.sort((a, b) => b.matchScore - a.matchScore)
    }

    return {
      total: filtered.length,
      jobs: filtered,
      isBackendConnected: false
    }
  }
}
