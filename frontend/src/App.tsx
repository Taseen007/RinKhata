import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Loans from './pages/Loans'
import Wallets from './pages/Wallets'
import Transactions from './pages/Transactions'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Settings from './pages/Settings.tsx'
import Login from './pages/Login'

function App() {
  // TODO: Implement proper authentication check
  const isAuthenticated = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="loans" element={<Loans />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
