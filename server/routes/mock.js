const express = require('express')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const InterviewSession = require('../models/InterviewSession')
const auth = require('../middleware/auth')

const router = express.Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// Start mock interview
router.post('/start', auth, async (req, res) => {
  try {
    const { track, difficulty, mode } = req.body

    // Create new interview session
    const session = new InterviewSession({
      userId: req.userId,
      track,
      difficulty,
      mode,
      status: 'in-progress'
    })

    await session.save()

    // Generate first question based on track and difficulty
    const systemPrompt = `You are a senior software engineer interviewing a candidate for a ${track} position at ${difficulty} level. Start with a warm greeting and ask an appropriate opening question. Keep it conversational and encouraging.`

    let firstQuestion
    try {
      const result = await model.generateContent(systemPrompt + '\nStart the interview with a warm greeting.')
      const response = await result.response
      firstQuestion = response.text() || 'Hello! Welcome to your interview. Can you start by telling me about yourself and your background?'
    } catch (apiError) {
      console.error('Gemini API error:', apiError)
      firstQuestion = 'Hello! Welcome to your interview. Can you start by telling me about yourself and your background?'
    }

    // Add first question to session
    session.questions.push({
      questionText: firstQuestion,
      questionType: 'behavioral',
      userResponse: '',
      timestamp: new Date()
    })

    await session.save()

    res.json({
      sessionId: session._id,
      question: firstQuestion,
      message: 'Interview started successfully'
    })
  } catch (error) {
    console.error('Start interview error:', error)
    res.status(500).json({ message: 'Failed to start interview' })
  }
})

// Submit response and get next question
router.post('/respond', auth, async (req, res) => {
  try {
    const { sessionId, response } = req.body

    const session = await InterviewSession.findById(sessionId)
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Session not found' })
    }

    // Update the last question with user response
    const lastQuestion = session.questions[session.questions.length - 1]
    lastQuestion.userResponse = response

    // Build conversation context
    const conversationHistory = session.questions.map(q => [
      { role: 'assistant', content: q.questionText },
      { role: 'user', content: q.userResponse }
    ]).flat().filter(msg => msg.content)

    // Determine question type dynamically based on number of questions
    const questionType = session.questions.length < 3 ? 'behavioral' : 'coding'

    // Gemini prompt
    const prompt = `
You are a senior ${session.track} interviewer.
Candidate difficulty level: ${session.difficulty}.
Previous Q&A: ${conversationHistory.map(q => `${q.role}: ${q.content}`).join('\n')}
Generate the next ${questionType} question appropriate for this level.
Keep it new, non-repetitive, and challenging.
`

    let nextQuestion
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      nextQuestion = response.text() || 'Can you tell me about a challenging project you worked on recently?'
    } catch (apiError) {
      console.error('Gemini API error:', apiError)
      // Fallback question if API fails
      nextQuestion = questionType === 'behavioral' 
        ? 'Can you describe a time when you had to work with a difficult team member?'
        : 'Write a function to find the maximum element in an array. Explain your approach.'
    }

    // Save follow-up & add new question
    lastQuestion.aiFollowUp = nextQuestion

    session.questions.push({
      questionText: nextQuestion,
      questionType,
      userResponse: '',
      timestamp: new Date()
    })

    await session.save()

    res.json({
      question: nextQuestion,
      questionCount: session.questions.length
    })

  } catch (error) {
    console.error('Respond error:', error)
    res.status(500).json({ message: 'Failed to process response' })
  }
})

// End interview and generate feedback
router.post('/end', auth, async (req, res) => {
  try {
    const { sessionId } = req.body

    const session = await InterviewSession.findById(sessionId)
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Session not found' })
    }

    session.status = 'completed'
    session.endedAt = new Date()

    // Generate feedback using AI
    const responses = session.questions.map(q => q.userResponse).join('\n\n')
    
    const feedbackPrompt = `Analyze this interview performance and provide scores (0-100) and feedback:

Interview Type: ${session.track}
Responses: ${responses}

Provide:
1. Scores for: technical, communication, structure, depth
2. 3 strengths
3. 3 areas for improvement
4. 3 specific suggestions

Format as JSON with scores object and feedback arrays.`

    let feedbackData
    try {
      const result = await model.generateContent(feedbackPrompt)
      const response = await result.response
      feedbackData = JSON.parse(response.text())
    } catch (apiError) {
      console.error('Gemini feedback error:', apiError)
      feedbackData = null
    }

    try {
      if (feedbackData) {
      
      session.scorecard = {
        technical: feedbackData.scores?.technical || 75,
        communication: feedbackData.scores?.communication || 75,
        structure: feedbackData.scores?.structure || 75,
        depth: feedbackData.scores?.depth || 75,
        total: Math.round((
          (feedbackData.scores?.technical || 75) +
          (feedbackData.scores?.communication || 75) +
          (feedbackData.scores?.structure || 75) +
          (feedbackData.scores?.depth || 75)
        ) / 4)
      }

      session.feedback = {
        strengths: feedbackData.strengths || ['Good communication', 'Clear thinking', 'Relevant examples'],
        improvements: feedbackData.improvements || ['More technical depth', 'Better structure', 'Specific examples'],
        suggestions: feedbackData.suggestions || ['Practice more examples', 'Study system design', 'Mock interviews']
      }
      } else {
        throw new Error('No feedback data')
      }
    } catch (parseError) {
      // Fallback scores if AI response parsing fails
      session.scorecard = {
        technical: 75,
        communication: 80,
        structure: 70,
        depth: 75,
        total: 75
      }
      
      session.feedback = {
        strengths: ['Good communication skills', 'Clear explanations', 'Relevant experience'],
        improvements: ['More technical depth needed', 'Better problem-solving approach', 'Stronger examples'],
        suggestions: ['Practice coding problems', 'Study system design patterns', 'Work on technical communication']
      }
    }

    await session.save()

    res.json({
      message: 'Interview completed',
      scorecard: session.scorecard,
      feedback: session.feedback,
      duration: session.duration
    })
  } catch (error) {
    console.error('End interview error:', error)
    res.status(500).json({ message: 'Failed to end interview' })
  }
})

// Get interview session details
router.get('/session/:id', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id)
    if (!session || session.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Session not found' })
    }

    res.json(session)
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({ message: 'Failed to get session' })
  }
})

module.exports = router