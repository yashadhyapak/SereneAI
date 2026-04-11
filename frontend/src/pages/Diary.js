"use client"

import { useState, useEffect } from "react"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"
import { createDiaryEntry, getDiaryEntries } from "../services/api"

function Diary({ user, onLogout }) {
  const [content, setContent] = useState("")
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await getDiaryEntries(user.id)
      setEntries(data.entries)
    } catch (err) {
      console.error("Failed to load diary entries:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content.trim() || saving) return

    setSaving(true)
    try {
      const newEntry = await createDiaryEntry(user.id, content.trim())
      setEntries((prev) => [newEntry, ...prev])
      setContent("")
    } catch (err) {
      console.error("Failed to save diary entry:", err)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <div className="diary-container">
        <div className="page-header">
            <h1 className="page-title">Dear Diary</h1>
            <p className="page-subtitle">A safe space to express your thoughts and feelings.</p>
          </div>

          <div className="diary-editor card">
            <textarea
              className="diary-textarea"
              placeholder="What's on your mind today? Write freely..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleSave} disabled={saving || !content.trim()}>
              {saving ? "Saving..." : "Save Entry"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Previous Entries</h2>
            {entries.length >= 3 && (
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/insights')}
                style={{ backgroundColor: "var(--accent-lavender)", border: "none" }}>
                Analyze My Journal (3+ Entries)
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading">Loading entries...</div>
          ) : entries.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>
              No diary entries yet. Start writing your first entry above!
            </div>
          ) : (
            <div className="diary-entries">
              {entries.map((entry) => (
                <div key={entry.id} className="card diary-entry card-hover">
                  <p className="diary-entry-date">{formatDate(entry.date)}</p>
                  <p className="diary-entry-preview">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      <Footer />
    </>
  )
}

export default Diary
