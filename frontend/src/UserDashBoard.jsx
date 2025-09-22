import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./firebase";

export default function UserDashboard() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUser = async () => {
    try {
      const res = await fetch("https://talknest-2.onrender.com/ShowUser");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
        localStorage.setItem("url", user.image);
        setError("");
      } else {
        setUsers([]);
        setError(data.error ? data.error : "Failed to load users.");
      }
    } catch (err) {
      setError("Error fetching users: " + err.message);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("detail");
    navigate("/");
  };

  useEffect(() => {
    getUser();
  }, []);

  const [user] = useState(() => {
    const stored = localStorage.getItem("detail");
    try {
      if (stored) return JSON.parse(stored);
      return { username: "guest" };
    } catch {
      return { username: stored || "guest" };
    }
  });

  // ❌ Block desktop
  if (!isMobile) {
    return (
      <div className="desktop-block">
        <h1>⚠️ This app is only for mobile devices.</h1>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Profile Section */}

      <div className="profile-section">
        <Link to={`/edituser/${user._id}`}>
          {user && user.image && (
            <img src={user.image} alt="Profile" className="profile-avatar" />
          )}
        </Link>
        <h3 className="profile-name">
          Hello, {user.Username || user.username || "guest"} 👋
        </h3>
        <p className="profile-status">Active Now ✅</p>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="active">All Chats</button>
      </div>

      {/* Users List */}
      <div className="user-list">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          users.map((u) => (
            <Link to={`/Chats/${u._id}`} className="users" key={u._id}>
              <div className="user-item">
                <img src={u.image} alt={u.Username} className="user-avatar" />
                <div className="user-details">
                  <span className="name">{u.Username}</span>
                  <br></br>
                  <span className="about">{u.About}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

