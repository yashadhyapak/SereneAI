"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/api"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await login(email, password)
      onLogin(user)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your wellness journey</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>

        <div className="demo-accounts">
          <h4>Demo Accounts (click to fill)</h4>
          <p onClick={() => fillDemo("demo@serene.ai", "demo123")} style={{ cursor: "pointer" }}>
            demo@serene.ai / demo123
          </p>
          <p onClick={() => fillDemo("test@serene.ai", "test123")} style={{ cursor: "pointer" }}>
            test@serene.ai / test123
          </p>
          <p onClick={() => fillDemo("faculty@serene.ai", "faculty123")} style={{ cursor: "pointer", fontWeight: "600", color: "var(--text-primary)" }}>
            faculty@serene.ai / faculty123
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/" className="btn btn-ghost">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
