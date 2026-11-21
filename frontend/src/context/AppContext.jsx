import { createContext, useContext, useEffect, useState } from 'react'
import { storageService } from '../services/storageService'

const AppContext = createContext(null)

export const TRACKING_STATUSES = [
  'Disimpan',
  'Sudah Melamar',
  'Wawancara',
  'Diterima',
  'Ditolak'
]

export function AppProvider({ children }) {
  // Navigation view state: default to modern dashboard
  const [activeView, setActiveViewState] = useState('dashboard')

  // Sidebar toggle state for desktop expanded mode (icons + labels)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  // Mobile menu drawer toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleSidebarExpanded = () => {
    setIsSidebarExpanded((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const setActiveView = (view) => {
    setActiveViewState(view)
    setIsMobileMenuOpen(false)
  }

  // Automatically reset mobile drawer if viewport width expands to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Step 2: Job search preferences
  const [preferences, setPreferencesState] = useState(() => {
    return (
      storageService.getPreferences() || {
        location: '',
        workType: 'Remote',
        jobType: 'Full-time',
        targetRole: ''
      }
    )
  })

  // Step 3: Selected CV file (held locally in memory)
  const [cvFile, setCvFile] = useState(null)

  // Step 4: Extracted profile data (simulated)
  const [extractedProfile, setExtractedProfileState] = useState(() => {
    return storageService.getExtractedProfile() || null
  })

  // Step 6: Persistent Job Tracker list
  const [trackedJobs, setTrackedJobs] = useState(() => {
    return storageService.getTrackedJobs()
  })

  // Sync tracked jobs changes to localStorage
  useEffect(() => {
    storageService.saveTrackedJobs(trackedJobs)
  }, [trackedJobs])

  // Sync preferences changes to localStorage
  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferencesState(updated)
    storageService.savePreferences(updated)
  }

  // Update extracted profile
  const updateExtractedProfile = (profile) => {
    setExtractedProfileState(profile)
    storageService.saveExtractedProfile(profile)
  }

  // Add a skill to extracted profile
  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (!trimmed || !extractedProfile) return
    if (extractedProfile.skills.includes(trimmed)) return

    const updatedProfile = {
      ...extractedProfile,
      skills: [...extractedProfile.skills, trimmed]
    }
    updateExtractedProfile(updatedProfile)
  }

  // Remove a skill from extracted profile
  const removeSkill = (skillToRemove) => {
    if (!extractedProfile) return
    const updatedProfile = {
      ...extractedProfile,
      skills: extractedProfile.skills.filter((s) => s !== skillToRemove)
    }
    updateExtractedProfile(updatedProfile)
  }

  // Save or track a job
  const trackJob = (job, status = 'Disimpan') => {
    setTrackedJobs((prev) => {
      const exists = prev.find((item) => item.id === job.id)
      if (exists) {
        return prev.map((item) =>
          item.id === job.id ? { ...item, status, updatedAt: new Date().toISOString() } : item
        )
      }
      return [
        {
          ...job,
          status,
          savedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        ...prev
      ]
    })
  }

  // Update tracking status
  const updateJobStatus = (jobId, newStatus) => {
    setTrackedJobs((prev) =>
      prev.map((item) =>
        item.id === jobId
          ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
          : item
      )
    )
  }

  // Remove job from tracker
  const untrackJob = (jobId) => {
    setTrackedJobs((prev) => prev.filter((item) => item.id !== jobId))
  }

  // Check if a job is in tracker
  const isJobTracked = (jobId) => {
    return trackedJobs.some((item) => item.id === jobId)
  }

  // Get current status of a tracked job
  const getJobTrackedStatus = (jobId) => {
    const item = trackedJobs.find((j) => j.id === jobId)
    return item ? item.status : null
  }

  // Reset the flow back to start
  const resetFlow = () => {
    setCvFile(null)
    setActiveView('preferences')
  }

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        isSidebarExpanded,
        toggleSidebarExpanded,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        preferences,
        updatePreferences,
        cvFile,
        setCvFile,
        extractedProfile,
        updateExtractedProfile,
        addSkill,
        removeSkill,
        trackedJobs,
        trackJob,
        updateJobStatus,
        untrackJob,
        isJobTracked,
        getJobTrackedStatus,
        resetFlow
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
