import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { action, sessionId, mode, duration, messages } = await request.json()

    await client.connect()
    const db = client.db('ai-interview')
    const sessions = db.collection('interview_sessions')

    if (action === 'start') {
      const session = await sessions.insertOne({
        userId: new ObjectId(decoded.userId),
        mode,
        startTime: new Date(),
        status: 'active',
        messages: [],
        createdAt: new Date()
      })
      
      return NextResponse.json({ sessionId: session.insertedId })
    }

    if (action === 'end') {
      await sessions.updateOne(
        { _id: new ObjectId(sessionId) },
        {
          $set: {
            endTime: new Date(),
            duration,
            status: 'completed',
            messages,
            updatedAt: new Date()
          }
        }
      )
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await client.close()
  }
}