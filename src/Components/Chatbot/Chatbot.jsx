"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send, X, ChevronDown } from "lucide-react"
import { responses, generateCoursePlan } from "./chatbotResponses"
import "./Chatbot.css"

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: responses.greeting[Math.floor(Math.random() * responses.greeting.length)],
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setInputValue("")

    // Show typing indicator
    setIsTyping(true)

    // Process the message and generate a response
    setTimeout(() => {
      const botResponse = generateResponse(inputValue)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
    }, 1500) // Simulate typing delay
  }

  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase()

    // Check for course plan request
    if (
      input.includes("course plan") ||
      input.includes("courseplan") ||
      (input.includes("create") && input.includes("plan"))
    ) {
      // Extract subject if mentioned
      let subject = ""
      const subjectKeywords = [
        "programming",
        "coding",
        "development",
        "software",
        "data science",
        "machine learning",
        "ai",
        "artificial intelligence",
        "design",
        "ux",
        "ui",
        "graphic",
        "business",
        "management",
        "marketing",
        "entrepreneurship",
      ]

      for (const keyword of subjectKeywords) {
        if (input.includes(keyword)) {
          subject = keyword
          break
        }
      }

      return generateCoursePlan(subject)
    }

    // Check for enrollment questions
    if (input.includes("enroll") || input.includes("sign up") || input.includes("register") || input.includes("join")) {
      return responses.enrollment[Math.floor(Math.random() * responses.enrollment.length)]
    }

    // Check for assignment questions
    if (
      input.includes("assignment") ||
      input.includes("homework") ||
      input.includes("quiz") ||
      input.includes("test")
    ) {
      return responses.assignments[Math.floor(Math.random() * responses.assignments.length)]
    }

    // Check for certificate questions
    if (input.includes("certificate") || input.includes("completion") || input.includes("diploma")) {
      return responses.certificates[Math.floor(Math.random() * responses.certificates.length)]
    }

    // Check for progress tracking questions
    if (input.includes("progress") || input.includes("track") || input.includes("monitoring")) {
      return responses.progress[Math.floor(Math.random() * responses.progress.length)]
    }

    // Check for technical issues
    if (
      input.includes("issue") ||
      input.includes("problem") ||
      input.includes("error") ||
      input.includes("bug") ||
      input.includes("not working")
    ) {
      return responses.technical_issues[Math.floor(Math.random() * responses.technical_issues.length)]
    }

    // Check for goodbye
    if (
      input.includes("bye") ||
      input.includes("goodbye") ||
      input.includes("see you") ||
      input.includes("thank you") ||
      input.includes("thanks")
    ) {
      return responses.farewell[Math.floor(Math.random() * responses.farewell.length)]
    }

    // Default response
    return responses.default[Math.floor(Math.random() * responses.default.length)]
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button */}
      <button className="chatbot-toggle" onClick={toggleChatbot} aria-label={isOpen ? "Close chatbot" : "Open chatbot"}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Eruditio Assistant</h3>
            <button className="minimize-button" onClick={toggleChatbot} aria-label="Minimize chatbot">
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender === "bot" ? "bot-message" : "user-message"}`}>
                <div className="message-content">
                  <pre className="message-text">{message.text}</pre>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              aria-label="Type your message"
            />
            <button type="submit" aria-label="Send message">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Chatbot

