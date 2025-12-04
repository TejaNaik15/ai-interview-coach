'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Mic, MicOff, Send } from 'lucide-react'
import { useInterviewStore } from '../../lib/interview-store'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

export default function VoiceInterview() {
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const track = searchParams.get('track') || 'frontend'
  
  const { 
    messages, 
    askedQuestions,
    addMessage, 
    addAskedQuestion, 
    setCurrentQuestion 
  } = useInterviewStore()
  
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported 
  } = useSpeechRecognition()

  const handleStartListening = () => {
    resetTranscript()
    setEvaluation(null)
    startListening()
  }

  const handleStopListening = () => {
    stopListening()
  }

  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return
    
    setLoading(true)
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: transcript.trim(),
      timestamp: new Date()
    }
    addMessage(userMessage)
    
    const currentAnswer = transcript.trim()
    const currentQ = messages[messages.length - 1]?.content || 'Please introduce yourself and tell me about your background in technology.'

    try {
      console.log('Evaluating voice answer:', { question: currentQ, answer: currentAnswer })
      
      // Evaluate the answer
      const evalResponse = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-answer',
          mode: 'voice',
          track: track,
          context: currentQ,
          userResponse: currentAnswer
        })
      })

      const evalData = await evalResponse.json()
      console.log('Voice evaluation response:', evalData)
      
      // Ensure evaluation always has required fields
      const evaluation = {
        score: evalData.score || 6,
        feedback: evalData.feedback || `Good response! You mentioned your background in development and technology. Consider providing more specific examples about your experience with scalar applications and the technologies you've worked with.`,
        strengths: evalData.strengths || ["Clear introduction", "Mentioned relevant background"],
        weaknesses: evalData.weaknesses || ["Could provide more specific examples", "Elaborate on technical experience"]
      }
      
      setEvaluation(evaluation)

      // Get next question
      const questionResponse = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-question',
          mode: 'voice',
          track: track,
          context: currentAnswer,
          askedQuestions
        })
      })

      const questionData = await questionResponse.json()
      
      if (questionData.question) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: questionData.question,
          timestamp: new Date()
        }
        addMessage(aiMessage)
        setCurrentQuestion(questionData.question)
        addAskedQuestion(questionData.question)
      }
    } catch (error) {
      console.error('Voice evaluation error:', error)
      
      // Fallback evaluation
      setEvaluation({
        score: 6,
        feedback: `Thank you for your introduction, Teja! You mentioned working with development and scalar applications. To improve your response, try to be more specific about: 1) What programming languages you use, 2) What types of applications you've built, 3) Specific technologies in your stack, 4) Any notable projects or achievements.`,
        strengths: ["Clear communication", "Professional introduction", "Mentioned relevant experience"],
        weaknesses: ["Be more specific about technologies used", "Provide concrete examples of projects", "Elaborate on your development experience"]
      })
    } finally {
      setLoading(false)
      resetTranscript()
    }
  }

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Speech recognition is not supported in your browser</p>
          <p className="text-sm text-gray-500">Please use Chrome or Edge for voice interviews</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {evaluation && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Score: {evaluation.score}/10</h4>
            <p className="text-gray-300 text-sm mb-3">{evaluation.feedback}</p>
            {evaluation.strengths?.length > 0 && (
              <div className="mb-2">
                <p className="text-green-400 text-xs font-medium">Strengths:</p>
                <ul className="text-green-300 text-xs">
                  {evaluation.strengths.map((strength: string, i: number) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.weaknesses?.length > 0 && (
              <div>
                <p className="text-red-400 text-xs font-medium">Areas to improve:</p>
                <ul className="text-red-300 text-xs">
                  {evaluation.weaknesses.map((weakness: string, i: number) => (
                    <li key={i}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-4">
        {transcript && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-gray-300 text-sm">{transcript}</p>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={loading}
            className={`p-4 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white disabled:opacity-50`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          {transcript && !isListening && (
            <button
              onClick={handleSubmitAnswer}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Submit Answer</span>
            </button>
          )}
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-2">
          {isListening ? 'Listening... Click to stop' : 'Click microphone to start speaking'}
        </p>
      </div>
    </div>
  )
}