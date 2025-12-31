const express = require("express")
const router = express.Router()
const axios = require("axios")

// Search YouTube videos
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      console.error("YouTube API key is not configured")
      return res.status(500).json({ error: "YouTube API key is not configured" })
    }

    console.log(`Searching YouTube for: "${q}"`)

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        maxResults: 10,
        q: q + " course tutorial",
        type: "video",
        key: apiKey,
      },
    })

    console.log(`Found ${response.data.items.length} YouTube videos`)
    res.json(response.data.items)
  } catch (error) {
    console.error("YouTube API error:", error.response ? error.response.data : error.message)
    res.status(500).json({ error: "Failed to fetch videos from YouTube" })
  }
})

// Get a specific YouTube video by ID
router.get("/video/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      console.error("YouTube API key is not configured")
      return res.status(500).json({ error: "YouTube API key is not configured" })
    }

    console.log(`Fetching YouTube video with ID: ${videoId}`)

    // First check if the video ID is valid (11 characters for YouTube IDs)
    if (!videoId || videoId.length !== 11) {
      console.error(`Invalid YouTube video ID: ${videoId}`)
      return res.status(400).json({ error: "Invalid YouTube video ID" })
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
      params: {
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: apiKey,
      },
      timeout: 10000, // 10 second timeout
    })

    if (response.data.items.length === 0) {
      console.log(`YouTube video with ID ${videoId} not found`)
      return res.status(404).json({ error: "Video not found" })
    }

    console.log(`Successfully fetched YouTube video: ${response.data.items[0].snippet.title}`)

    // Add a direct embed URL to the response
    const videoData = response.data.items[0]
    videoData.embedUrl = `https://www.youtube.com/embed/${videoId}`

    res.json(videoData)
  } catch (error) {
    console.error("YouTube API error:", error.response ? error.response.data : error.message)

    // Provide more detailed error information
    const errorMessage = error.response
      ? `YouTube API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      : `Error: ${error.message}`

    console.error(errorMessage)

    res.status(500).json({
      error: "Failed to fetch video from YouTube",
      details: errorMessage,
      videoId: req.params.videoId,
    })
  }
})

module.exports = router

