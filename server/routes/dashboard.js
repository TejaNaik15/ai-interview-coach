const express = require('express')
const InterviewSession = require('../models/InterviewSession')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.userId

    // Get completed interviews
    const completedInterviews = await InterviewSession.find({
      userId,
      status: 'completed'
    })

    // Calculate statistics
    const totalInterviews = completedInterviews.length
    const averageScore = totalInterviews > 0 
      ? Math.round(completedInterviews.reduce((sum, session) => sum + (session.scorecard?.total || 0), 0) / totalInterviews)
      : 0

    const totalTimeSpent = completedInterviews.reduce((sum, session) => sum + (session.duration || 0), 0)
    const timeSpentHours = Math.round(totalTimeSpent / 60 * 10) / 10

    // Calculate streak
    const user = await User.findById(userId)
    const streak = user?.streak || 0

    // Get recent interviews
    const recentInterviews = await InterviewSession.find({
      userId,
      status: 'completed'
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('track scorecard.total createdAt duration')

    // Get track progress
    const trackStats = await InterviewSession.aggregate([
      { $match: { userId: userId, status: 'completed' } },
      {
        $group: {
          _id: '$track',
          count: { $sum: 1 },
          averageScore: { $avg: '$scorecard.total' }
        }
      }
    ])

    res.json({
      totalInterviews,
      averageScore,
      timeSpent: timeSpentHours,
      streak,
      recentInterviews: recentInterviews.map(interview => ({
        id: interview._id,
        type: interview.track,
        score: interview.scorecard?.total || 0,
        date: interview.createdAt.toISOString().split('T')[0],
        duration: `${interview.duration || 0} min`
      })),
      trackProgress: trackStats.map(track => ({
        name: track._id,
        interviews: track.count,
        averageScore: Math.round(track.averageScore || 0)
      }))
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ message: 'Failed to get dashboard stats' })
  }
})

// Get interview history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, track, status } = req.query
    
    const filter = { userId: req.userId }
    if (track) filter.track = track
    if (status) filter.status = status

    const interviews = await InterviewSession.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('track difficulty mode status scorecard createdAt duration')

    const total = await InterviewSession.countDocuments(filter)

    res.json({
      interviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Interview history error:', error)
    res.status(500).json({ message: 'Failed to get interview history' })
  }
})

// Get performance analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query
    const days = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get interviews in the period
    const interviews = await InterviewSession.find({
      userId: req.userId,
      status: 'completed',
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 })

    // Group by date
    const dailyStats = {}
    interviews.forEach(interview => {
      const date = interview.createdAt.toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          interviews: 0,
          totalScore: 0,
          timeSpent: 0
        }
      }
      dailyStats[date].interviews += 1
      dailyStats[date].totalScore += interview.scorecard?.total || 0
      dailyStats[date].timeSpent += interview.duration || 0
    })

    // Convert to array and calculate averages
    const analytics = Object.values(dailyStats).map(day => ({
      ...day,
      averageScore: day.interviews > 0 ? Math.round(day.totalScore / day.interviews) : 0
    }))

    // Get skill breakdown
    const skillBreakdown = await InterviewSession.aggregate([
      { 
        $match: { 
          userId: req.userId, 
          status: 'completed',
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: '$track',
          count: { $sum: 1 },
          averageScore: { $avg: '$scorecard.total' },
          averageTechnical: { $avg: '$scorecard.technical' },
          averageCommunication: { $avg: '$scorecard.communication' },
          averageStructure: { $avg: '$scorecard.structure' },
          averageDepth: { $avg: '$scorecard.depth' }
        }
      }
    ])

    res.json({
      dailyStats: analytics,
      skillBreakdown: skillBreakdown.map(skill => ({
        track: skill._id,
        interviews: skill.count,
        scores: {
          overall: Math.round(skill.averageScore || 0),
          technical: Math.round(skill.averageTechnical || 0),
          communication: Math.round(skill.averageCommunication || 0),
          structure: Math.round(skill.averageStructure || 0),
          depth: Math.round(skill.averageDepth || 0)
        }
      }))
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ message: 'Failed to get analytics' })
  }
})

module.exports = router