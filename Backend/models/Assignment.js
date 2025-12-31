const mongoose = require("mongoose")
const shortid = require("shortid")

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
  },
})

const AssignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: String,
    default: shortid.generate,
    unique: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number,
    default: 7200000, // 2 hours in milliseconds
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Assignment", AssignmentSchema)

