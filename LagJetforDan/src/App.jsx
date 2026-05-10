import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import SavedTripsPage from './pages/SavedTripsPage.jsx'

/**
 * App.jsx — defines which URL shows which page (React Router).
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PlannerPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/saved" element={<SavedTripsPage />} />
      </Route>
    </Routes>
  )
}

export default App
