import Footer from "../components/Footer"

function Profile({ user, onLogout }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="profile-container">
        <div className="page-header">
            <h1 className="page-title">Your Profile</h1>
          </div>

          <div className="profile-header">
            <div className="profile-avatar">{getInitials(user.name)}</div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="card profile-section">
            <h3>Account Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={user.name} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user.email} readOnly />
            </div>
          </div>

          <div className="card profile-section">
            <h3>Preferences</h3>
            <div className="form-group">
              <label className="form-label">Notification Frequency</label>
              <select className="form-input">
                <option>Daily Reminders</option>
                <option>Weekly Summary</option>
                <option>None</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Theme</label>
              <select className="form-input">
                <option>Light (Default)</option>
                <option>Dark (Coming Soon)</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="btn btn-secondary" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </div>

      <Footer />
    </>
  )
}

export default Profile
