"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link, useLocation } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import AddAssignment from "../AddAssignment/AddAssignment"
import "./CourseView.css"
import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "../../config/api"


const CourseView = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [userUniqueId, setUserUniqueId] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [userRole, setUserRole] = useState(null)
  // Add a new state variable to track enrollment status
  const [isEnrolled, setIsEnrolled] = useState(false)

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if the course data is available in the location state
      if (location.state && location.state.course) {
        console.log("Course data from location state:", location.state.course)
        setCourse(location.state.course)
        setLoading(false)
        return
      }

      // If not, determine if it's a YouTube video ID (typically 11 characters)
      const isYoutubeId = courseId && courseId.length === 11

      // Get auth token
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching course data for courseId:", courseId, "isYoutubeId:", isYoutubeId)

      if (isYoutubeId) {
        // Try to fetch from YouTube API first
        try {
          console.log("Fetching from YouTube API")
          const youtubeResponse = await fetch(`${API_BASE_URL}/api/youtube/video/${courseId}`)

          if (!youtubeResponse.ok) {
            console.error("YouTube API error:", youtubeResponse.status)
            const errorData = await youtubeResponse.json()
            console.error("YouTube API error details:", errorData)
            throw new Error(`Failed to fetch YouTube course: ${errorData.error || "Unknown error"}`)
          }

          const youtubeData = await youtubeResponse.json()
          console.log("Fetched YouTube course data:", youtubeData)

          // Format YouTube data to match expected course structure
          const formattedCourse = {
            id: courseId,
            title: youtubeData.snippet.title,
            description: youtubeData.snippet.description,
            snippet: youtubeData.snippet,
            embedUrl: youtubeData.embedUrl || `https://www.youtube.com/embed/${courseId}`,
            isYouTubeCourse: true,
          }

          setCourse(formattedCourse)
          setLoading(false)
          return
        } catch (youtubeError) {
          console.error("Error fetching from YouTube API:", youtubeError)
          // If YouTube fetch fails, try database as fallback
        }
      }

      // Try to fetch from the database (for instructor-created courses)
      try {
        console.log("Fetching from database")
        const response = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            console.log("Course not found in database")
            throw new Error("Course not found in database")
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const courseData = await response.json()
        console.log("Fetched course data from database:", courseData)
        setCourse(courseData)
      } catch (dbError) {
        console.error("Error fetching from database:", dbError)

        // If we've already tried YouTube and database, and both failed
        if (isYoutubeId) {
          throw new Error("Course not found in YouTube or database")
        } else {
          throw new Error("Course not found in database")
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [courseId, location.state])

  const fetchAssignments = useCallback(async () => {
    if (courseId) {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }
        const response = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log("Fetched assignments:", data)
        setAssignments(data)
      } catch (error) {
        console.error("Error fetching assignments:", error)
        toast.error(`Failed to load assignments: ${error.message}`)
      }
    }
  }, [courseId])

  // Add this new function after the fetchAssignments function
  const checkEnrollmentStatus = useCallback(async () => {
    if (courseId) {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          return
        }

        console.log("Checking enrollment status for course:", courseId)

        const response = await fetch(`${API_ENDPOINTS.ENROLLMENTS}/check/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Enrollment status:", data.isEnrolled)
          setIsEnrolled(data.isEnrolled)
        } else {
          console.error("Failed to check enrollment status:", response.status)
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error)
      }
    }
  }, [courseId])

  useEffect(() => {
    console.log("CourseView received courseId:", courseId)
    fetchCourseData()
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user && user.uniqueId) {
      setUserUniqueId(user.uniqueId)
    }
    if (user && user.role) {
      setUserRole(user.role)
    }
  }, [courseId, fetchCourseData])

  useEffect(() => {
    if (course && !course.isYouTubeCourse) {
      fetchAssignments()
    }
  }, [course, fetchAssignments])

  // Add this useEffect to check enrollment status when component loads or userUniqueId changes
  useEffect(() => {
    if (userRole === "student") {
      checkEnrollmentStatus()
    }
  }, [userRole, checkEnrollmentStatus])

  // Function to format YouTube URL for embedding
  const getEmbedUrl = (url) => {
    if (!url) return ""

    try {
      // Check if it's already an embed URL
      if (url.includes("youtube.com/embed/")) {
        return url
      }

      // Extract video ID from various YouTube URL formats
      let videoId = ""

      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes("youtube.com/watch")) {
        const urlObj = new URL(url)
        videoId = urlObj.searchParams.get("v")
      }
      // Format: https://youtu.be/VIDEO_ID
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0]
      }
      // Format: https://www.youtube.com/v/VIDEO_ID
      else if (url.includes("youtube.com/v/")) {
        videoId = url.split("/v/")[1].split("?")[0]
      }
      // If the URL is just the video ID
      else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
        videoId = url
      }

      if (videoId) {
        console.log("Extracted YouTube video ID:", videoId)
        return `https://www.youtube.com/embed/${videoId}`
      }

      // If we couldn't parse it, return the original URL
      console.log("Could not parse YouTube URL, using as is:", url)
      return url
    } catch (error) {
      console.error("Error parsing video URL:", error, url)
      return url
    }
  }

  // Modify the handleEnrollNow function to update the isEnrolled state on success
  const handleEnrollNow = async () => {
    if (course && !enrolling) {
      setEnrolling(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (!user || !user.uniqueId) {
          throw new Error("User information not found. Please log in again.")
        }

        // Determine course ID based on course type
        const courseIdentifier = isYouTubeCourse ? course.id : course._id

        // Determine course name and instructor based on course type
        const courseName = course.title || course.snippet?.title || "Untitled Course"
        const instructorName =
          course.instructor?.name || course.instructor || course.snippet?.channelTitle || "Unknown Instructor"

        // Determine thumbnail URL based on course type
        const thumbnailUrl =
          course.thumbnailUrl ||
          course.snippet?.thumbnails?.medium?.url ||
          `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(courseName)}`

        console.log("Sending enrollment request with data:", {
          userUniqueId: user.uniqueId,
          courseId: courseIdentifier,
          courseName,
          instructor: instructorName,
          thumbnailUrl,
        })

        const response = await fetch("http://localhost:5006/api/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userUniqueId: user.uniqueId,
            courseId: courseIdentifier,
            courseName,
            instructor: instructorName,
            thumbnailUrl,
          }),
        })

        // Log the raw response for debugging
        const responseText = await response.text()
        console.log("Raw enrollment response:", responseText)

        // Parse the response if it's JSON
        let result
        try {
          result = JSON.parse(responseText)
        } catch (e) {
          console.error("Failed to parse response as JSON:", e)
          throw new Error("Server returned an invalid response")
        }

        if (response.ok) {
          toast.success("You have successfully enrolled in this course!")
          setIsEnrolled(true)
          // Refresh enrollment status
          checkEnrollmentStatus()
        } else {
          toast.error(result.message || "Failed to enroll in the course. Please try again.")
        }
      } catch (error) {
        console.error("Error enrolling in course:", error)
        toast.error(`An error occurred while enrolling: ${error.message}`)
      } finally {
        setEnrolling(false)
      }
    }
  }

  const handleAddAssignment = () => {
    if (course && courseId) {
      console.log("Opening AddAssignment with courseId:", courseId)
      setShowAddAssignment(true)
    } else {
      console.error("Cannot add assignment: Course ID is missing")
      toast.error("Cannot add assignment: Course data is not available")
    }
  }

  const handleCloseAddAssignment = () => {
    setShowAddAssignment(false)
    fetchAssignments()
  }

  const renderInstructorName = (course) => {
    if (course.instructor && typeof course.instructor === "object") {
      return course.instructor.name || "Unknown Instructor"
    }
    if (course.instructor && typeof course.instructor === "string") {
      return course.instructor
    }
    if (course.snippet && course.snippet.channelTitle) {
      return course.snippet.channelTitle
    }
    return "Unknown Instructor"
  }

  const renderAssignments = () => {
    if (!assignments || assignments.length === 0) {
      return <p className="no-assignments">No assignments available for this course.</p>
    }

    return (
      <div className="assignments-grid">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="assignment-card">
            <h4>{assignment.title}</h4>
            <p>{assignment.questions.length} questions</p>
            <Link to={`/assignment/${assignment.assignmentId}`} className="take-assignment-btn">
              {userRole === "student" ? "Take Assignment" : "View Assignment"}
            </Link>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="loading">Loading course...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchCourseData} className="btn-primary">
          Retry Loading Course
        </button>
      </div>
    )
  }

  if (!course) {
    return <div className="error">Course not found.</div>
  }

  // Determine if this is a YouTube course
  const isYouTubeCourse = course.isYouTubeCourse || (course.id && !course._id)

  // Get the correct video URL for embedding
  let videoUrl = ""
  if (isYouTubeCourse) {
    // If we have an embedUrl from the API, use it
    if (course.embedUrl) {
      videoUrl = course.embedUrl
    } else {
      // Otherwise construct it from the ID
      videoUrl = `https://www.youtube.com/embed/${course.id}`
    }
    console.log("Using YouTube embed URL:", videoUrl)
  } else {
    // For custom uploaded videos or other URLs
    videoUrl = getEmbedUrl(course.videoUrl)
    console.log("Using custom video URL:", videoUrl)
  }

  return (
    <div className="course-view">
      <ToastContainer />
      <div className="course-main">
        <div className="video-container">
          <iframe
            src={videoUrl}
            title={course.title || course.snippet?.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="course-video-iframe"
            onError={(e) => {
              console.error("Error loading iframe:", e)
              e.target.src = videoUrl // Try reloading
            }}
          ></iframe>
        </div>
        <h1 className="course-title">{course.title || course.snippet?.title}</h1>
        <div className="course-info">
          <span>
            Uploaded: {new Date(course.createdAt || course.snippet?.publishedAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
        <div className="instructor-info">
          <h2>Instructor</h2>
          <p>{renderInstructorName(course)}</p>
        </div>
        <div className="course-description">{course.description || course.snippet?.description}</div>
        {!isYouTubeCourse && (
          <div className="assignments-section">
            <h3>Assignments</h3>
            {renderAssignments()}
            {userRole === "instructor" && (
              <button onClick={handleAddAssignment} className="add-assignment-btn">
                Add Assignment
              </button>
            )}
          </div>
        )}
        {userRole === "student" && !isEnrolled ? (
          <button className="enroll-now-btn" onClick={handleEnrollNow} disabled={enrolling}>
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        ) : userRole === "student" && isEnrolled ? (
          <div className="enrolled-badge">
            <span>✓ Enrolled</span>
          </div>
        ) : null}
      </div>
      {showAddAssignment && courseId && <AddAssignment courseId={courseId} onClose={handleCloseAddAssignment} />}
    </div>
  )
}

export default CourseView

