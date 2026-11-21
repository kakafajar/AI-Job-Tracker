import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/Sidebar'
import { TopHeader } from './components/TopHeader'
import { DashboardOverview } from './pages/DashboardOverview'
import { PreferencesPage } from './pages/PreferencesPage'
import { UploadCvPage } from './pages/UploadCvPage'
import { ProfileReviewPage } from './pages/ProfileReviewPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { JobTrackerPage } from './pages/JobTrackerPage'
import { LandingPage } from './pages/LandingPage'

function AppLayout() {
  const { activeView } = useApp()

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'preferences':
        return <PreferencesPage />
      case 'upload':
        return <UploadCvPage />
      case 'review':
        return <ProfileReviewPage />
      case 'recommendations':
        return <RecommendationsPage />
      case 'tracker':
        return <JobTrackerPage />
      case 'landing':
        return <LandingPage />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Floating Island Sidebar matching reference */}
      <Sidebar />

      {/* Main Dashboard Canvas */}
      <main className="dashboard-main" id="main-content">
        <TopHeader />
        {renderActiveView()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  )
}
