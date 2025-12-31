const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const auth = require("../middleware/auth")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    // Accept images only for thumbnails
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed for thumbnails!"), false)
    }
  } else if (file.fieldname === "video") {
    // Accept videos only for videos
    if (!file.originalname.match(/\.(mp4|webm|mov|avi)$/)) {
      return cb(new Error("Only video files are allowed!"), false)
    }
  }
  cb(null, true)
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: fileFilter,
})

// Upload thumbnail
router.post("/thumbnail", auth, (req, res) => {
  upload.single("thumbnail")(req, res, (err) => {
    if (err) {
      console.error("Error uploading thumbnail:", err)
      return res.status(400).json({
        message: "Error uploading thumbnail",
        error: err.message,
      })
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Create URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const thumbnailUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.status(200).json({
      message: "File uploaded successfully",
      thumbnailUrl: thumbnailUrl,
    })
  })
})

// Upload video
router.post("/video", auth, (req, res) => {
  upload.single("video")(req, res, (err) => {
    if (err) {
      console.error("Error uploading video:", err)
      return res.status(400).json({
        message: "Error uploading video",
        error: err.message,
      })
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Create URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const videoUrl = `${baseUrl}/uploads/${req.file.filename}`

    res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl: videoUrl,
    })
  })
})

module.exports = router

