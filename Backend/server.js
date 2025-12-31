require("dotenv").config()
try {
  require("multer")
} catch (error) {
  console.error("Error: The 'multer' package is not installed.")
  console.error("Please install it by running: npm install multer")
  console.error("Then restart the server.")
}
if (!process.env.YOUTUBE_API_KEY) {
  console.error("YOUTUBE_API_KEY is not set in the environment variables")
  process.exit(1)
}

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const axios = require("axios")
const authRoutes = require("./routes/auth")
const profileRoutes = require("./routes/profile")
const forgotPasswordRoutes = require("./routes/forgotPassword")
const enrollmentRoutes = require("./routes/enrollment")
const enrollmentsRoutes = require("./routes/enrollments")
const assignmentsRoutes = require("./routes/assignments")
const coursesRoutes = require("./routes/courses")
const youtubeRoutes = require("./routes/youtube")
const uploadRoutes = require("./routes/upload")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from uploads directory
const path = require("path")
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/auth", forgotPasswordRoutes)
app.use("/api/enroll", enrollmentRoutes)
app.use("/api/enrollments", enrollmentsRoutes)
app.use("/api/assignments", assignmentsRoutes)
app.use("/api/courses", coursesRoutes)
app.use("/api/upload", uploadRoutes)

// YouTube API route
app.get("/api/youtube/search", async (req, res) => {
  const { q } = req.query
  const API_KEY = process.env.YOUTUBE_API_KEY

  if (!API_KEY) {
    console.error("YouTube API key is not set")
    return res.status(400).json({ error: "YouTube API key is not configured" })
  }

  try {
    console.log("Searching YouTube for:", q)

    // First, search for videos
    const searchResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: q + " course lecture",
        type: "video",
        videoDuration: "any",
        maxResults: 50,
        key: API_KEY,
      },
    })

    console.log("Search response items:", searchResponse.data.items.length)

    // Get video IDs
    const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(",")

    console.log("Video IDs:", videoIds)

    // Then, get video details including duration
    const videoDetailsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
      params: {
        part: "contentDetails,snippet,statistics",
        id: videoIds,
        key: API_KEY,
      },
    })

    console.log("Video details response items:", videoDetailsResponse.data.items.length)

    // Filter videos longer than 10 minutes and with more than 1000 views
    const filteredVideos = videoDetailsResponse.data.items
      .filter((video) => {
        try {
          const duration = video.contentDetails.duration
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
          if (!match) {
            console.warn(`Invalid duration format for video ${video.id}: ${duration}`)
            return false
          }
          const hours = Number.parseInt(match[1] || "0")
          const minutes = Number.parseInt(match[2] || "0")
          const seconds = Number.parseInt(match[3] || "0")
          const totalMinutes = hours * 60 + minutes + seconds / 60
          const views = Number.parseInt(video.statistics.viewCount) || 0
          return totalMinutes >= 10 && views > 1000
        } catch (error) {
          console.error(`Error processing video ${video.id}:`, error)
          return false
        }
      })
      .map((video) => ({
        ...video,
        snippet: {
          ...video.snippet,
          channelTitle: video.snippet.channelTitle, // Include the channel title (instructor name)
        },
      }))

    console.log("Filtered videos:", filteredVideos.length)

    res.json(filteredVideos)
  } catch (error) {
    console.error("YouTube API Error:", error.response ? error.response.data : error.message)
    res.status(500).json({ error: "An error occurred while fetching data from YouTube API" })
  }
})

// Test route for YouTube API
app.get("/api/youtube/test", async (req, res) => {
  const API_KEY = process.env.YOUTUBE_API_KEY

  if (!API_KEY) {
    return res.status(400).json({ error: "YouTube API key is not configured" })
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: "test video",
        type: "video",
        maxResults: 1,
        key: API_KEY,
      },
    })

    res.json({
      status: "success",
      message: "YouTube API is working correctly",
      data: response.data,
    })
  } catch (error) {
    console.error("YouTube API Test Error:", error.response ? error.response.data : error.message)
    res.status(500).json({
      status: "error",
      message: "YouTube API test failed",
      error: error.response ? error.response.data : error.message,
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message)
  })

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Log environment variables (excluding sensitive information)
console.log("Environment variables:")
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set")
console.log("YOUTUBE_API_KEY:", process.env.YOUTUBE_API_KEY ? "Set" : "Not set")
console.log("EMAIL_USERNAME:", process.env.EMAIL_USERNAME ? "Set" : "Not set")
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Not set")

console.log("Environment variables loaded:", Object.keys(process.env))

