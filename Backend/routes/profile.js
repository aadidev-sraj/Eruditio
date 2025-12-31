const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Enrollment = require("../models/Enrollment")

const router = express.Router()

// User Profile Route
router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Get the number of courses enrolled
    const coursesEnrolled = await Enrollment.countDocuments({ userId: user._id })

    // Get the number of certificates earned (you may need to adjust this based on your certificate model)
    const certificatesEarned = 0 // Placeholder, replace with actual logic when implemented

    const userProfile = {
      ...user.toObject(),
      coursesEnrolled,
      certificatesEarned,
    }

    res.status(200).json({ user: userProfile })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" })
    }
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router

