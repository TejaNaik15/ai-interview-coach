import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateInterviewQuestion(context: string, mode: 'text' | 'voice' | 'code') {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompts = {
    text: `You are an AI interviewer conducting a professional interview. Based on this context: "${context}", generate a thoughtful follow-up question. Keep it conversational and relevant.`,
    voice: `You are an AI interviewer in a voice interview. Based on this context: "${context}", ask a clear, concise question that's easy to answer verbally. Focus on communication skills.`,
    code: `You are a technical interviewer. Based on this context: "${context}", provide a coding challenge or technical question. Include the problem statement and any constraints.`
  }

  try {
    const result = await model.generateContent(prompts[mode])
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    return "Can you tell me more about your experience with this technology?"
  }
}

export async function generateFeedback(userResponse: string, question: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `As an interview coach, provide constructive feedback on this response:
  
  Question: "${question}"
  Response: "${userResponse}"
  
  Give brief, actionable feedback focusing on:
  - Strengths in the response
  - Areas for improvement
  - Specific suggestions
  
  Keep it encouraging and professional.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    return "Good response! Consider providing more specific examples to strengthen your answer."
  }
}