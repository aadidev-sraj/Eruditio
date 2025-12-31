"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { Search, Trash2, User } from 'lucide-react'
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./MyLearnings.css"

const MyLearnings = () => {
  const [continueWatching, setContinueWatching] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch("http://localhost:5006/api/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched enrollments:", data);
        setContinueWatching(data.continueWatching || [])
        setEnrolledCourses(data.enrolledCourses || [])
      } else {
        console.error("Failed to fetch enrollments")
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filterCourses = (courses) => {
    if (!Array.isArray(courses)) return []
    return courses.filter((course) => course.courseName.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleUnenroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5006/api/enrollments/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Successfully unenrolled from the course")
        fetchCourses() // Refresh the course list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to unenroll from the course")
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      toast.error("An error occurred while unenrolling from the course")
    }
  }

  const handleCourseClick = (course) => {
    // Determine if this is a YouTube course by checking the courseId format
    // YouTube IDs are typically 11 characters
    const isYouTubeCourse = course.courseId && course.courseId.length === 11;

    if (isYouTubeCourse) {
      // For YouTube courses, we need to format the data correctly
      const formattedCourse = {
        id: course.courseId,
        title: course.courseName,
        description: "YouTube course",
        instructor: course.instructor,
        thumbnailUrl: course.thumbnailUrl,
        isYouTubeCourse: true,
        snippet: {
          title: course.courseName,
          channelTitle: course.instructor,
          thumbnails: {
            medium: { url: course.thumbnailUrl }
          }
        }
      };

      // Navigate with the formatted course data
      navigate(`/course/${course.courseId}`, { state: { course: formattedCourse } });
    } else {
      // For regular courses, just navigate to the course page
      navigate(`/course/${course.courseId}`);
    }
  };

  const renderCourseSection = (title, courses) => {
    const filteredCourses = filterCourses(courses);
    const minCourses = 3;
    const filledCourses = [...filteredCourses];

    while (filledCourses.length < minCourses) {
      filledCourses.push({ id: `empty-${filledCourses.length}`, isEmpty: true });
    }

    return (
      <div className="dashboard-container courses-container">
        <h2>{title}</h2>
        <div className="courses">
          {filledCourses.map((course) => (
            <div key={course.id || course._id || course.courseId} className={`course-card ${course.isEmpty ? "empty-card" : ""}`}>
              {!course.isEmpty ? (
                <>
                  <div className="course-link" onClick={() => handleCourseClick(course)}>
                    <img
                      src={
                        course.thumbnailUrl ||
                        `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(course.courseName) || "Course"}`
                      }
                      alt={course.courseName}
                      className="course-thumbnail"
                    />
                    <div className="course-info">
                      <h3 className="course-title">{course.courseName}</h3>
                      <p className="course-instructor">{course.instructor}</p>
                    </div>
                  </div>
                  <button className="unenroll-button" onClick={() => handleUnenroll(course.courseId)}>
                    <Trash2 size={16} />
                    Unenroll
                  </button>
                  {title === "Continue Watching" && (
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-card-content">
                  <p>No course enrolled</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  return (
    <div className="my-learnings-page">
      <Sidebar onToggle={handleSidebarToggle} />
      <div className={`my-learnings-content ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <ToastContainer />
        <h1 className="dashboard-greeting">My Learnings</h1>
        <div className="dashboard-container">
          <form onSubmit={(e) => e.preventDefault()} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for courses..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading your courses...</div>
        ) : (
          <>
            {renderCourseSection("Continue Watching", continueWatching)}
            {renderCourseSection("Enrolled Courses", enrolledCourses)}
          </>
        )}
        <Link to="/profile" className="profile-icon">
          <User size={24} />
        </Link>
      </div>
    </div>
  )
}

export default MyLearnings
