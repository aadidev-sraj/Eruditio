const mongoose = require("mongoose")

const EnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Enrollment", EnrollmentSchema)

