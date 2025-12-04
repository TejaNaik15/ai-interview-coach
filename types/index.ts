export interface User {
  id: string
  name: string
  email: string
  role: string
  level: string
  avatar?: string
  skills: string[]
  resumeUrl?: string
  subscriptionStatus: 'free' | 'premium' | 'enterprise'
  credits: number
  weeklyGoal: number
  streak: number
  lastActiveDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  questionText: string
  questionType: 'behavioral' | 'technical' | 'coding' | 'system-design'
  userResponse: string
  aiFollowUp?: string
  timestamp: Date
  responseTime?: number
}

export interface Scorecard {
  technical: number
  communication: number
  structure: number
  depth: number
  total: number
}

export interface Feedback {
  strengths: string[]
  improvements: string[]
  suggestions: string[]
}

export interface CodeSubmission {
  problem: string
  solution: string
  language: string
  testResults: {
    passed: number
    total: number
    details: string[]
  }
}

export interface InterviewSession {
  id: string
  userId: string
  track: 'Frontend' | 'Backend' | 'Full-stack' | 'System Design' | 'DSA' | 'Behavioral'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  mode: 'text' | 'voice' | 'code'
  status: 'in-progress' | 'completed' | 'abandoned'
  startedAt: Date
  endedAt?: Date
  duration?: number
  questions: Question[]
  scorecard?: Scorecard
  transcriptUrl?: string
  recordingUrl?: string
  feedback?: Feedback
  codeSubmissions: CodeSubmission[]
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalInterviews: number
  averageScore: number
  timeSpent: number
  streak: number
  recentInterviews: {
    id: string
    type: string
    score: number
    date: string
    duration: string
  }[]
  trackProgress: {
    name: string
    interviews: number
    averageScore: number
  }[]
}

export interface Track {
  id: string
  name: string
  description: string
  questions: number
  avgTime: string
  difficulty: string[]
  topics: string[]
  color: string
  bgColor: string
  borderColor: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalPages: number
  currentPage: number
  total: number
}