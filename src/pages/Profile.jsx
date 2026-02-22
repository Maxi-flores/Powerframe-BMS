import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "admin",
    email: "admin@powerframe.io",
    fullName: "Admin User",
    avatar: null
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  function handleSave(e) {
    e.preventDefault();
    setUser(form);
    setEditing(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="page-container">
      <style>{css}</style>

      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card main">
          <div className="avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" />
            ) : (
              <span>{user.fullName.charAt(0)}</span>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave}>
              <label>Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              />

              <label>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              />

              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <h2>{user.fullName}</h2>
              <p className="username">@{user.username}</p>
              <p className="email">{user.email}</p>
              <button className="btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h3>Security</h3>
          <button className="settings-btn">Change Password</button>
          <button className="settings-btn">Two-Factor Authentication</button>
          <button className="settings-btn">Active Sessions</button>
        </div>

        <div className="profile-card">
          <h3>Preferences</h3>
          <div className="pref-row">
            <span>Dark Mode</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="pref-row">
            <span>Email Notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="pref-row">
            <span>Desktop Notifications</span>
            <input type="checkbox" />
          </div>
        </div>

        <div className="profile-card danger">
          <h3>Danger Zone</h3>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
          <button className="btn-danger-outline">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

const css = `
.page-container {
  padding: 30px;
  color: white;
  min-height: 100%;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 { margin: 0; font-size: 28px; }
.page-subtitle { color: rgba(255,255,255,0.6); margin: 5px 0 0; }

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.profile-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
}

.profile-card.main {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 30px;
}

@media (max-width: 600px) {
  .profile-card.main {
    flex-direction: column;
    text-align: center;
  }
}

.profile-card h3 {
  margin: 0 0 20px;
  font-size: 16px;
  color: rgba(255,255,255,0.8);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin: 0;
  font-size: 24px;
}

.profile-info .username {
  margin: 4px 0;
  color: #7c3aed;
}

.profile-info .email {
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
}

.profile-card form {
  flex: 1;
}

.profile-card label {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 6px;
}

.profile-card input[type="text"],
.profile-card input[type="email"] {
  width: 100%;
  padding: 12px;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  color: white;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 12px 24px;
  background: #52c41a;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  padding: 12px 24px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.settings-btn {
  display: block;
  width: 100%;
  padding: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: white;
  text-align: left;
  cursor: pointer;
  margin-bottom: 10px;
}

.settings-btn:hover {
  background: rgba(255,255,255,0.08);
}

.pref-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.pref-row:last-child {
  border-bottom: none;
}

.pref-row input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.profile-card.danger {
  border-color: rgba(220, 38, 38, 0.3);
}

.btn-danger {
  width: 100%;
  padding: 14px;
  background: #dc2626;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;
}

.btn-danger-outline {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 1px solid #dc2626;
  border-radius: 10px;
  color: #dc2626;
  cursor: pointer;
}
`;
