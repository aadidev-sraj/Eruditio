"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email || !password) {
      setError("Please fill in both fields.")
      setLoading(false)
      return
    }

    try {
      const requestBody = JSON.stringify({ email, password })
      console.log("Sending login request with:", requestBody)

      const response = await fetch("http://localhost:5006/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers))

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        console.log("Login successful:", data.token)
        navigate("/dashboard")
      } else {
        console.error("Login failed:", data.message)
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Please enter your details to sign in</p>
            {error && <p className="error">{error}</p>}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="signup-prompt">
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

