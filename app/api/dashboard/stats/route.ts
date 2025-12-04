import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ 
        totalInterviews: 0,
        averageScore: 0,
        timeSpent: 0,
        streak: 0,
        weeklyCount: 0,
        weeklyGoal: 5
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    await client.connect()
    const db = client.db('ai-interview')
    const sessions = db.collection('interview_sessions')

    const completedSessions = await sessions.find({ 
      userId: new ObjectId(decoded.userId),
      status: 'completed'
    }).sort({ createdAt: -1 }).toArray()

    const totalInterviews = completedSessions.length
    
    // Calculate average score
    const scoredSessions = completedSessions.filter(s => s.score)
    const averageScore = scoredSessions.length > 0 
      ? Math.round(scoredSessions.reduce((sum, s) => sum + s.score, 0) / scoredSessions.length)
      : 0

    // Calculate total time
    const totalTime = completedSessions.reduce((sum, session) => {
      return sum + (session.duration || 0)
    }, 0)

    // Calculate current streak
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < completedSessions.length; i++) {
      const sessionDate = new Date(completedSessions[i].createdAt)
      sessionDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }

    // Calculate weekly count
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const weeklyCount = completedSessions.filter(session => 
      new Date(session.createdAt) >= weekStart
    ).length

    return NextResponse.json({
      totalInterviews,
      averageScore,
      timeSpent: Math.round(totalTime / 60),
      streak,
      weeklyCount,
      weeklyGoal: 5
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ 
      totalInterviews: 0,
      averageScore: 0,
      timeSpent: 0,
      streak: 0,
      weeklyCount: 0,
      weeklyGoal: 5
    })
  } finally {
    await client.close()
  }
}