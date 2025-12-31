"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import "./Homepage.css"

const HomePage = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [scrollIndex, setScrollIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    description: false,
    courses: false,
  })

  const heroRef = useRef(null)
  const descriptionRef = useRef(null)
  const coursesRef = useRef(null)

  useEffect(() => {
    fetchCourses("educational courses computer networks c++ accounting psychology")

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }))
        } else {
          setVisibleSections((prev) => ({ ...prev, [entry.target.id]: false }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    if (heroRef.current) observer.observe(heroRef.current)
    if (descriptionRef.current) observer.observe(descriptionRef.current)
    if (coursesRef.current) observer.observe(coursesRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
      if (descriptionRef.current) observer.unobserve(descriptionRef.current)
      if (coursesRef.current) observer.unobserve(coursesRef.current)
    }
  }, [])

  const fetchCourses = async (query = "educational courses computer networks c++ accounting psychology") => {
    try {
      console.log(`Fetching courses with query: ${query}`)
      const response = await fetch(`http://localhost:5006/api/youtube/search?q=${query}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Fetched ${data.length} courses`)
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCourses(searchQuery)
  }

  const scrollLeft = () => {
    setScrollIndex(Math.max(scrollIndex - 1, 0))
  }

  const scrollRight = () => {
    setScrollIndex(Math.min(scrollIndex + 1, Math.max(0, courses.length - 3)))
  }

  const handleLearnMore = (course) => {
    // Make sure the course has a valid ID
    if (!course.id || !course.id.videoId) {
      console.error("Invalid course data:", course)
      return
    }

    // Format the course data to match what CourseView expects
    const formattedCourse = {
      id: course.id.videoId,
      snippet: course.snippet,
      title: course.snippet.title,
      description: course.snippet.description,
      isYouTubeCourse: true,
    }

    console.log("Navigating to course:", formattedCourse)

    // Navigate to the course view page with the course data
    navigate(`/course/${course.id.videoId}`, { state: { course: formattedCourse } })
  }

  return (
    <div className="homepage">
      <section id="hero" ref={heroRef} className={`hero-section ${visibleSections.hero ? "fade-in" : "fade-out"}`}>
        <h1>Welcome to Eruditio</h1>
        <p>Discover a world of knowledge at your fingertips</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for courses..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>
      </section>

      <section
        id="description"
        ref={descriptionRef}
        className={`description-section ${visibleSections.description ? "fade-in" : "fade-out"}`}
      >
        <h2>What is Eruditio?</h2>
        <p>
          Eruditio is an innovative online learning platform that combines personalized education with a gamified
          approach. We aim to provide knowledge seekers with an engaging and effective learning experience. Our curated
          courses cover a wide range of topics, ensuring that you can find the perfect learning path for your goals.
        </p>
      </section>

      <section
        id="courses"
        ref={coursesRef}
        className={`courses-section ${visibleSections.courses ? "fade-in" : "fade-out"}`}
      >
        <h2>Featured Courses</h2>
        <div className="card-container-wrapper">
          <button
            className="scroll-button left"
            onClick={scrollLeft}
            aria-label="Scroll left"
            disabled={scrollIndex === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="card-container" style={{ transform: `translateX(-${scrollIndex * 320}px)` }}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div className="card" key={course.id.videoId}>
                  <img
                    src={course.snippet.thumbnails.medium.url || "/placeholder.svg?height=180&width=320"}
                    alt={course.snippet.title}
                    className="card-image"
                  />
                  <div className="card-content">
                    <h3>{course.snippet.title}</h3>
                    <p>
                      {course.snippet.description.length > 50
                        ? course.snippet.description.substring(0, 50) + "..."
                        : course.snippet.description}
                    </p>
                  </div>
                  <div className="card-button-container">
                    <button className="card-button" onClick={() => handleLearnMore(course)}>
                      Learn More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-courses">No courses found. Try a different search term.</div>
            )}
          </div>
          <button
            className="scroll-button right"
            onClick={scrollRight}
            aria-label="Scroll right"
            disabled={courses.length <= 3 || scrollIndex >= courses.length - 3}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage

