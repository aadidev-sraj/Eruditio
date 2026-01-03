import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import Sidebar from "../../Components/Sidebar/Sidebar"
import { ArrowLeft } from "lucide-react"
import "./Assignments.css"
import { API_ENDPOINTS, API_BASE_URL, getApiUrl } from "../../config/api"


const CourseAssignments = () => {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    const [course, setCourse] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCourseAndAssignments()
    }, [courseId])

    const fetchCourseAndAssignments = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("No authentication token found")
            }

            // Fetch course details
            const courseResponse = await fetch(`${API_ENDPOINTS.COURSES}/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (courseResponse.ok) {
                const courseData = await courseResponse.json()
                setCourse(courseData)
            }

            // Fetch assignments
            const assignmentsResponse = await fetch(`${API_ENDPOINTS.ASSIGNMENTS}/course/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!assignmentsResponse.ok) {
                throw new Error("Failed to fetch assignments")
            }

            const assignmentsData = await assignmentsResponse.json()
            setAssignments(assignmentsData)
        } catch (error) {
            console.error("Error fetching data:", error)
            setError("Failed to load assignments. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    const handleSidebarToggle = (expanded) => {
        setIsSidebarExpanded(expanded)
    }

    if (loading) return <div className="loading">Loading assignments...</div>
    if (error) return <div className="error">{error}</div>

    return (
        <div className="assignments-layout">
            <Sidebar onToggle={handleSidebarToggle} />
            <div className={`assignments-content ${isSidebarExpanded ? "" : "sidebar-collapsed"}`}>
                <button onClick={() => navigate("/assignments")} className="back-button">
                    <ArrowLeft size={20} />
                    Back to All Assignments
                </button>
                <h1 className="assignments-title">
                    {course?.title || "Course"} - Assignments
                </h1>
                <p className="assignments-count">
                    {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} available
                </p>
                <div className="assignments-list">
                    {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div key={assignment._id} className="assignment-card">
                                <h3>{assignment.title}</h3>
                                <p className="assignment-info">
                                    {assignment.questions?.length || 0} questions
                                </p>
                                <Link
                                    to={`/assignment/${assignment.assignmentId}`}
                                    className="take-assignment-btn"
                                >
                                    Take Assignment
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="no-assignments">No assignments available for this course yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseAssignments
