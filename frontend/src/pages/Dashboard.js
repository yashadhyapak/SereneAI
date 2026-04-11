"use client"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import BubblePop from "../components/games/BubblePop"
import BreathingExercise from "../components/games/BreathingExercise"

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <>
      <div className="page-header">
          <h1 className="dashboard-greeting">
            {getGreeting()}, {user.name}
          </h1>
          <p className="dashboard-prompt">How are you feeling today?</p>
        </div>

        <div className="dashboard-cards">
          <div className="card dashboard-card card-hover" onClick={() => navigate("/chat")}>
            <h3>💬 Talk to Serene</h3>
            <p>Start a conversation with your AI companion and share what's on your mind.</p>
          </div>
          <div className="card dashboard-card card-hover" onClick={() => navigate("/diary")}>
            <h3>📔 Write in Dear Diary</h3>
            <p>Express your thoughts and feelings in your private digital journal.</p>
          </div>
          <div className="card dashboard-card card-hover" onClick={() => navigate("/insights")}>
            <h3>📊 View Insights</h3>
            <p>Explore patterns in your emotional journey and track your progress.</p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: '"Playfair Display", serif' }}>Stress Relief Area</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Take a moment to pause. No scoring, no pressure. Just breathe and play.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card dashboard-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>Bubble Wrap</h3>
              <BubblePop />
            </div>
            <div className="card dashboard-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>Guided Breathing</h3>
              <BreathingExercise />
            </div>
          </div>
        </div>

      <Footer />
    </>
  )
}

export default Dashboard
