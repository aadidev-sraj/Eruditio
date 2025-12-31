"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./AddAssignment.css"

const AddAssignment = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctAnswer: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [courseExists, setCourseExists] = useState(null)

  useEffect(() => {
    console.log("AddAssignment component mounted. Course ID:", courseId)
    if (courseId) {
      checkCourseExists()
    } else {
      setError("Course ID is missing. Please try again.")
      console.error("Course ID is missing in AddAssignment component")
    }
  }, [courseId])

  const checkCourseExists = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Checking course existence for ID:", courseId)
      const response = await fetch(`http://localhost:5006/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Course check response status:", response.status)

      if (response.ok) {
        const courseData = await response.json()
        console.log("Course data received:", courseData)
        setCourseExists(true)
        setError("")
      } else if (response.status === 404) {
        console.log("Course not found")
        setCourseExists(false)
        setError("Course not found. Please check the course ID.")
      } else {
        throw new Error("Failed to verify course")
      }
    } catch (error) {
      console.error("Error checking course existence:", error)
      setError("Failed to verify course. Please try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!courseId || !courseExists) {
      setError("Invalid course ID. Cannot create assignment.")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const assignmentData = { courseId, title, questions }
      console.log("Sending assignment data:", assignmentData)

      const response = await fetch("http://localhost:5006/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignmentData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to create assignment")
      }

      console.log("Assignment created successfully:", result)
      toast.success("Assignment created successfully!")
      navigate(`/course/${courseId}`)
    } catch (error) {
      console.error("Error creating assignment:", error)
      setError(error.message || "An error occurred while creating the assignment")
      toast.error(error.message || "An error occurred while creating the assignment")
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctAnswer: 0 }])
  }

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
  }

  if (courseExists === false) {
    return (
      <div className="add-assignment-container">
        <h2>Add Assignment</h2>
        <p className="error">Course not found. Please check the course ID.</p>
      </div>
    )
  }

  return (
    <div className="add-assignment-container">
      <ToastContainer />
      <h2>Add Assignment for Course {courseId}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Assignment Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question">
            <h3>Question {questionIndex + 1}</h3>
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
              placeholder="Enter question"
              required
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
                <input
                  type="radio"
                  name={`correct-${questionIndex}`}
                  checked={question.correctAnswer === optionIndex}
                  onChange={() => handleQuestionChange(questionIndex, "correctAnswer", optionIndex)}
                  required
                />
                <label>Correct Answer</label>
              </div>
            ))}
            <button type="button" onClick={() => removeQuestion(questionIndex)} className="remove-question-btn">
              Remove Question
            </button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="add-question-btn">
          Add Question
        </button>
        <button type="submit" disabled={loading || !courseExists} className="submit-btn">
          {loading ? "Creating Assignment..." : `Create Assignment for Course ${courseId}`}
        </button>
      </form>
    </div>
  )
}

export default AddAssignment

