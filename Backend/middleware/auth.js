const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Check if no token
  if (!token) {
    console.error("No token provided in request")
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    console.log("User authenticated:", req.user)
    next()
  } catch (err) {
    console.error("Token verification failed:", err.message)
    res.status(401).json({ message: "Token is not valid" })
  }
}

