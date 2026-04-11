"use client"

import { useState, useEffect } from "react"
import Footer from "../components/Footer"
import { getInsights, analyzeInsights } from "../services/api"

function Insights({ user, onLogout }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = async () => {
    try {
      const data = await getInsights(user.id)
      setInsights(data)
    } catch (err) {
      console.error("Failed to load insights:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const data = await analyzeInsights(user.id)
      setInsights(data)
    } catch (err) {
      console.error("Failed to analyze insights:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">Loading insights...</div>
    )
  }

  return (
    <>
      <div className="insights-container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Your Insights</h1>
            <p className="page-subtitle">Understanding your emotional patterns over time.</p>
          </div>
          {insights?.can_analyze && (
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{ backgroundColor: 'red', color: 'var(--text-primary)' }}
            >
              {analyzing ? "Analyzing..." : "Analyze My Journal"}
            </button>
          )}
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <p className="stat-number">{insights?.total_entries || 0}</p>
            <p className="stat-label">Diary Entries</p>
          </div>
          <div className="card stat-card">
            <p className="stat-number">{insights?.total_chats || 0}</p>
            <p className="stat-label">Conversations</p>
          </div>
        </div>

        <div className="card insight-card">
          <h3>Weekly Summary</h3>
          <p>{insights?.weekly_insight || "Start journaling and chatting to see your weekly insights."}</p>
        </div>

        <div className="card insight-card">
          <h3>Mood Analysis</h3>
          <p>{insights?.mood_summary || "Keep expressing yourself to receive mood insights."}</p>
        </div>

        {insights?.optimism_level && insights.optimism_level !== "N/A" && (
          <div className="stats-grid" style={{ marginTop: "1.5rem" }}>
            <div className="card stat-card" style={{ padding: "1.5rem" }}>
              <p className="stat-label">Optimism Level</p>
              <p className="stat-number" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{insights.optimism_level}</p>
            </div>
            <div className="card stat-card" style={{ padding: "1.5rem" }}>
              <p className="stat-label">Dominant Emotion</p>
              <p className="stat-number" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{insights.dominant_emotion}</p>
            </div>
            <div className="card stat-card" style={{ padding: "1.5rem", gridColumn: "span 2" }}>
              <p className="stat-label">Primary Stressor</p>
              <p className="stat-number" style={{ fontSize: "1.25rem", marginTop: "0.5rem", fontWeight: "600" }}>{insights.primary_stressor}</p>
            </div>
            <div className="card stat-card" style={{ padding: "1.5rem" }}>
              <p className="stat-label">Emotional Volatility</p>
              <p className="stat-number" style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>{insights.emotional_volatility}</p>
            </div>
          </div>
        )}

        {insights?.coping_strategy && insights.coping_strategy !== "N/A" && (
          <div className="card insight-card" style={{ borderLeft: "4px solid var(--accent-sage)" }}>
            <h3>Recommended Coping Strategy</h3>
            <p style={{ fontWeight: "500" }}>{insights.coping_strategy}</p>
          </div>
        )}

        {insights?.keywords && insights.keywords.length > 0 && (
          <div className="card insight-card">
            <h3>Detected Themes</h3>
            <p>These themes appeared frequently in your entries:</p>
            <div className="keyword-tags">
              {insights.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="disclaimer" style={{ marginTop: "2rem" }}>
          <p>
            These insights are generated from basic text analysis and are not clinical assessments. For professional
            mental health support, please consult a licensed therapist.
          </p>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Insights
