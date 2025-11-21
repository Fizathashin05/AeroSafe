import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminSignup from './pages/AdminSignup'
import PilotSignup from './pages/PilotSignup'
import AuthVerify from './pages/AuthVerify'
import LoginChoice from './pages/LoginChoice'
import AdminLogin from './pages/AdminLogin'
import PilotLogin from './pages/PilotLogin'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/pilot-signup" element={<PilotSignup />} />
      <Route path="/login" element={<LoginChoice />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/pilot-login" element={<PilotLogin />} />
      <Route path="/verify" element={<AuthVerify />} />
    </Routes>
  )
}

export default App