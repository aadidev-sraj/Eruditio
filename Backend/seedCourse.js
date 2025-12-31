const mongoose = require("mongoose")
const Course = require("./models/Course")
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const presetCourses = [
  {
    title: "Introduction to Python Programming",
    description: "Master Python programming from scratch with hands-on exercises and real-world projects",
    presetId: "preset1",
  },
  {
    title: "Web Development Bootcamp",
    description: "Comprehensive web development course covering HTML, CSS, JavaScript and modern frameworks",
    presetId: "preset2",
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Learn the core concepts of machine learning and artificial intelligence",
    presetId: "preset3",
  },
]

async function seedCourses() {
  try {
    for (const course of presetCourses) {
      await Course.findOneAndUpdate({ presetId: course.presetId }, course, { upsert: true, new: true })
    }
    console.log("Preset courses have been added to the database")
  } catch (error) {
    console.error("Error seeding courses:", error)
  } finally {
    mongoose.connection.close()
  }
}

seedCourses()

