'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Code, Mic, Pause, Play, Clock } from 'lucide-react'
import { useInterviewStore } from '../../lib/interview-store'
import TextInterview from '../../components/interview/TextInterview'
import VoiceInterview from '../../components/interview/VoiceInterview'
import CodeInterview from '../../components/interview/CodeInterview'

export default function MockInterviewPage() {
  const searchParams = useSearchParams()
  const [interviewTimer, setInterviewTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Track configurations
  const trackConfigs = {
    frontend: {
      name: 'Frontend Development',
      interviewTypes: ['text', 'voice', 'code'],
      description: 'Frontend development interviews focusing on React, JavaScript, CSS, and UI/UX'
    },
    backend: {
      name: 'Backend Development', 
      interviewTypes: ['text', 'voice', 'code'],
      description: 'Backend development interviews covering APIs, databases, system architecture'
    },
    'system-design': {
      name: 'System Design',
      interviewTypes: ['text', 'voice', 'code'],
      description: 'System design interviews focusing on scalability and architecture'
    },
    dsa: {
      name: 'Data Structures & Algorithms',
      interviewTypes: ['text', 'voice', 'code'],
      description: 'DSA interviews with algorithmic problem solving and coding challenges'
    },
    behavioral: {
      name: 'Behavioral Interviews',
      interviewTypes: ['text', 'voice'],
      description: 'Behavioral interviews focusing on leadership, teamwork, and soft skills'
    }
  }
  
  const {
    mode,
    isActive,
    sessionId,
    messages,
    currentQuestion,
    askedQuestions,
    setMode,
    setIsActive,
    setSessionId,
    addMessage,
    setCurrentQuestion,
    addAskedQuestion,
    reset
  } = useInterviewStore()

  useEffect(() => {
    const trackParam = searchParams.get('track')
    const modeParam = searchParams.get('mode')
    
    if (trackParam && trackConfigs[trackParam as keyof typeof trackConfigs]) {
      setSelectedTrack(trackParam)
    }
    
    if (modeParam === 'voice' || modeParam === 'code') {
      setMode(modeParam as any)
    }
  }, [searchParams, setMode])

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setInterviewTimer(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startInterview = async () => {
    try {
      // Start session
      const sessionResponse = await fetch('/api/interview/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', mode })
      })
      
      if (sessionResponse.ok) {
        const { sessionId: newSessionId } = await sessionResponse.json()
        setSessionId(newSessionId)
      }
      
      // Set interview as active
      setIsActive(true)
      setIsTimerRunning(true)
      setInterviewTimer(0)
      
      // Track and mode-specific first questions
      let firstQuestion = ''
      const track = selectedTrack || searchParams.get('track') || 'frontend'
      
      if (mode === 'text') {
        const trackQuestions = {
          frontend: "Hello! I'm your AI interviewer for frontend development. Can you tell me about your experience with React, JavaScript, and frontend technologies?",
          backend: "Hello! I'm your AI interviewer for backend development. Can you tell me about your experience with APIs, databases, and server-side technologies?",
          'system-design': "Hello! I'm your AI interviewer for system design. Can you tell me about your experience with designing scalable systems and architecture?",
          dsa: "Hello! I'm your AI interviewer for data structures and algorithms. Can you tell me about your problem-solving experience and algorithmic thinking?",
          behavioral: "Hello! I'm your AI interviewer for behavioral questions. Can you tell me about yourself and your professional experience?"
        }
        firstQuestion = trackQuestions[track as keyof typeof trackQuestions] || trackQuestions.frontend
      } else if (mode === 'voice') {
        const trackQuestions = {
          frontend: "Hi! Welcome to your frontend development voice interview. Please introduce yourself and tell me about your frontend development background.",
          backend: "Hi! Welcome to your backend development voice interview. Please introduce yourself and tell me about your backend development experience.",
          'system-design': "Hi! Welcome to your system design voice interview. Please introduce yourself and tell me about your experience with system architecture.",
          dsa: "Hi! Welcome to your DSA voice interview. Please introduce yourself and tell me about your algorithmic problem-solving experience.",
          behavioral: "Hi! Welcome to your behavioral voice interview. Please introduce yourself and tell me about your professional background."
        }
        firstQuestion = trackQuestions[track as keyof typeof trackQuestions] || trackQuestions.frontend
      } else if (mode === 'code') {
        // For coding mode, generate actual coding question immediately
        try {
          const questionResponse = await fetch('/api/interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'generate-question',
              mode: 'code',
              track: track,
              difficulty: 'easy',
              language: 'javascript',
              context: `Generate first ${track} coding problem`,
              askedQuestions: []
            })
          })
          
          const questionData = await questionResponse.json()
          firstQuestion = questionData.question || 'Write a function that returns the sum of two numbers.\n\nConstraints:\n- Both inputs are integers\n- Return an integer\n\nExample:\nInput: add(2, 3)\nOutput: 5'
        } catch (error) {
          console.error('Failed to generate coding question:', error)
          firstQuestion = 'Write a function that returns the sum of two numbers.\n\nConstraints:\n- Both inputs are integers\n- Return an integer\n\nExample:\nInput: add(2, 3)\nOutput: 5'
        }
      }
      
      // Add first AI message
      const aiMessage = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: firstQuestion,
        timestamp: new Date()
      }
      
      addMessage(aiMessage)
      setCurrentQuestion(firstQuestion)
      addAskedQuestion(firstQuestion)
      
    } catch (error) {
      console.error('Failed to start interview:', error)
      // Fallback to manual start
      setIsActive(true)
      setIsTimerRunning(true)
      setInterviewTimer(0)
      
      const track = selectedTrack || searchParams.get('track') || 'frontend'
      const fallbackQuestions = {
        text: `Hello! Can you tell me about yourself and your ${trackConfigs[track as keyof typeof trackConfigs]?.name.toLowerCase()} experience?`,
        voice: `Hi! Please introduce yourself and your ${trackConfigs[track as keyof typeof trackConfigs]?.name.toLowerCase()} background.`,
        code: "Write a function that returns the sum of two numbers.\n\nConstraints:\n- Both inputs are integers\n- Return an integer\n\nExample:\nInput: add(2, 3)\nOutput: 5"
      }
      
      const fallbackQuestion = fallbackQuestions[mode]
      const aiMessage = {
        id: Date.now().toString(),
        type: 'ai' as const,
        content: fallbackQuestion,
        timestamp: new Date()
      }
      
      addMessage(aiMessage)
      setCurrentQuestion(fallbackQuestion)
      addAskedQuestion(fallbackQuestion)
    }
  }





  const endInterview = async () => {
    try {
      if (sessionId) {
        // End session
        await fetch('/api/interview/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'end',
            sessionId,
            duration: interviewTimer,
            messages
          })
        })

        // Get AI score
        const scoreResponse = await fetch('/api/interview/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages,
            mode
          })
        })

        if (scoreResponse.ok) {
          const { score } = await scoreResponse.json()
          alert(`Interview completed! Your score: ${score}/100`)
        }
      }
      
      setIsActive(false)
      setIsTimerRunning(false)
      setSessionId(null)
      reset()
    } catch (error) {
      console.error('Failed to end interview:', error)
    }
  }

  const pauseInterview = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  return (
    <div className="min-h-screen bg-transparent pt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mock Interview</h1>
          <p className="text-gray-300 mt-2">Practice with AI-powered interviews</p>
        </div>

        {!isActive ? (
          <div className="max-w-2xl mx-auto">
            <div className="max-w-4xl mx-auto">
              {selectedTrack && (
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-semibold text-white mb-2">{trackConfigs[selectedTrack as keyof typeof trackConfigs]?.name}</h2>
                  <p className="text-gray-300">{trackConfigs[selectedTrack as keyof typeof trackConfigs]?.description}</p>
                </div>
              )}
              
              <h2 className="text-2xl font-semibold text-white mb-8 text-center">Choose Interview Mode</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {(!selectedTrack || trackConfigs[selectedTrack as keyof typeof trackConfigs]?.interviewTypes.includes('text')) && (
                  <div 
                    onClick={() => setMode('text')}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      mode === 'text' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Popular</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Text Interview</h3>
                    <p className="text-gray-300 text-sm">Type your responses and get detailed feedback on your answers.</p>
                  </div>
                )}
                
                {(!selectedTrack || trackConfigs[selectedTrack as keyof typeof trackConfigs]?.interviewTypes.includes('voice')) && (
                  <div 
                    onClick={() => setMode('voice')}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      mode === 'voice' 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Mic className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Beta</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Voice Interview</h3>
                    <p className="text-gray-300 text-sm">Practice speaking naturally and improve your verbal communication skills.</p>
                  </div>
                )}
                
                {(!selectedTrack || trackConfigs[selectedTrack as keyof typeof trackConfigs]?.interviewTypes.includes('code')) && (
                  <div 
                    onClick={() => setMode('code')}
                    className={`p-6 rounded-xl border cursor-pointer transition-all ${
                      mode === 'code' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Code className="w-5 h-5 text-purple-500" />
                      <span className="text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Live</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Coding Interview</h3>
                    <p className="text-gray-300 text-sm">Write and test code in real-time with our integrated development environment.</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-8">
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Selected mode: <span className="text-white font-medium capitalize">{mode}</span></p>
                  {selectedTrack && (
                    <p className="text-gray-400 text-sm">Track: <span className="text-white font-medium">{trackConfigs[selectedTrack as keyof typeof trackConfigs]?.name}</span></p>
                  )}
                </div>
                <button
                  onClick={startInterview}
                  className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start {mode.charAt(0).toUpperCase() + mode.slice(1)} Interview
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Interview Interface */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl h-full flex flex-col">
                <div className="border-b border-gray-700 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white capitalize">{mode} Interview</h3>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <Clock size={16} />
                      <span className="font-mono">{formatTime(interviewTimer)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  {mode === 'text' && <TextInterview />}
                  {mode === 'voice' && <VoiceInterview />}
                  {mode === 'code' && <CodeInterview />}
                </div>
              </div>
            </div>

            {/* Interview Controls */}
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
                <div className="space-y-3">
                  <button 
                    onClick={pauseInterview}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                    <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button
                    onClick={endInterview}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    End Interview
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Questions Asked:</span>
                    <span>{askedQuestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Elapsed:</span>
                    <span>{formatTime(interviewTimer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="capitalize">{mode}</span>
                  </div>
                  {selectedTrack && (
                    <div className="flex justify-between">
                      <span>Track:</span>
                      <span className="text-xs">{trackConfigs[selectedTrack as keyof typeof trackConfigs]?.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Think before responding</li>
                  <li>• Be specific with examples</li>
                  <li>• Explain your reasoning</li>
                  <li>• Ask clarifying questions</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}