"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { User, Upload } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./AddCourse.css"

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const navigate = useNavigate()

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData({ ...courseData, [name]: value })
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail file is too large. Maximum size is 5MB.")
      return
    }

    setThumbnailFile(file)

    // Create a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file)
    setThumbnailPreview(previewUrl)
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file is too large. Maximum size is 100MB.")
      return
    }

    setVideoFile(file)

    // Create a preview URL for the selected file
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)

    // Clear the videoUrl field since we're uploading a file
    setCourseData({ ...courseData, videoUrl: "" })
  }

  const uploadFile = async (file, type) => {
    if (!file) return null

    const formData = new FormData()
    formData.append(type, file)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log(`Uploading ${type}:`, file.name)
      toast.info(`Uploading ${type}...`)

      const response = await fetch(`http://localhost:5006/api/upload/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to upload ${type}`)
      }

      const data = await response.json()
      toast.success(`${type} uploaded successfully`)
      return type === "thumbnail" ? data.thumbnailUrl : data.videoUrl
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast.error(`${type} upload failed: ${error.message}`)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Validate required fields
      if (!courseData.title.trim()) {
        throw new Error("Please enter a course title")
      }
      if (!courseData.description.trim()) {
        throw new Error("Please enter a course description")
      }
      if (!videoFile && !courseData.videoUrl.trim()) {
        throw new Error("Please provide a video URL or upload a video file")
      }

      // Handle thumbnail upload or URL
      let finalThumbnailUrl = courseData.thumbnailUrl
      if (thumbnailFile) {
        try {
          finalThumbnailUrl = await uploadFile(thumbnailFile, "thumbnail")
        } catch (thumbnailError) {
          console.error("Thumbnail upload failed:", thumbnailError)
          // Continue with course creation even if thumbnail upload fails
        }
      }

      // If no thumbnail URL or file was provided, use a placeholder
      if (!finalThumbnailUrl) {
        finalThumbnailUrl = `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(courseData.title)}`
      }

      // Handle video upload or URL
      let finalVideoUrl = courseData.videoUrl
      if (videoFile) {
        try {
          finalVideoUrl = await uploadFile(videoFile, "video")
        } catch (videoError) {
          throw new Error(`Failed to upload video: ${videoError.message}`)
        }
      }

      const courseDataToSubmit = {
        ...courseData,
        thumbnailUrl: finalThumbnailUrl,
        videoUrl: finalVideoUrl,
      }

      console.log("Submitting course data:", courseDataToSubmit)
      toast.info("Creating course...")

      const response = await fetch("http://localhost:5006/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseDataToSubmit),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Failed to create course")
      }

      const newCourse = await response.json()
      console.log("New course created:", newCourse)
      toast.success("Course created successfully!")
      navigate(`/course/${newCourse._id}`)
    } catch (error) {
      console.error("Error creating course:", error)
      setError(error.message || "Failed to create course. Please try again.")
      toast.error(error.message || "Failed to create course. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-course-layout">
      <Sidebar onToggle={handleSidebarToggle} />
      <ToastContainer />
      <div className={`add-course-content ${isSidebarExpanded ? "" : "sidebar-collapsed"}`}>
        <h1 className="add-course-title">Add New Course</h1>
        <form onSubmit={handleSubmit} className="add-course-form">
          <div className="form-group">
            <label htmlFor="title">Course Title</label>
            <input type="text" id="title" name="title" value={courseData.title} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Course Description</label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="thumbnailFile">Course Thumbnail</label>
            <div className="file-upload-container">
              <div className="file-upload-box" onClick={() => document.getElementById("thumbnailFile").click()}>
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    className="thumbnail-preview"
                  />
                ) : (
                  <>
                    <Upload size={24} />
                    <span>Click to upload thumbnail</span>
                  </>
                )}
              </div>
              <input
                type="file"
                id="thumbnailFile"
                name="thumbnailFile"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: "none" }}
              />
            </div>
            <p className="form-hint">Or provide a URL:</p>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={courseData.thumbnailUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video">Course Video</label>
            <div className="file-upload-container">
              <div
                className="file-upload-box video-upload-box"
                onClick={() => document.getElementById("videoFile").click()}
              >
                {videoPreview ? (
                  <video src={videoPreview} controls className="video-preview"></video>
                ) : (
                  <>
                    <Upload size={24} />
                    <span>Click to upload video</span>
                    <p className="upload-hint">Supported formats: MP4, WebM, MOV (max 100MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="separator">
              <span>OR</span>
            </div>
            <label htmlFor="videoUrl">Video URL</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={courseData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              disabled={videoFile !== null}
            />
            <p className="form-hint">YouTube links are supported (e.g., https://www.youtube.com/watch?v=VIDEO_ID)</p>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Course..." : "Create Course"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <Link to="/profile" className="profile-icon">
          <User size={24} />
        </Link>
      </div>
    </div>
  )
}

export default AddCourse

