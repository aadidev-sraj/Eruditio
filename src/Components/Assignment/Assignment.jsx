import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "./Assignment.css"

const Assignment = () => {
  const { courseId } = useParams()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [courseTitle, setCourseTitle] = useState("")
  const [turnedIn, setTurnedIn] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, []) // Removed unnecessary dependency: courseId

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5006/api/assignments/generate/${courseId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }
      const data = await response.json()
      setQuestions(data.questions)
      setCourseTitle(data.courseTitle)
    } catch (err) {
      console.error("Error fetching questions:", err)
      setError("Failed to load questions. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:5006/api/assignments/submit/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })
      if (!response.ok) {
        throw new Error("Failed to submit answers")
      }
      const result = await response.json()
      setScore(result.score)
      setSubmitted(true)
    } catch (err) {
      setError("Failed to submit answers. Please try again.")
    }
  }

  const handleTurnIn = () => {
    setTurnedIn(true)
  }

  if (loading) return <div className="loading">Loading questions...</div>
  if (error)
    return (
      <div className="error">
        {error}{" "}
        <button onClick={fetchQuestions} className="btn-secondary">
          Try Again
        </button>
      </div>
    )

  return (
    <div className="assignment-container">
      <h2 className="assignment-title">{courseTitle || "Course"} Assignment</h2>
      <div className="assignment-status text-sm text-gray-600">{turnedIn ? "Turned In" : "Due Today 11:59PM"}</div>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={question.id} className="question-container">
              <p className="question-text">{`${index + 1}. ${question.text}`}</p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-label">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" className="btn-primary">
            Submit Answers
          </button>
        </form>
      ) : (
        <div className="result-container">
          <h3>Assignment Completed!</h3>
          <p>
            Your score: {score} out of {questions.length}
          </p>
          {!turnedIn && (
            <button onClick={handleTurnIn} className="btn-primary mb-2">
              Turn In
            </button>
          )}
          <button onClick={fetchQuestions} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default Assignment

