// Predefined responses for the chatbot

export const generateCoursePlan = (subject = "") => {
    const subjectSpecific = subject.toLowerCase()
  
    // Default course plan structure
    let plan = `
  Here's a suggested course plan${subject ? ` for ${subject}` : ""}:
  
  Week 1-2: Fundamentals
  - Introduction to the subject
  - Core concepts and terminology
  - Basic practical exercises
  
  Week 3-4: Intermediate Skills
  - Advanced techniques
  - Problem-solving methods
  - Guided projects
  
  Week 5-6: Advanced Topics
  - Specialized knowledge areas
  - Industry best practices
  - Independent project work
  
  Week 7-8: Practical Application
  - Real-world case studies
  - Portfolio development
  - Final project presentation
  `
  
    // Add subject-specific content if a subject is provided
    if (
      subjectSpecific.includes("programming") ||
      subjectSpecific.includes("coding") ||
      subjectSpecific.includes("development") ||
      subjectSpecific.includes("software")
    ) {
      plan = `
  Here's a suggested course plan for Programming:
  
  Week 1-2: Programming Fundamentals
  - Introduction to programming concepts
  - Variables, data types, and operators
  - Control structures (if/else, loops)
  - Basic functions and methods
  
  Week 3-4: Intermediate Programming
  - Object-oriented programming concepts
  - Data structures (arrays, lists, dictionaries)
  - File handling and I/O operations
  - Error handling and debugging techniques
  
  Week 5-6: Advanced Programming
  - Algorithm design and analysis
  - Database integration
  - API development and consumption
  - Testing and quality assurance
  
  Week 7-8: Project Development
  - Full-stack application development
  - Version control with Git
  - Deployment and DevOps basics
  - Final project: Building a complete web application
  `
    } else if (
      subjectSpecific.includes("data science") ||
      subjectSpecific.includes("machine learning") ||
      subjectSpecific.includes("ai") ||
      subjectSpecific.includes("artificial intelligence")
    ) {
      plan = `
  Here's a suggested course plan for Data Science & Machine Learning:
  
  Week 1-2: Data Science Foundations
  - Introduction to data science
  - Python for data analysis
  - Data cleaning and preprocessing
  - Exploratory data analysis
  
  Week 3-4: Statistical Learning
  - Statistical inference
  - Regression analysis
  - Classification techniques
  - Model evaluation metrics
  
  Week 5-6: Machine Learning
  - Supervised learning algorithms
  - Unsupervised learning techniques
  - Feature engineering
  - Model optimization and tuning
  
  Week 7-8: Advanced AI Applications
  - Deep learning fundamentals
  - Neural networks architecture
  - Natural language processing
  - Final project: Building a predictive model
  `
    } else if (
      subjectSpecific.includes("design") ||
      subjectSpecific.includes("ux") ||
      subjectSpecific.includes("ui") ||
      subjectSpecific.includes("graphic")
    ) {
      plan = `
  Here's a suggested course plan for Design:
  
  Week 1-2: Design Fundamentals
  - Design principles and elements
  - Color theory and typography
  - User-centered design thinking
  - Basic design tools introduction
  
  Week 3-4: UI/UX Principles
  - User interface components
  - Information architecture
  - Wireframing and prototyping
  - Usability testing basics
  
  Week 5-6: Advanced Design
  - Responsive design principles
  - Animation and interaction design
  - Design systems and pattern libraries
  - Accessibility in design
  
  Week 7-8: Professional Design Practice
  - Design project management
  - Design critique and iteration
  - Portfolio development
  - Final project: Complete design case study
  `
    } else if (
      subjectSpecific.includes("business") ||
      subjectSpecific.includes("management") ||
      subjectSpecific.includes("marketing") ||
      subjectSpecific.includes("entrepreneurship")
    ) {
      plan = `
  Here's a suggested course plan for Business & Management:
  
  Week 1-2: Business Fundamentals
  - Introduction to business concepts
  - Market analysis and research
  - Business models and strategies
  - Financial literacy basics
  
  Week 3-4: Management Principles
  - Organizational behavior
  - Leadership and team management
  - Project management methodologies
  - Decision-making frameworks
  
  Week 5-6: Marketing & Growth
  - Marketing principles and strategies
  - Digital marketing channels
  - Customer acquisition and retention
  - Analytics and performance measurement
  
  Week 7-8: Business Development
  - Business plan development
  - Pitching and presentation skills
  - Scaling and growth strategies
  - Final project: Comprehensive business proposal
  `
    }
  
    return plan + "\n\nWould you like me to customize this plan further or provide more details on any specific section?"
  }
  
  export const responses = {
    greeting: [
      "Hello! I'm Eruditio Assistant. How can I help you today?",
      "Hi there! I'm here to help with your learning journey. What can I assist you with?",
      "Welcome to Eruditio! I'm your learning assistant. How may I help you?",
    ],
  
    farewell: [
      "Thank you for chatting with me. Have a great day!",
      "It was nice helping you. Feel free to come back if you have more questions!",
      "Goodbye! Don't hesitate to reach out if you need further assistance.",
    ],
  
    enrollment: [
      "To enroll in a course, browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to be logged in to complete the enrollment process.",
      "Enrollment is easy! Just find a course you like, click 'Enroll Now', and you're all set. Your enrolled courses will appear in your 'My Learnings' section.",
    ],
  
    assignments: [
      "You can find all your assignments in the 'Assignments' section. Each assignment has a due date and will be automatically graded upon submission.",
      "Assignments are available in the Assignments tab. You'll receive a grade immediately after submission, and you can review your answers afterward.",
    ],
  
    certificates: [
      "Certificates are awarded upon successful completion of courses with a grade of 70% or higher. You can view and download your certificates from your Profile page.",
      "Once you complete a course with a passing grade (70% or above), a certificate will be automatically generated. You can access all your certificates from your Profile.",
    ],
  
    progress: [
      "Your learning progress is tracked automatically as you complete lessons and assignments. You can view your progress on the course page or in your 'My Learnings' section.",
      "We track your progress through each course automatically. Check the progress bar on course pages or visit 'My Learnings' for a complete overview.",
    ],
  
    technical_issues: [
      "If you're experiencing technical issues, try refreshing the page or clearing your browser cache. If the problem persists, please contact our support team at support@eruditio.com.",
      "For technical problems, first try using a different browser or clearing your cache. If you still need help, email us at support@eruditio.com with details about the issue.",
    ],
  
    default: [
      "I'm here to help with your learning journey. You can ask me about course plans, enrollments, assignments, or certificates. How else can I assist you today?",
      "I can help with information about courses, assignments, certificates, and your learning progress. What would you like to know more about?",
      "Feel free to ask me about any aspect of the Eruditio platform. I'm here to make your learning experience better!",
    ],
  }
  
  