const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/User")
const Enrollment = require("../models/Enrollment")

router.post("/", auth, async (req, res) => {
  try {
    const { userUniqueId, courseId, courseName, instructor, thumbnailUrl } = req.body

    console.log("Enrollment request received:", { userUniqueId, courseId, courseName, instructor, thumbnailUrl })

    // Validate required fields
    if (!userUniqueId || !courseId || !courseName) {
      console.error("Missing required fields:", { userUniqueId, courseId, courseName })
      return res.status(400).json({ message: "Missing required fields for enrollment" })
    }

    // Check if the user exists
    const user = await User.findOne({ uniqueId: userUniqueId })
    if (!user) {
      console.error("User not found:", userUniqueId)
      return res.status(404).json({ message: "User not found" })
    }

    console.log("User found:", user._id)

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ userId: user._id, courseId })
    if (existingEnrollment) {
      console.log("User already enrolled:", { userUniqueId, courseId })
      return res.status(400).json({ message: "You are already enrolled in this course." })
    }

    // Use a default instructor if none provided
    const finalInstructor = instructor || "Unknown Instructor"

    // Use a default thumbnail if none provided
    const finalThumbnailUrl =
      thumbnailUrl || `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(courseName)}`

    // Create new enrollment
    const enrollment = new Enrollment({
      userId: user._id,
      courseId,
      courseName,
      instructor: finalInstructor,
      thumbnailUrl: finalThumbnailUrl,
    })

    console.log("Creating enrollment:", enrollment)

    await enrollment.save()
    console.log("Enrollment saved successfully:", enrollment)

    res.status(201).json({ message: "Successfully enrolled in the course.", enrollment })
  } catch (error) {
    console.error("Error in enrollment process:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

