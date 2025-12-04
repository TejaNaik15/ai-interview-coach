import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import jwt from 'jsonwebtoken'

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json([])
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    await client.connect()
    const db = client.db('ai-interview')
    const interviews = db.collection('interviews')

    const userInterviews = await interviews
      .find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json(userInterviews)
  } catch (error) {
    console.error('Dashboard interviews error:', error)
    return NextResponse.json([])
  } finally {
    await client.close()
  }
}