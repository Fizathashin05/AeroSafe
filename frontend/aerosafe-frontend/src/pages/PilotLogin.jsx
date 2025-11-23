import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plane, Key, User, Eye, EyeOff } from 'lucide-react'
import { authAPI } from '../services/api'

const PilotLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(email, password, 'Pilot')

      if (response.success && response.token) {
        const storage = remember ? localStorage : sessionStorage
        storage.setItem('token', response.token)
        if (response.user) {
          storage.setItem('user', JSON.stringify(response.user))
        }
        const otherStorage = remember ? sessionStorage : localStorage
        otherStorage.removeItem('token')
        otherStorage.removeItem('user')

        navigate('/verify')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="form-page">
      <section className="signup-card">
        <div className="signup-icon pilot">
          <Plane aria-hidden="true" />
        </div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}>
          <User size={20} /> Pilot Login
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="pilot-email">Email ID</label>
            <input
              id="pilot-email"
              name="email"
              type="email"
              placeholder="pilot@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pilot-id">Pilot ID</label>
            <input
              id="pilot-id"
              name="pilotId"
              type="text"
              placeholder="AS-PLT-001"
              value={pilotId}
              onChange={(e) => setPilotId(e.target.value)}
            />
          </div>

          <div className="form-field password-field">
            <label htmlFor="pilot-password">Password <Key size={14} style={{ verticalAlign: 'middle', marginLeft: '6px' }} /></label>
            <input
              id="pilot-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href="#" style={{ marginLeft: 'auto', fontSize: '0.9rem' }} onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {error && <p style={{ color: 'crimson' }}>{error}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="login-cta">
          Don't have an account?{' '}
          <a href="/pilot-signup" className="landing-link">
            Signup
          </a>
        </p>

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to admin login"
            onClick={() => navigate('/admin-login')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Admin Login</p>
        </div>
      </section>
    </main>
  )
}

export default PilotLogin
