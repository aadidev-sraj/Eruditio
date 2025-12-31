"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { Home, Book, LogOut, Menu, FileText, Video } from "lucide-react"
import "./Sidebar.css"

const Sidebar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [userRole, setUserRole] = useState("student")

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.role) {
      setUserRole(user.role)
    }
  }, [])

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    onToggle(newExpandedState)
  }

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h2 className="sidebar-title">{isExpanded ? "Eruditio" : "E"}</h2>
      <nav>
        <NavLink to="/dashboard" className="sidebar-item" activeClassName="active">
          <Home size={24} />
          {isExpanded && <span>Home</span>}
        </NavLink>
        {userRole === "student" ? (
          <NavLink to="/my-learnings" className="sidebar-item" activeClassName="active">
            <Book size={24} />
            {isExpanded && <span>My Learnings</span>}
          </NavLink>
        ) : (
          <NavLink to="/my-courses" className="sidebar-item" activeClassName="active">
            <Video size={24} />
            {isExpanded && <span>My Courses</span>}
          </NavLink>
        )}
        {userRole === "student" && (
          <NavLink to="/assignments" className="sidebar-item" activeClassName="active">
            <FileText size={24} />
            {isExpanded && <span>Assignments</span>}
          </NavLink>
        )}
        {userRole === "instructor" && (
          <NavLink to="/add-course" className="sidebar-item" activeClassName="active">
            <FileText size={24} />
            {isExpanded && <span>Add Course</span>}
          </NavLink>
        )}
        <NavLink to="/" className="sidebar-item logout">
          <LogOut size={24} />
          {isExpanded && <span>Log Out</span>}
        </NavLink>
      </nav>
    </div>
  )
}

export default Sidebar

