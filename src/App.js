import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom"
import Navbar from "./Components/Navbar/Navbar"
import Homepage from "./Components/Homepage/Homepage.jsx"
import Login from "./Components/Login/Login.jsx"
import SignUp from "./Components/SignUp/Signup.jsx"
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword.jsx"
import { Dashboard } from "./Pages/Dashboard/Dashboard.jsx"
import MyLearnings from "./Pages/MyLearnings/MyLearnings.jsx"
import CourseView from "./Components/CourseView/CourseView"
import Profile from "./Pages/Profile/Profile.jsx"
import Assignments from "./Pages/Assignment/Assignments.jsx"
import MyCourses from "./Pages/MyCourses/MyCourses.jsx"
import AddCourse from "./Pages/AddCourses/AddCourse.jsx"
import AddAssignment from "./Components/AddAssignment/AddAssignment.jsx"
import TakeAssignment from "./Components/TakeAssignment/TakeAssignment.jsx"
import Chatbot from "./Components/Chatbot/Chatbot.jsx"
import CourseAssignments from "./Pages/Assignment/CourseAssignments.jsx"

const App = () => {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-learnings" element={<MyLearnings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/course/:courseId" element={<CourseView />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/assignments/:courseId" element={<CourseAssignments />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/add-assignment/:courseId" element={<AddAssignment />} />
        <Route path="/assignment/:assignmentId" element={<TakeAssignment />} />
      </Routes>
      <ConditionalChatbot />
    </Router>
  )
}

const ConditionalNavbar = () => {
  const location = useLocation()
  const excludedPaths = [
    "/dashboard",
    "/forgot-password",
    "/my-learnings",
    "/course/:courseId",
    "/profile",
    "/assignments",
    "/my-courses",
    "/add-course",
    "/add-assignment/:courseId",
    "/assignment/:assignmentId",
  ]

  const showNavbar = !excludedPaths.some(path => matchPath({ path, end: true }, location.pathname))

  return showNavbar ? <Navbar /> : null
}

const ConditionalChatbot = () => {
  const location = useLocation()
  const hiddenPaths = ["/login", "/signup", "/forgot-password"]
  const hideChatbot = hiddenPaths.some(path => matchPath({ path, end: true }, location.pathname))

  return !hideChatbot ? <Chatbot /> : null
}

export default App

