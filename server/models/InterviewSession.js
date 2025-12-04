const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['behavioral', 'technical', 'coding', 'system-design'],
    required: true
  },
  userResponse: {
    type: String,
    required: true
  },
  aiFollowUp: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responseTime: {
    type: Number // in seconds
  }
})

const scorecardSchema = new mongoose.Schema({
  technical: {
    type: Number,
    min: 0,
    max: 100
  },
  communication: {
    type: Number,
    min: 0,
    max: 100
  },
  structure: {
    type: Number,
    min: 0,
    max: 100
  },
  depth: {
    type: Number,
    min: 0,
    max: 100
  },
  total: {
    type: Number,
    min: 0,
    max: 100
  }
})

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full-stack', 'System Design', 'DSA', 'Behavioral'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  mode: {
    type: String,
    enum: ['text', 'voice', 'code'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  duration: {
    type: Number // in minutes
  },
  questions: [questionSchema],
  scorecard: scorecardSchema,
  transcriptUrl: {
    type: String
  },
  recordingUrl: {
    type: String
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    suggestions: [String]
  },
  codeSubmissions: [{
    problem: String,
    solution: String,
    language: String,
    testResults: {
      passed: Number,
      total: Number,
      details: [String]
    }
  }]
}, {
  timestamps: true
})

// Calculate duration before saving
interviewSessionSchema.pre('save', function(next) {
  if (this.endedAt && this.startedAt) {
    this.duration = Math.round((this.endedAt - this.startedAt) / (1000 * 60))
  }
  next()
})

module.exports = mongoose.model('InterviewSession', interviewSessionSchema)