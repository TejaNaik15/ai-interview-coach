import { create } from 'zustand'

interface InterviewState {
  sessionId: string | null
  mode: 'text' | 'voice' | 'code'
  askedQuestions: string[]
  easyQuestions: string[]
  mediumQuestions: string[]
  hardQuestions: string[]
  currentQuestion: string
  messages: Array<{id: string, type: 'ai' | 'user', content: string, timestamp: Date}>
  isActive: boolean
  timer: number
  isListening: boolean
  transcript: string
  difficulty: 'easy' | 'medium' | 'hard'
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp'
  
  setSessionId: (id: string) => void
  setMode: (mode: 'text' | 'voice' | 'code') => void
  addAskedQuestion: (question: string) => void
  setCurrentQuestion: (question: string) => void
  addMessage: (message: any) => void
  setIsActive: (active: boolean) => void
  setTimer: (time: number) => void
  setIsListening: (listening: boolean) => void
  setTranscript: (text: string) => void
  setDifficulty: (diff: 'easy' | 'medium' | 'hard') => void
  setLanguage: (lang: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp') => void
  reset: () => void
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  sessionId: null,
  mode: 'text',
  askedQuestions: [],
  easyQuestions: [],
  mediumQuestions: [],
  hardQuestions: [],
  currentQuestion: '',
  messages: [],
  isActive: false,
  timer: 0,
  isListening: false,
  transcript: '',
  difficulty: 'easy',
  language: 'javascript',
  
  setSessionId: (id) => set({ sessionId: id }),
  setMode: (mode) => set({ mode }),
  addAskedQuestion: (question) => set((state) => {
    const difficulty = state.difficulty
    return {
      askedQuestions: [...state.askedQuestions, question],
      easyQuestions: difficulty === 'easy' ? [...state.easyQuestions, question] : state.easyQuestions,
      mediumQuestions: difficulty === 'medium' ? [...state.mediumQuestions, question] : state.mediumQuestions,
      hardQuestions: difficulty === 'hard' ? [...state.hardQuestions, question] : state.hardQuestions
    }
  }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsActive: (active) => set({ isActive: active }),
  setTimer: (time) => set({ timer: time }),
  setIsListening: (listening) => set({ isListening: listening }),
  setTranscript: (text) => set({ transcript: text }),
  setDifficulty: (diff) => set({ difficulty: diff }),
  setLanguage: (lang) => set({ language: lang }),
  reset: () => set({
    sessionId: null,
    askedQuestions: [],
    easyQuestions: [],
    mediumQuestions: [],
    hardQuestions: [],
    currentQuestion: '',
    messages: [],
    isActive: false,
    timer: 0,
    isListening: false,
    transcript: '',
  }),
  
  getDifficultyQuestions: () => {
    const state = get()
    switch (state.difficulty) {
      case 'easy': return state.easyQuestions
      case 'medium': return state.mediumQuestions
      case 'hard': return state.hardQuestions
      default: return []
    }
  }
}))