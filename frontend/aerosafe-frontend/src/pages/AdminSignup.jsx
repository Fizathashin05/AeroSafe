import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { authAPI, saveAuthData } from '../services/api'

const AdminSignup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const nameRegex = /^[A-Za-z\s]+$/
  const adminIdRegex = /^[A-Za-z0-9-]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }

    if (!nameRegex.test(name.trim())) {
      setError('Name must contain alphabetic characters only')
      setLoading(false)
      return
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!adminId.trim()) {
      setError('Admin ID is required')
      setLoading(false)
      return
    }

    if (!adminIdRegex.test(adminId.trim())) {
      setError('Admin ID can only include letters, numbers, and dashes')
      setLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be 8+ chars and include uppercase, lowercase, number, and special character')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.adminSignup({
        name,
        email,
        adminId,
        password,
        confirmPassword,
      })

      if (response.success && response.token) {
        saveAuthData(response.token, response.user)
        // Navigate to admin dashboard after signup
        navigate('/admin/dashboard')
      } else {
        setError(response.message || 'Signup failed')
        if (response?.message && response.message.toLowerCase().includes('email already')) {
          setShowLoginPrompt(true)
        }
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
        <div className="signup-icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <h2>Admin Signup</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-name">Name</label>
            <input id="admin-name" name="name" type="text" placeholder="Enter full name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

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
            <label htmlFor="admin-id">Admin ID</label>
            <input id="admin-id" name="adminId" type="text" placeholder="AS-ADM-001" required value={adminId} onChange={(e) => setAdminId(e.target.value)} />
          </div>

          <div className="form-field password-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
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

          <div className="form-field password-field">
            <label htmlFor="admin-confirm-password">Confirm Password</label>
            <input
              id="admin-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <p className="field-hint">
            Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
          </p>

          {error && <p style={{ color: 'crimson', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        <p className="login-cta">
          Already have an account?{' '}
          <a
            href="/login"
            className="landing-link"
            onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}
          >
            Login
          </a>
        </p>

        {showLoginPrompt && (
          <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#0f172a' }}>That email is already registered.</p>
            <button
              className="landing-button primary"
              style={{ marginTop: '0.5rem' }}
              onClick={() => navigate('/admin-login', { state: { demoEmail: email } })}
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to pilot signup"
            onClick={() => navigate('/pilot-signup')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Pilot Signup</p>
        </div>
      </section>
    </main>
  )
}

export default AdminSignup

