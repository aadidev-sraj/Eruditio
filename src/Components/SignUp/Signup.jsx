"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./SignUp.css"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role is student
  })
  const [error, setError] = useState("")

  const { name, email, password, role } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("") // Clear error when user makes changes
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://localhost:5006/api/auth/signup", formData)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard") // Redirect to dashboard after successful signup
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.")
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-wrapper">
          <form className="signup-form" onSubmit={onSubmit}>
            <h2>Sign Up</h2>
            <p className="signup-subtitle">Create your account to get started</p>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Create a password"
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={role} onChange={onChange} required>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <button type="submit" className="signup-button">
              Create Account
            </button>

            <p className="login-prompt">
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup

