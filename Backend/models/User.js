const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "instructor"],
  },
  uniqueId: {
    type: String,
    unique: true,
    index: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate unique ID and update lastLogin
UserSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered for user:", this.email)

  if (this.isNew && !this.uniqueId) {
    let uniqueId
    let isUnique = false

    while (!isUnique) {
      uniqueId = Math.floor(10000000 + Math.random() * 90000000).toString() // 8-digit ID for all users
      const existingUser = await this.constructor.findOne({ uniqueId })
      if (!existingUser) {
        isUnique = true
      }
    }

    this.uniqueId = uniqueId
    console.log("Generated uniqueId:", this.uniqueId)
  }

  if (!this.isModified("password")) {
    this.lastLogin = new Date()
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.lastLogin = new Date()
    console.log("Password hashed and lastLogin updated")
    next()
  } catch (error) {
    console.error("Error in pre-save hook:", error)
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)

