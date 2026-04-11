"use client"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Home() {
  const navigate = useNavigate()

  const handleDemo = () => {
    navigate("/login")
  }

  return (
    <div>
      <Navbar />

      <section className="hero">
        <h1 className="hero-title">
          Your Safe Space for
          <br />
          Mental Wellness
        </h1>
        <p className="hero-subtitle">
          Serene is your compassionate AI companion, here to listen, support, and help you navigate your emotional
          journey — anytime, anywhere.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
          <button onClick={handleDemo} className="btn btn-secondary">
            Try Demo Account
          </button>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">How Serene Supports You</h2>
        <div className="features-grid">
          <div className="card feature-card card-hover">
            <div className="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3>AI Chat Companion</h3>
            <p>Have meaningful conversations with an empathetic AI that truly listens and responds with care.</p>
          </div>

          <div className="card feature-card card-hover">
            <div className="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3>Dear Diary Journaling</h3>
            <p>Express your thoughts freely in a private digital journal that helps you reflect and grow.</p>
          </div>

          <div className="card feature-card card-hover">
            <div className="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3>Emotional Insights</h3>
            <p>Understand your emotional patterns through thoughtful analysis of your journal entries.</p>
          </div>

          <div className="card feature-card card-hover">
            <div className="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3>Privacy & Safety</h3>
            <p>Your data stays private and secure. Share openly without worry in a safe digital space.</p>
          </div>
        </div>
      </section>

      <div className="disclaimer">
        <p>
          Serene is not a replacement for professional therapy. If you are experiencing a mental health crisis,
          please reach out to a licensed professional or emergency services.
        </p>
      </div>

      <Footer />
    </div>
  )
}

export default Home
