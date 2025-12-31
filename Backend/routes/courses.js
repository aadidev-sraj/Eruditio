const express = require("express")
const router = express.Router()
const Course = require("../models/Course")
const auth = require("../middleware/auth")
const axios = require("axios")

// Search courses
router.get("/search", auth, async (req, res) => {
  const { q } = req.query

  console.log("Search query received:", q)
  console.log("Authenticated user:", req.user)

  try {
    // Fetch instructor-created courses from the database
    const dbCourses = await Course.find({
      $or: [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }],
    })
      .populate("instructor", "name")
      .limit(10)

    console.log("Database courses found:", dbCourses.length)

    // Map the database courses to the expected format
    const formattedDbCourses = dbCourses.map((course) => ({
      id: course._id,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      instructor: course.instructor.name,
      createdAt: course.createdAt,
      isInstructorCreated: true,
    }))

    let youtubeCourses = []

    // Fetch YouTube courses
    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    if (!youtubeApiKey) {
      console.error("YouTube API key is missing")
    } else {
      try {
        const youtubeResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: "snippet",
            q: q + " course",
            type: "video",
            videoEmbeddable: true,
            maxResults: 10,
            key: youtubeApiKey,
          },
        })

        youtubeCourses = youtubeResponse.data.items.map((item) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          instructor: item.snippet.channelTitle,
          createdAt: item.snippet.publishedAt,
          isInstructorCreated: false,
        }))

        console.log("YouTube courses found:", youtubeCourses.length)
      } catch (youtubeError) {
        console.error("Error fetching YouTube courses:", youtubeError.message)
      }
    }

    // Combine and send the results, with database courses first
    const combinedResults = [...formattedDbCourses, ...youtubeCourses]
    res.json(combinedResults)
  } catch (error) {
    console.error("Error in course search:", error)
    res.status(500).json({ error: "An error occurred while searching for courses", details: error.message })
  }
})

// Get courses for the logged-in instructor
router.get("/instructor", auth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate("instructor", "name")
    res.json(courses)
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    res.status(500).json({ error: "An error occurred while fetching courses" })
  }
})

// Create a new course
router.post("/", auth, async (req, res) => {
  try {
    console.log("Received course creation request:", req.body)
    const { title, description, thumbnailUrl, videoUrl } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" })
    }

    // Use default values if thumbnailUrl or videoUrl are not provided
    const finalThumbnailUrl = thumbnailUrl || `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(title)}`

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" })
    }

    // Create a new course
    const newCourse = new Course({
      title,
      description,
      thumbnailUrl: finalThumbnailUrl,
      videoUrl,
      instructor: req.user.id, // Associate the course with the authenticated user
    })

    console.log("New course object:", newCourse)

    // Save the course
    await newCourse.save()

    // Populate the instructor field before sending the response
    await newCourse.populate("instructor", "name")

    console.log("New course created:", newCourse)

    res.status(201).json(newCourse)
  } catch (error) {
    console.error("Error creating course:", error)

    // Check for MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }))
      return res.status(400).json({
        error: "Validation error",
        details: validationErrors,
      })
    }

    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate key error",
        details: "A course with this information already exists",
      })
    }

    res.status(500).json({
      error: "An error occurred while creating the course",
      details: error.message,
    })
  }
})

// Get a specific course
router.get("/:id", auth, async (req, res) => {
  try {
    console.log("Fetching course with ID:", req.params.id)
    const course = await Course.findById(req.params.id).populate("instructor", "name")

    if (!course) {
      console.log("Course not found")
      return res.status(404).json({ message: "Course not found" })
    }

    console.log("Course found:", course)
    res.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

