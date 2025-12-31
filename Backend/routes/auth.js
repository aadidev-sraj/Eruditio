const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// User signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup attempt received:", req.body)
    const { name, email, password, role } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      console.log("User already exists:", email)
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
    })

    // Save user to database
    await user.save()
    console.log("New user created:", user.email)

    // Create and send JWT token
    const payload = {
      user: {
        id: user.id,
        uniqueId: user.uniqueId,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          uniqueId: user.uniqueId,
          role: user.role,
        },
      })
    })
  } catch (error) {
    console.error("Signup error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// User login
router.post("/login", async (req, res) => {
  console.log("Login attempt received:", req.body)

  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      console.log("Login attempt failed: User not found", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("User found:", user.email)

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log("Login attempt failed: Incorrect password", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("Password matched for user:", email)

    // Create and send JWT token
    const payload = {
      user: {
        id: user._id,
        uniqueId: user.uniqueId,
        role: user.role,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error("Error creating JWT:", err)
        return res.status(500).json({ message: "Error creating token" })
      }
      console.log("Login successful:", user.email)
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          uniqueId: user.uniqueId,
          role: user.role,
        },
      })
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router

