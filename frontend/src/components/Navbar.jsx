import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
        <nav className="navbar">
      <h2>AI Study Planner</h2>
      <div>
        <Link to="/generate">Generate Plan</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
    </div>
  )
}

export default Navbar
