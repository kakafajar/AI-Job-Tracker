import { AppProvider, useApp } from './context/AppContext'
import { HeaderNav } from './components/HeaderNav'
import { Footer } from './components/Footer'
import { LandingPage } from './pages/LandingPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { UploadCvPage } from './pages/UploadCvPage'
import { ProfileReviewPage } from './pages/ProfileReviewPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { JobTrackerPage } from './pages/JobTrackerPage'

function AppViewRouter() {
  const { activeView } = useApp()

  const renderActiveView = () => {
    switch (activeView) {
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
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="app-shell">
      <HeaderNav />
      <main className="main-content" id="main-content">
        {renderActiveView()}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppViewRouter />
    </AppProvider>
  )
}
