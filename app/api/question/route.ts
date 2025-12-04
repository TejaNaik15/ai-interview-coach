import { NextRequest, NextResponse } from 'next/server'
import dsaData from '../../../data/questions.json'
import trackData from '../../../data/track-questions.json'

type Question = {
  id: string
  title: string
  question: string
  constraints: string
  examples: Array<{ input: string; output: string }>
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { difficulty, track, askedIds } = await request.json()

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty. Use easy|medium|hard.' }, { status: 400 })
    }

    let pool: Question[] = []
    
    // Use track-specific questions if track is provided and exists
    if (track && (trackData as any)[track] && (trackData as any)[track][difficulty]) {
      pool = (trackData as any)[track][difficulty]
    } else {
      // Fallback to DSA questions
      pool = (dsaData as any)[difficulty]
    }

    const askedSet = new Set(askedIds || [])
    const unseen = pool.filter((q) => !askedSet.has(q.id))

    if (unseen.length === 0) {
      // If no unseen questions in track-specific pool, fallback to DSA
      if (track && track !== 'dsa') {
        const dsaPool: Question[] = (dsaData as any)[difficulty]
        const dsaUnseen = dsaPool.filter((q) => !askedSet.has(q.id))
        if (dsaUnseen.length > 0) {
          const question = randomChoice(dsaUnseen)
          return NextResponse.json({ question })
        }
      }
      return NextResponse.json({ error: 'No more unseen questions for this difficulty.' }, { status: 404 })
    }

    const question = randomChoice(unseen)
    return NextResponse.json({ question })
  } catch (error) {
    console.error('Question API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}