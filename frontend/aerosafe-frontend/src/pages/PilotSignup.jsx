import { useNavigate } from 'react-router-dom'
import { Plane, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { authAPI, saveAuthData } from '../services/api'

const PilotSignup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pilotId, setPilotId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  const nameRegex = /^[A-Za-z\s]+$/
  const pilotIdRegex = /^[A-Za-z0-9-]+$/
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

    if (!pilotId.trim()) {
      setError('Pilot ID is required')
      setLoading(false)
      return
    }

    if (!pilotIdRegex.test(pilotId.trim())) {
      setError('Pilot ID can only include letters, numbers, and dashes')
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
      const response = await authAPI.pilotSignup({
        name,
        email,
        pilotId,
        password,
        confirmPassword,
      })

      if (response.success && response.token) {
        saveAuthData(response.token, response.user)
        // Navigate to verification page to test authentication
        navigate('/verify')
      } else {
        setError(response.message || 'Signup failed')
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
        <h2>Pilot Signup</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="pilot-name">Name</label>
            <input id="pilot-name" name="name" type="text" placeholder="Enter full name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

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
            <input id="pilot-id" name="pilotId" type="text" placeholder="AS-PLT-001" required value={pilotId} onChange={(e) => setPilotId(e.target.value)} />
          </div>

          <div className="form-field password-field">
            <label htmlFor="pilot-password">Password</label>
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

          <div className="form-field password-field">
            <label htmlFor="pilot-confirm-password">Confirm Password</label>
            <input
              id="pilot-confirm-password"
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

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to admin signup"
            onClick={() => navigate('/admin-signup')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Admin Signup</p>
        </div>
      </section>
    </main>
  )
}

export default PilotSignup

