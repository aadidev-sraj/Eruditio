const mongoose = require("mongoose")
const shortid = require("shortid")

const SubmissionSchema = new mongoose.Schema({
  submissionId: {
    type: String,
    default: shortid.generate,
    unique: true,
  },
  assignmentId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  grade: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
    },
  ],
})

module.exports = mongoose.model("Submission", SubmissionSchema)

