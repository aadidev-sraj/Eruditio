const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Enrollment = require("../models/Enrollment")

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const enrollments = await Enrollment.find({ userId }).sort({ enrollmentDate: -1 })
    console.log(`Found ${enrollments.length} enrollments for user ${userId}`)

    // For simplicity, we're treating all enrollments as "continue watching"
    // In a real application, you'd have logic to determine which courses are in progress
    const continueWatching = enrollments.map((enrollment) => ({
      courseId: enrollment.courseId,
      courseName: enrollment.courseName,
      instructor: enrollment.instructor,
      thumbnailUrl: enrollment.thumbnailUrl,
      progress: Math.floor(Math.random() * 100), // Mock progress
      enrollmentDate: enrollment.enrollmentDate,
    }))

    res.json({
      continueWatching,
      enrolledCourses: enrollments,
    })
  } catch (error) {
    console.error("Error fetching enrollments:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update the check enrollment route to handle both YouTube and instructor-created courses

// Add this new route to check if a user is enrolled in a specific course
router.get("/check/:courseId", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params

    console.log(`Checking if user ${userId} is enrolled in course ${courseId}`)

    const enrollment = await Enrollment.findOne({ userId, courseId })

    console.log("Enrollment check result:", !!enrollment)

    res.json({
      isEnrolled: !!enrollment,
    })
  } catch (error) {
    console.error("Error checking enrollment status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

router.delete("/:courseId", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params

    console.log(`Attempting to unenroll user ${userId} from course ${courseId}`)

    const result = await Enrollment.findOneAndDelete({ userId, courseId })

    if (result) {
      console.log(`Successfully unenrolled user ${userId} from course ${courseId}`)
      res.json({ message: "Successfully unenrolled from the course" })
    } else {
      console.log(`Enrollment not found for user ${userId} and course ${courseId}`)
      res.status(404).json({ message: "Enrollment not found" })
    }
  } catch (error) {
    console.error("Error unenrolling from course:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

