"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import "./Dashboard.css"
import { User, Search } from "lucide-react"

export const Dashboard = () => {
  const [username, setUsername] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [resumeLearning, setResumeLearning] = useState(null)
  const navigate = useNavigate()
  const searchResultsRef = useRef(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!token) {
        setUsername("Guest")
        return
      }

      try {
        const response = await fetch("http://localhost:5006/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUsername(user.name || data.user.name || "Guest")
          setResumeLearning(data.lastAccessedCourse)
        } else {
          console.error("Failed to fetch user profile")
          setUsername(user.name || "Guest")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setUsername(user.name || "Guest")
      }
    }

    fetchUserProfile()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const token = localStorage.getItem("token")
    console.log("Token from localStorage:", token)

    if (!token) {
      setError("No authentication token found. Please log in again.")
      setLoading(false)
      return
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      console.log("Request headers:", headers)

      const response = await fetch(`http://localhost:5006/api/courses/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: headers,
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
      }

      const data = await response.json()
      console.log("Fetched courses:", data)

      if (Array.isArray(data)) {
        setCourses(data)
      } else {
        console.error("Unexpected data format:", data)
        setError("Received unexpected data format from the server.")
      }

      // Scroll to search results after setting the courses
      setTimeout(() => {
        if (searchResultsRef.current) {
          searchResultsRef.current.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    } catch (error) {
      console.error("Error searching courses:", error)
      setError(`Failed to fetch courses: ${error.message}. Please try again later.`)
    } finally {
      setLoading(false)
    }
  }

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  const getThumbnailUrl = (course) => {
    if (course.snippet && course.snippet.thumbnails) {
      const thumbnails = course.snippet.thumbnails
      return thumbnails.medium?.url || thumbnails.default?.url || thumbnails.high?.url
    }
    return `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(course.snippet?.title || "Untitled Course")}`
  }

  const renderCourseCards = (coursesToRender) => {
    return coursesToRender.map((course) => (
      <Link key={course.id} to={`/course/${course.id}`} state={{ course }} className="course-card">
        <img
          src={course.thumbnailUrl || getThumbnailUrl(course)}
          alt={course.title || "Course thumbnail"}
          className="course-thumbnail"
        />
        <div className="course-info">
          <h3 className="course-title">{course.title || "Untitled Course"}</h3>
          <p className="course-instructor">{course.instructor || "Unknown Instructor"}</p>
          {course.isInstructorCreated && <span className="instructor-badge">Instructor Created</span>}
          {!course.isInstructorCreated && <span className="youtube-badge">YouTube</span>}
        </div>
      </Link>
    ))
  }

  return (
    <div className="dashboard-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`dashboard-wrapper ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <Link to="/profile" className="profile-icon">
          <User size={24} />
        </Link>
        <div className="dashboard-container">
          <h1 className="dashboard-greeting">Hi, {username}!</h1>
          <h2>Here you can access all your learning resources, track progress, and more.</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </div>

        {resumeLearning && (
          <div className="dashboard-container resume-learning">
            <h2>Resume Learning</h2>
            <div className="resume-course">
              <img
                src={getThumbnailUrl(resumeLearning) || "/placeholder.svg"}
                alt={resumeLearning.snippet?.title || resumeLearning.title}
                className="resume-thumbnail"
              />
              <div className="resume-details">
                <h3>{resumeLearning.snippet?.title || resumeLearning.title}</h3>
                <p>{resumeLearning.snippet?.channelTitle || resumeLearning.instructor || "Unknown Instructor"}</p>
                <button
                  onClick={() => navigate(`/course/${resumeLearning.id}`, { state: { course: resumeLearning } })}
                  className="resume-button"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-container" ref={searchResultsRef}>
          {searchQuery && (
            <>
              <h2>Search Results</h2>
              {loading && <p>Loading courses...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loading && !error && courses && courses.length > 0 ? (
                <div className="courses">{renderCourseCards(courses)}</div>
              ) : (
                !loading && !error && <p className="no-courses">No courses found. Try a different search term.</p>
              )}
            </>
          )}

          {!searchQuery && (
            <div className="search-placeholder">
              <img
                src={require("../../images/brain.png")}
                alt="Search for courses"
                className="search-illustration"
              />
              <p>Search for courses to start learning!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

