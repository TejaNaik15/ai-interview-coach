import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { sessionId, messages, mode } = await request.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const conversation = messages.map((msg: any) => 
      `${msg.type}: ${msg.content}`
    ).join('\n')

    const prompt = `Analyze this ${mode} interview conversation and provide a score out of 100:

${conversation}

Evaluate based on:
- Technical knowledge (if applicable)
- Communication clarity
- Problem-solving approach
- Completeness of answers
- Confidence level

Return ONLY a number between 0-100, nothing else.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const scoreText = response.text().trim()
    const score = Math.min(100, Math.max(0, parseInt(scoreText) || 75))

    await client.connect()
    const db = client.db('ai-interview')
    const sessions = db.collection('interview_sessions')

    await sessions.updateOne(
      { _id: new ObjectId(sessionId) },
      { $set: { score, scoredAt: new Date() } }
    )

    return NextResponse.json({ score })
  } catch (error) {
    console.error('Scoring error:', error)
    return NextResponse.json({ score: 75 })
  } finally {
    await client.close()
  }
}