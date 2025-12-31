const mongoose = require("mongoose")

const AssignmentStartSchema = new mongoose.Schema({
    assignmentId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
})

// Create compound index for faster lookups
AssignmentStartSchema.index({ assignmentId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("AssignmentStart", AssignmentStartSchema)
