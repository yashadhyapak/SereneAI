"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Chat from "./pages/Chat"
import Diary from "./pages/Diary"
import Insights from "./pages/Insights"
import Profile from "./pages/Profile"
import Sidebar from "./components/Sidebar"

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} />
          
          <Route element={user ? (
            <div className="layout">
              <Sidebar onLogout={handleLogout} />
              <main className="main-content">
                <Outlet />
              </main>
            </div>
          ) : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/chat" element={<Chat user={user} />} />
            <Route path="/diary" element={<Diary user={user} />} />
            <Route path="/insights" element={<Insights user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
