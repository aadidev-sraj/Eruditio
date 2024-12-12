import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Wrap the logo in a Link component */}
                <Link to="/" className="logo">Eruditio</Link>
                
                <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    <select className="program-dropdown">
                        <option value="">Program</option>
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
                    <Link to="/login" className="btn-ghost">Login</Link>
                    <Link to="/signup" className="btn-primary">Sign Up</Link>
                </div>
                
                <div className="navbar-toggle" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
