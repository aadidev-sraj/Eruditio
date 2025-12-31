"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AssignmentTimer from "../AssignmentTimer/AssignmentTimer"
import "./TakeAssignment.css"

const TakeAssignment = () => {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [timerData, setTimerData] = useState(null)
  const [timeExpired, setTimeExpired] = useState(false)

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        setLoading(true)
        const response = await fetch(`http://localhost:5006/api/assignments/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Assignment not found")
          }
          throw new Error("Failed to fetch assignment")
        }

        const data = await response.json()
        setAssignment(data)
        setAnswers(new Array(data.questions.length).fill(null))
      } catch (error) {
        console.error("Error fetching assignment:", error)
        setError(error.message || "Failed to load assignment. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignment()
    startAssignment()
  }, [assignmentId])

  const startAssignment = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`http://localhost:5006/api/assignments/${assignmentId}/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTimerData(data)
      }
    } catch (error) {
      console.error("Error starting assignment:", error)
    }
  }

  const handleAnswerChange = (questionIndex, answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e, autoSubmit = false) => {
    if (e) e.preventDefault()

    if (timeExpired && !autoSubmit) {
      setError("Time has expired. Your answers have been auto-submitted.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`http://localhost:5006/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        if (errorData.expired) {
          setError("Time limit exceeded. Assignment cannot be submitted.")
          setTimeExpired(true)
        } else {
          throw new Error(errorData.message || "Failed to submit assignment")
        }
      }
    } catch (error) {
      console.error("Error submitting assignment:", error)
      setError(error.message || "Failed to submit assignment. Please try again.")
    }
  }

  const handleTimeExpired = () => {
    setTimeExpired(true)
    // Auto-submit with current answers
    handleSubmit(null, true)
  }

  if (loading) return <div className="loading">Loading assignment...</div>
  if (error) return <div className="error">{error}</div>
  if (!assignment) return <div className="error">Assignment not found.</div>

  return (
    <div className="take-assignment">
      {timerData && !result && (
        <AssignmentTimer
          expiresAt={timerData.expiresAt}
          onTimeExpired={handleTimeExpired}
        />
      )}
      <h2>{assignment.title}</h2>
      {timeExpired && !result && (
        <div className="time-expired-notice">
          ⚠️ Time has expired! Your answers have been auto-submitted.
        </div>
      )}
      {!result ? (
        <form onSubmit={handleSubmit}>
          {assignment.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="question">
              <h3>Question {questionIndex + 1}</h3>
              <p>{question.text}</p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={answers[questionIndex] === optionIndex}
                    onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" disabled={timeExpired}>Submit Assignment</button>
        </form>
      ) : (
        <div className="result">
          <h3>Assignment Result</h3>
          <p>
            Score: {result.correctAnswers} out of {result.totalQuestions}
          </p>
          <p>Grade: {result.grade.toFixed(2)}%</p>
          <p>Submission ID: {result.submissionId}</p>
          <button onClick={() => navigate(`/course/${assignment.courseId}`)}>Back to Course</button>
        </div>
      )}
    </div>
  )
}

export default TakeAssignment

