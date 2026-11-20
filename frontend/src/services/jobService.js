import { DEMO_JOBS } from '../data/demoJobs'

/**
 * Service layer for CV analysis and job search
 * Currently operates in simulation mode with demo data.
 * Ready for future Laravel backend API integration.
 */

// Placeholder for future Laravel API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const jobService = {
  /**
   * Simulates parsing a CV file and extracting relevant candidate profile
   * Future integration target: POST `${API_BASE_URL}/cv/analyze` with FormData
   */
  async analyzeCv(file, preferences = {}) {
    // Simulated processing latency
    await new Promise((resolve) => setTimeout(resolve, 1400))

    // Fallback title derived from preferences or file name
    const preferredRole = preferences.targetRole?.trim() || 'Frontend Web Developer'
    
    // Simulated extracted skills based on modern web development profile
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
   * Simulates fetching recommended jobs based on preferences and profile skills
   * Future integration target: GET `${API_BASE_URL}/jobs/recommendations`
   */
  async getRecommendedJobs(filters = {}) {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    let results = [...DEMO_JOBS]

    // Filter by work type if provided
    if (filters.workType && filters.workType !== 'All') {
      results = results.filter(
        (job) => job.workType.toLowerCase() === filters.workType.toLowerCase()
      )
    }

    // Filter by location if specified
    if (filters.location && filters.location.trim() !== '') {
      const q = filters.location.toLowerCase().trim()
      results = results.filter(
        (job) =>
          job.location.toLowerCase().includes(q) ||
          job.workType.toLowerCase().includes(q)
      )
    }

    // Sorting by matchScore descending or ascending
    if (filters.sortBy === 'score-asc') {
      results.sort((a, b) => a.matchScore - b.matchScore)
    } else {
      // Default: score highest first
      results.sort((a, b) => b.matchScore - a.matchScore)
    }

    return {
      isSimulated: true,
      total: results.length,
      jobs: results
    }
  }
}
