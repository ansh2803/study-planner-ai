import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div>
        <nav className="navbar">
      <h2>AI Study Planner</h2>
      <div>
        <Link to="/generate">Generate Plan</Link>
        <Link to="/dashboard">Dashboard</Link>
         <button
          onClick={handleLogout}
          style={{
            marginLeft: "20px",
            background: "#e74c3c",
            border: "none",
            padding: "8px 14px",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
    </div>
  )
}

export default Navbar
