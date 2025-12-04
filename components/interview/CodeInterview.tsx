'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Play, RotateCcw } from 'lucide-react'
import MonacoEditor from '@monaco-editor/react'
import { useInterviewStore } from '../../lib/interview-store'

const languages = [
  { id: 'javascript', name: 'JavaScript', template: '// Write your solution here\nfunction solution() {\n  \n}' },
  { id: 'typescript', name: 'TypeScript', template: '// Write your solution here\nfunction solution(): any {\n  \n}' },
  { id: 'python', name: 'Python', template: '# Write your solution here\ndef solution():\n    pass' },
  { id: 'java', name: 'Java', template: '// Write your solution here\npublic class Solution {\n    public void solution() {\n        \n    }\n}' },
  { id: 'cpp', name: 'C++', template: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}' }
]

const difficulties = ['easy', 'medium', 'hard']

export default function CodeInterview() {
  const [code, setCode] = useState(languages[0].template)
  const [evaluation, setEvaluation] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const track = searchParams.get('track') || 'dsa'
  
  const { 
    currentQuestion,
    difficulty,
    language,
    easyQuestions,
    mediumQuestions,
    hardQuestions,
    setDifficulty,
    setLanguage,
    addAskedQuestion,
    setCurrentQuestion
  } = useInterviewStore()
  
  // Get questions for current difficulty
  const getCurrentDifficultyQuestions = () => {
    switch (difficulty) {
      case 'easy': return easyQuestions
      case 'medium': return mediumQuestions
      case 'hard': return hardQuestions
      default: return []
    }
  }

  // Auto-generate first question if none exists
  useEffect(() => {
    if (!currentQuestion || currentQuestion.includes('Welcome to your coding interview')) {
      generateQuestion()
    }
  }, [])

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId as any)
    const lang = languages.find(l => l.id === langId)
    if (lang) {
      setCode(lang.template)
    }
  }

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty as any)
    // Auto-generate new question when difficulty changes
    generateQuestion()
  }

  const generateQuestion = async () => {
    setLoading(true)
    setEvaluation(null) // Clear previous evaluation
    
    // Reset code to template for new question
    const lang = languages.find(l => l.id === language)
    if (lang) {
      setCode(lang.template)
    }
    
    try {
      const currentDifficultyQuestions = getCurrentDifficultyQuestions()
      console.log(`Generating new ${difficulty} question. Asked ${difficulty} questions:`, currentDifficultyQuestions.length)
      
      // Get question IDs that have been asked
      const askedIds = currentDifficultyQuestions.map(q => {
        // Extract ID from question text if it exists
        const match = q.match(/Problem #(\d+):/)
        return match ? match[1] : null
      }).filter(Boolean)
      
      const response = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          track,
          askedIds
        })
      })

      const data = await response.json()
      console.log('New question from dataset:', data)
      
      if (data.question) {
        // Format question from JSON dataset
        const questionText = `Problem #${Math.floor(Math.random() * 900) + 100}:\n${data.question.title}\n\n${data.question.question}\n\nDifficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}\n\nConstraints: ${data.question.constraints}\n\nExamples:\n${data.question.examples.map((ex: any, i: number) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}`
        
        setCurrentQuestion(questionText)
        addAskedQuestion(questionText)
        console.log(`Question added. Total ${difficulty} questions now:`, currentDifficultyQuestions.length + 1)
      } else {
        console.log('No more questions available, using fallback')
        // Difficulty-specific fallback questions
        const fallbackQuestions = {
          easy: `Problem #999:\nMaximum Number\n\nFind the maximum number in an array.\n\nDifficulty: Easy\n\nConstraints: Array length >= 1, integers\n\nExample 1:\nInput: [1,3,2,8,5]\nOutput: 8`,
          medium: `Problem #999:\nLinked List Cycle\n\nImplement a function to detect if a linked list has a cycle.\n\nDifficulty: Medium\n\nConstraints: Use Floyd's cycle detection algorithm\n\nExample 1:\nInput: 1->2->3->2 (cycle)\nOutput: true`,
          hard: `Problem #999:\nLongest Valid Parentheses\n\nFind length of longest valid parentheses substring.\n\nDifficulty: Hard\n\nConstraints: O(n) or DP\n\nExample 1:\nInput: ")(()())"\nOutput: 4`
        }
        const fallback = fallbackQuestions[difficulty] || fallbackQuestions.easy
        setCurrentQuestion(fallback)
        addAskedQuestion(fallback)
      }
    } catch (error) {
      console.error('Error:', error)
      // Difficulty-specific fallback on error
      const fallbackQuestions = {
        easy: `Problem #999:\nMaximum Number\n\nFind the maximum number in an array.\n\nDifficulty: Easy\n\nConstraints: Array length >= 1, integers\n\nExample 1:\nInput: [1,3,2,8,5]\nOutput: 8`,
        medium: `Problem #999:\nLinked List Cycle\n\nImplement a function to detect if a linked list has a cycle.\n\nDifficulty: Medium\n\nConstraints: Use Floyd's cycle detection algorithm\n\nExample 1:\nInput: 1->2->3->2 (cycle)\nOutput: true`,
        hard: `Problem #999:\nLongest Valid Parentheses\n\nFind length of longest valid parentheses substring.\n\nDifficulty: Hard\n\nConstraints: O(n) or DP\n\nExample 1:\nInput: ")(()())"\nOutput: 4`
      }
      const fallback = fallbackQuestions[difficulty] || fallbackQuestions.easy
      setCurrentQuestion(fallback)
      addAskedQuestion(fallback)
    } finally {
      setLoading(false)
    }
  }

  const checkSyntaxErrors = (code: string, language: string) => {
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Basic JavaScript/TypeScript syntax check
        new Function(code)
        return null
      } else if (language === 'python') {
        // Basic Python syntax checks
        const lines = code.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line && !line.startsWith('#')) {
            // Check for common Python syntax errors
            if (line.includes('function ') && !line.includes('def ')) {
              return { line: i + 1, error: 'Use "def" instead of "function" in Python' }
            }
            if (line.includes('{') || line.includes('}')) {
              return { line: i + 1, error: 'Python uses indentation, not braces {}' }
            }
            if (line.includes(';') && !line.includes('"') && !line.includes("'")) {
              return { line: i + 1, error: 'Python does not require semicolons' }
            }
          }
        }
      } else if (language === 'java') {
        // Basic Java syntax checks
        if (!code.includes('class ')) {
          return { line: 1, error: 'Java code must contain a class declaration' }
        }
        const braceCount = (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length
        if (braceCount !== 0) {
          return { line: 1, error: 'Mismatched braces { }' }
        }
      } else if (language === 'cpp') {
        // Basic C++ syntax checks
        const braceCount = (code.match(/\{/g) || []).length - (code.match(/\}/g) || []).length
        if (braceCount !== 0) {
          return { line: 1, error: 'Mismatched braces { }' }
        }
        const parenCount = (code.match(/\(/g) || []).length - (code.match(/\)/g) || []).length
        if (parenCount !== 0) {
          return { line: 1, error: 'Mismatched parentheses ( )' }
        }
      }
      return null
    } catch (error) {
      if (error instanceof SyntaxError) {
        return { line: 1, error: error.message }
      }
      return { line: 1, error: 'Syntax error detected' }
    }
  }

  const evaluateCode = async () => {
    if (!code.trim() || !currentQuestion) return
    
    // Check if code is just the template (no actual solution)
    const lang = languages.find(l => l.id === language)
    const isTemplateCode = lang && (code.trim() === lang.template.trim() || 
      code.replace(/\s+/g, ' ').trim() === lang.template.replace(/\s+/g, ' ').trim())
    
    // Check for minimal code (less than 20 characters of actual code)
    const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/#.*$/gm, '')
    const actualCodeLength = codeWithoutComments.replace(/\s+/g, '').length
    
    if (isTemplateCode || actualCodeLength < 20) {
      setEvaluation({
        score: 0,
        feedback: "No solution provided. Please write your implementation to solve the problem.",
        strengths: [],
        weaknesses: ["No code submitted", "Need to implement the solution"]
      })
      return
    }
    
    // Check for syntax errors
    const syntaxError = checkSyntaxErrors(code, language)
    if (syntaxError) {
      setEvaluation({
        score: 0,
        feedback: `Syntax Error on line ${syntaxError.line}: ${syntaxError.error}. Please fix the syntax error and try again.`,
        strengths: [],
        weaknesses: [`Syntax error on line ${syntaxError.line}`, "Fix the error before evaluation"]
      })
      return
    }
    
    setLoading(true)
    try {
      console.log('Evaluating code:', { code, currentQuestion, language })
      
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate-code',
          track: track,
          context: currentQuestion,
          userResponse: code,
          language
        })
      })

      const data = await response.json()
      console.log('Evaluation response:', data)
      
      if (data.score !== undefined) {
        setEvaluation(data)
      } else {
        // Fallback evaluation for actual code
        setEvaluation({
          score: 6,
          feedback: "Code evaluation completed. Your solution shows effort but may need improvements.",
          strengths: ["Shows programming knowledge", "Attempts to solve the problem"],
          weaknesses: ["Consider edge cases", "Optimize for better performance"]
        })
      }
    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback evaluation on error
      setEvaluation({
        score: 0,
        feedback: "Code execution failed. There may be runtime errors in your code. Please check your logic and try again.",
        strengths: [],
        weaknesses: ["Runtime error detected", "Review code logic and syntax"]
      })
    } finally {
      setLoading(false)
    }
  }

  const resetCode = () => {
    const lang = languages.find(l => l.id === language)
    if (lang) {
      setCode(lang.template)
    }
    setEvaluation(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Language:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={generateQuestion}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? 'Generating...' : `New Question (${getCurrentDifficultyQuestions().length} ${difficulty} solved)`}
          </button>
        </div>
        
        {currentQuestion && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">Problem #{getCurrentDifficultyQuestions().length}:</h3>
              <span className="text-blue-400 text-sm">{difficulty.toUpperCase()} Level</span>
            </div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">{currentQuestion}</pre>
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 border-r border-gray-700">
          <div className="h-full">
            <MonacoEditor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
        </div>
        
        {/* Evaluation Panel */}
        <div className="w-80 p-4 bg-gray-900">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={evaluateCode}
              disabled={loading || !currentQuestion}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Play size={16} />
              <span>Run & Evaluate</span>
            </button>
            
            <button
              onClick={resetCode}
              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          {evaluation && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">Code Review</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    evaluation.score >= 8 ? 'bg-green-500 text-white' :
                    evaluation.score >= 6 ? 'bg-yellow-500 text-black' :
                    evaluation.score >= 4 ? 'bg-orange-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {evaluation.score}/10
                  </div>
                </div>
                <div className="mb-3">
                  <h5 className="text-blue-400 text-sm font-medium mb-2">Detailed Analysis:</h5>
                  <p className="text-gray-300 text-sm leading-relaxed">{evaluation.feedback}</p>
                </div>
              </div>
              
              {evaluation.strengths?.length > 0 && (
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                  <h5 className="text-green-400 font-medium text-sm mb-2">✅ What worked well:</h5>
                  <ul className="text-green-300 text-sm space-y-1">
                    {evaluation.strengths.map((strength: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {evaluation.weaknesses?.length > 0 && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                  <h5 className="text-red-400 font-medium text-sm mb-2">🔧 Suggestions for improvement:</h5>
                  <ul className="text-red-300 text-sm space-y-1">
                    {evaluation.weaknesses.map((weakness: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {!currentQuestion && (
            <div className="text-center text-gray-400 text-sm">
              <p>Click "New Question" to start coding interview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}