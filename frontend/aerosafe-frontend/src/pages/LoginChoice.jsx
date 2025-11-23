import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Plane, Info } from 'lucide-react'
import logo from '../logo.png'

const LoginChoice = () => {
  const navigate = useNavigate()

  return (
    <main className="form-page">
      <section className="signup-card">
        <div style={{ textAlign: 'center' }}>
          <img src={logo} alt="AeroSafe logo" className="landing-logo" style={{ width: 140, margin: '0 auto 0.6rem' }} />
          <h2 style={{ margin: 0 }}>Welcome to AeroSafe !</h2>
          <p className="landing-subtitle" style={{ marginTop: '0.5rem' }}>Secure operations for admins and pilots</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
          <button
            className="landing-button primary"
            onClick={() => navigate('/admin-login')}
          >
            <ShieldCheck style={{ verticalAlign: 'middle', marginRight: 8 }} /> Admin Login
          </button>

          <button
            className="landing-button secondary"
            onClick={() => navigate('/pilot-login')}
          >
            <Plane style={{ verticalAlign: 'middle', marginRight: 8 }} /> Pilot Login
          </button>
        </div>

        <p className="login-cta" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don't have an account? <a href="/" className="landing-link">Signup</a>
        </p>

        {/* "Need help logging in?" removed per request */}
      </section>
    </main>
  )
}

export default LoginChoice
