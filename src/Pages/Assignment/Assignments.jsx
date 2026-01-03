import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { User, Calendar } from "lucide-react"
import "./Assignments.css"
import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "../../config/api"


const Assignments = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(API_ENDPOINTS.ENROLLMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch enrollments")
      }

      const data = await response.json()
      setEnrolledCourses(data.enrolledCourses || [])
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
      setError("Failed to load enrolled courses. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  if (loading) return <div className="loading">Loading assignments...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="assignments-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`assignments-content ${isSidebarExpanded ? "" : "sidebar-collapsed"}`}>
        <h1 className="assignments-title">Assignments</h1>
        <div className="due-today">
          <Calendar className="inline-block mr-2" size={20} />
          <span className="font-semibold">Due Today</span>
        </div>
        <div className="enrolled-courses">
          <h2>Select a course to take the assignment:</h2>
          {enrolledCourses.length > 0 ? (
            <ul className="course-list">
              {enrolledCourses.map((course) => (
                <li key={course.courseId}>
                  <Link to={`/assignments/${course.courseId}`} className="course-link">
                    {course.courseName}
                    <span className="due-time">Due 11:59PM</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You are not enrolled in any courses yet.</p>
          )}
        </div>
        <Link to="/profile" className="profile-icon">
          <User size={24} />
        </Link>
      </div>
    </div>
  )
}

export default Assignments

