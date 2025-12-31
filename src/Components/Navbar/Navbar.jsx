"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import "./Navbar.css"

const Navbar = ({ onProgramChange }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const handleProgramChange = (e) => {
    onProgramChange(e.target.value)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Eruditio
        </Link>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <select className="program-dropdown" onChange={handleProgramChange}>
            <option value="">All Programs</option>
            <option value="agriculture">Agriculture</option>
            <option value="banking">Banking</option>
            <option value="commerce">Commerce</option>
            <option value="digital_media">Digital Media</option>
            <option value="economics">Economics</option>
            <option value="engineering">Engineering</option>
            <option value="fashion_design">Fashion Design</option>
            <option value="finance">Finance</option>
            <option value="foreign_languages">Foreign Languages</option>
            <option value="graphic_design">Graphic Design</option>
            <option value="healthcare">Healthcare</option>
            <option value="hospitality_management">Hospitality Management</option>
            <option value="human_resources">Human Resources</option>
            <option value="industrial_design">Industrial Design</option>
            <option value="information_technology">Information Technology</option>
            <option value="law">Law</option>
            <option value="literature">Literature</option>
            <option value="management">Management</option>
            <option value="mathematics">Mathematics</option>
            <option value="psychology">Psychology</option>
          </select>
          <Link to="/login" className="btn-ghost">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar

