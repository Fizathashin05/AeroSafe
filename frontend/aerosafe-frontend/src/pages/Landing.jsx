import { useNavigate } from 'react-router-dom'
import logo from '../logo.png'

const Landing = () => {
  const navigate = useNavigate()
  const handleNavigate = (path) => navigate(path)

  return (
    <main className="landing-page">
      <section className="landing-card">
        <img src={logo} alt="AeroSafe logo" className="landing-logo" />
        <p className="landing-subtitle">
          Flight Safety Monitoring & Alert System for smarter, safer cargo operations.
        </p>

        <div className="landing-actions">
          <button
            className="landing-button primary"
            onClick={() => navigate('/admin-signup')}
          >
            Create Admin Account
          </button>
          <button
            className="landing-button primary"
            onClick={() => navigate('/pilot-signup')}
          >
            Create Pilot Account
          </button>
        </div>

        <p className="landing-login">
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
      </section>
    </main>
  )
}

export default Landing