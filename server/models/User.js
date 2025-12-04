const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['Frontend Developer', 'Backend Developer', 'Full-stack Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager']
  },
  level: {
    type: String,
    required: true,
    enum: ['Entry Level (0-2 years)', 'Mid Level (2-5 years)', 'Senior Level (5+ years)']
  },
  avatar: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  resumeUrl: {
    type: String,
    default: ''
  },
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  credits: {
    type: Number,
    default: 3
  },
  weeklyGoal: {
    type: Number,
    default: 5
  },
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)