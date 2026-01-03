import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { User, Mail, BookOpen, Award, Calendar, Clock } from "lucide-react"
import "./Profile.css"
import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "../../config/api"


const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("You must be logged in to view this page")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(API_ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token")
            navigate("/login")
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError(`Failed to load user profile: ${error.message}. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  if (loading) return <div className="loading">Loading profile...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="profile-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`profile-content ${isSidebarExpanded ? "" : "sidebar-collapsed"}`}>
        <div className="dashboard-container">
          <h1 className="dashboard-greeting">User Profile</h1>
          {user && (
            <div className="profile-info">
              <div className="profile-header">
                <div className="profile-avatar">
                  <img
                    src="/placeholder.svg?height=100&width=100&text=Avatar"
                    alt="User Avatar"
                    className="avatar-image"
                  />
                </div>
                <div className="profile-name-role">
                  <h2 className="user-name">{user.name}</h2>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <User size={20} />
                  <p>
                    <strong>User ID:</strong> {user.uniqueId}
                  </p>
                </div>
                <div className="detail-item">
                  <Mail size={20} />
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
                <div className="detail-item">
                  <BookOpen size={20} />
                  <p>
                    <strong>Courses Enrolled:</strong> {user.coursesEnrolled || 0}
                  </p>
                </div>
                <div className="detail-item">
                  <Award size={20} />
                  <p>
                    <strong>Certificates Earned:</strong> {user.certificatesEarned || 0}
                  </p>
                </div>
                <div className="detail-item">
                  <Calendar size={20} />
                  <p>
                    <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="detail-item">
                  <Clock size={20} />
                  <p>
                    <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <Link to="/dashboard" className="back-to-dashboard">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Profile

