"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { User, FileText, Trash2 } from "lucide-react"
import "./MyCourses.css"
import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "../../config/api"


const MyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(API_ENDPOINTS.COURSES_INSTRUCTOR, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched courses:", data)
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setCourses(courses.filter((course) => course._id !== courseId))
        } else {
          throw new Error("Failed to delete course")
        }
      } catch (error) {
        console.error("Error deleting course:", error)
        alert("Failed to delete course. Please try again.")
      }
    }
  }

  const getThumbnailUrl = (course) => {
    if (!course.thumbnailUrl) return "/placeholder.svg"

    // If it's already a full URL (http/https), use it as is
    if (course.thumbnailUrl.startsWith("http")) {
      return course.thumbnailUrl
    }

    // If it starts with /uploads, prepend backend URL
    if (course.thumbnailUrl.startsWith("/uploads")) {
      return `${API_BASE_URL}${course.thumbnailUrl}`
    }

    // Otherwise, use as is
    return course.thumbnailUrl
  }

  const handleAssign = (courseId) => {
    console.log("Navigating to add assignment for course:", courseId)
    navigate(`/add-assignment/${courseId}`)
  }

  if (loading) return <div className="loading">Loading courses...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="my-courses-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`my-courses-content ${isSidebarExpanded ? "" : "sidebar-collapsed"}`}>
        <h1 className="my-courses-title">My Courses</h1>
        <Link to="/add-course" className="add-course-btn">
          Add New Course
        </Link>
        <div className="courses-grid">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-card-header">
                  <h3>{course.title}</h3>
                </div>
                <img src={getThumbnailUrl(course)} alt={course.title} className="course-thumbnail" />
                <div className="course-card-content">
                  <p>{course.description}</p>
                  <div className="course-actions">
                    <button onClick={() => handleAssign(course._id)} className="assign-btn">
                      <FileText size={16} />
                      Assign
                    </button>
                    <button onClick={() => handleDeleteCourse(course._id)} className="delete-btn">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>You haven't created any courses yet.</p>
          )}
        </div>
        <Link to="/profile" className="profile-icon">
          <User size={24} />
        </Link>
      </div>
    </div>
  )
}

export default MyCourses

