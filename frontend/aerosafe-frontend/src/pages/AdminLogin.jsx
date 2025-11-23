import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Key, User } from 'lucide-react'
import { authAPI, saveAuthData } from '../services/api'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const isValidEmail = (e) => /^\S+@\S+\.\S+$/.test(e)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const body = await authAPI.login(email, password)

      if (body?.success && body?.token) {
        saveAuthData(body.token, body.user)
        const role = body.user?.role || body.user?.Role || ''
        if (role.toLowerCase() === 'admin') navigate('/admin/dashboard')
        else if (role.toLowerCase() === 'pilot') navigate('/pilot/dashboard')
        else navigate('/')
      } else {
        setError(body?.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="form-page">
      <section className="signup-card">
        <div className="signup-icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}>
          <User size={20} /> Admin Login
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-email">Email ID</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">Password <Key size={14} style={{ verticalAlign: 'middle', marginLeft: '6px' }} /></label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
          <a href="/admin-signup" className="landing-link">
            Signup
          </a>
        </p>

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to pilot login"
            onClick={() => navigate('/pilot-login')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Pilot Login</p>
        </div>
      </section>
    </main>
  )
}

export default AdminLogin

