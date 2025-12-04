'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send } from 'lucide-react'
import { useInterviewStore } from '../../lib/interview-store'

export default function TextInterview() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const track = searchParams.get('track') || 'frontend'
  
  const { 
    currentQuestion, 
    messages, 
    askedQuestions,
    addMessage, 
    addAskedQuestion, 
    setCurrentQuestion 
  } = useInterviewStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: input.trim(),
      timestamp: new Date()
    }
    addMessage(userMessage)

    try {
      console.log('Sending request:', { track, context: input.trim(), askedQuestions })
      
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-question',
          mode: 'text',
          track: track,
          context: input.trim(),
          askedQuestions
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.question) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: data.question,
          timestamp: new Date()
        }
        addMessage(aiMessage)
        setCurrentQuestion(data.question)
        addAskedQuestion(data.question)
      } else {
        // Fallback question if API doesn't return one
        const fallbackQuestion = "That's great! Can you tell me about a specific React project you've worked on and what challenges you faced?"
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: fallbackQuestion,
          timestamp: new Date()
        }
        addMessage(aiMessage)
        setCurrentQuestion(fallbackQuestion)
        addAskedQuestion(fallbackQuestion)
      }
    } catch (error) {
      console.error('Error generating question:', error)
      // Fallback question on error
      const fallbackQuestion = "Can you describe a challenging frontend problem you've solved recently?"
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: fallbackQuestion,
        timestamp: new Date()
      }
      addMessage(aiMessage)
      setCurrentQuestion(fallbackQuestion)
      addAskedQuestion(fallbackQuestion)
    } finally {
      setLoading(false)
      setInput('')
    }
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
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}