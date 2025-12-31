const express = require("express")
const router = express.Router()
const path = require("path")
const auth = require("../middleware/auth")
const Course = require(path.join(__dirname, "..", "models", "Course"))
const Assignment = require(path.join(__dirname, "..", "models", "Assignment"))
const Submission = require(path.join(__dirname, "..", "models", "Submission"))
const AssignmentStart = require(path.join(__dirname, "..", "models", "AssignmentStart"))

// Create a new assignment
router.post("/", auth, async (req, res) => {
  try {
    console.log("Received assignment data:", req.body)
    console.log("Authenticated user:", req.user)
    const { courseId, title, questions } = req.body

    if (!courseId) {
      console.error("Course ID is missing in the request")
      return res.status(400).json({ message: "Course ID is required" })
    }

    // Check if the course exists and the user is the instructor
    const course = await Course.findById(courseId)
    if (!course) {
      console.error(`Course not found for ID: ${courseId}`)
      return res.status(404).json({ message: "Course not found" })
    }
    if (course.instructor.toString() !== req.user.id) {
      console.error(`User ${req.user.id} is not authorized to add assignments to course ${courseId}`)
      return res.status(401).json({ message: "Not authorized to add assignments to this course" })
    }

    const newAssignment = new Assignment({
      courseId,
      title,
      questions,
    })

    console.log("Creating new assignment:", newAssignment)

    const assignment = await newAssignment.save()
    console.log("Assignment saved successfully:", assignment)

    res.status(201).json(assignment)
  } catch (error) {
    console.error("Error creating assignment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get assignments for a course
router.get("/course/:courseId", auth, async (req, res) => {
  try {
    console.log("Fetching assignments for course:", req.params.courseId)
    const assignments = await Assignment.find({ courseId: req.params.courseId })
    console.log("Found assignments:", assignments.length)
    res.json(assignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get a specific assignment
router.get("/:assignmentId", auth, async (req, res) => {
  try {
    console.log("Fetching assignment with ID:", req.params.assignmentId)
    const assignment = await Assignment.findOne({ assignmentId: req.params.assignmentId })
    if (!assignment) {
      console.log("Assignment not found")
      return res.status(404).json({ message: "Assignment not found" })
    }
    console.log("Assignment found:", assignment)
    res.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Start an assignment (begins timer)
router.post("/:assignmentId/start", auth, async (req, res) => {
  try {
    const { assignmentId } = req.params
    const userId = req.user.id

    // Check if assignment exists
    const assignment = await Assignment.findOne({ assignmentId })
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    // Check if already started
    let assignmentStart = await AssignmentStart.findOne({ assignmentId, userId })

    if (assignmentStart) {
      // Return existing start time
      return res.json({
        startedAt: assignmentStart.startedAt,
        expiresAt: assignmentStart.expiresAt,
        timeRemaining: assignmentStart.expiresAt - Date.now(),
      })
    }

    // Create new start record
    const startedAt = new Date()
    const expiresAt = new Date(startedAt.getTime() + assignment.timeLimit)

    assignmentStart = new AssignmentStart({
      assignmentId,
      userId,
      startedAt,
      expiresAt,
    })

    await assignmentStart.save()

    res.json({
      startedAt,
      expiresAt,
      timeRemaining: assignment.timeLimit,
    })
  } catch (error) {
    console.error("Error starting assignment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Check assignment time status
router.get("/:assignmentId/time-status", auth, async (req, res) => {
  try {
    const { assignmentId } = req.params
    const userId = req.user.id

    const assignmentStart = await AssignmentStart.findOne({ assignmentId, userId })

    if (!assignmentStart) {
      return res.json({ started: false })
    }

    const now = Date.now()
    const timeRemaining = Math.max(0, assignmentStart.expiresAt - now)
    const expired = timeRemaining === 0

    res.json({
      started: true,
      startedAt: assignmentStart.startedAt,
      expiresAt: assignmentStart.expiresAt,
      timeRemaining,
      expired,
      completed: assignmentStart.completed,
    })
  } catch (error) {
    console.error("Error checking time status:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Submit an assignment
router.post("/:assignmentId/submit", auth, async (req, res) => {
  try {
    const { assignmentId } = req.params
    const { answers } = req.body
    const userId = req.user.id

    // Check if assignment was started and if time limit is still valid
    const assignmentStart = await AssignmentStart.findOne({ assignmentId, userId })

    if (assignmentStart) {
      const now = Date.now()
      if (now > assignmentStart.expiresAt.getTime()) {
        return res.status(400).json({
          message: "Time limit exceeded. Assignment cannot be submitted.",
          expired: true
        })
      }
      // Mark as completed
      assignmentStart.completed = true
      await assignmentStart.save()
    }

    const assignment = await Assignment.findOne({ assignmentId })
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    // Calculate the grade
    let correctAnswers = 0
    const gradedAnswers = answers.map((answer, index) => {
      const isCorrect = answer === assignment.questions[index].correctAnswer
      if (isCorrect) correctAnswers++
      return {
        questionIndex: index,
        selectedAnswer: answer,
        isCorrect,
      }
    })

    const totalQuestions = assignment.questions.length
    const grade = (correctAnswers / totalQuestions) * 100

    // Create a new submission
    const submission = new Submission({
      assignmentId,
      userId,
      grade,
      answers: gradedAnswers,
    })

    await submission.save()

    res.json({
      submissionId: submission.submissionId,
      grade,
      totalQuestions,
      correctAnswers,
    })
  } catch (error) {
    console.error("Error submitting assignment:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

