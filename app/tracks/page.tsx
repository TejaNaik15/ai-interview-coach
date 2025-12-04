'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Code, Database, Layers, Brain, Users, Zap, Clock, Star, ArrowRight } from 'lucide-react'
import { BentoGrid } from '../../components/ui/bento-grid'

const tracks = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: Code,
    description: 'React, Vue, Angular, JavaScript, CSS, HTML',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    questions: 45,
    avgTime: '25 min',
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    topics: ['React Hooks', 'State Management', 'Performance', 'Testing', 'CSS-in-JS'],
    interviewTypes: ['text', 'voice', 'code']
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: Database,
    description: 'Node.js, Python, Java, APIs, Databases',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    questions: 52,
    avgTime: '30 min',
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    topics: ['REST APIs', 'Database Design', 'Authentication', 'Caching', 'Microservices'],
    interviewTypes: ['text', 'voice', 'code']
  },
  {
    id: 'system-design',
    name: 'System Design',
    icon: Layers,
    description: 'Scalability, Architecture, Distributed Systems',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    questions: 28,
    avgTime: '45 min',
    difficulty: ['Intermediate', 'Advanced'],
    topics: ['Load Balancing', 'Caching', 'Database Sharding', 'CDN', 'Message Queues'],
    interviewTypes: ['text', 'voice', 'code']
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: Brain,
    description: 'Arrays, Trees, Graphs, Dynamic Programming',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    questions: 120,
    avgTime: '35 min',
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Sorting', 'Recursion'],
    interviewTypes: ['text', 'voice', 'code']
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interviews',
    icon: Users,
    description: 'Leadership, Teamwork, Problem Solving',
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    questions: 35,
    avgTime: '20 min',
    difficulty: ['All Levels'],
    topics: ['STAR Method', 'Leadership', 'Conflict Resolution', 'Team Collaboration', 'Growth Mindset'],
    interviewTypes: ['text', 'voice']
  }
]

export default function TracksPage() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-transparent pt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Practice Tracks</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your specialization and start practicing with curated questions 
            designed by industry experts.
          </p>
        </div>

        <BentoGrid items={tracks.map((track, index) => ({
          title: track.name,
          meta: `${track.questions} questions`,
          description: track.description,
          icon: <track.icon className={`w-4 h-4 ${track.color.replace('bg-', 'text-')}`} />,
          status: "Available",
          tags: track.difficulty,
          cta: "Start Practice →",
          href: `/mock?track=${track.id}`,
          track: track,
          colSpan: index === 0 ? 2 : 1,
          hasPersistentHover: index === 0
        }))} />

        {/* Track Details Modal/Section */}
        {selectedTrack && (
          <div className="mt-12 card">
            {(() => {
              const track = tracks.find(t => t.id === selectedTrack)
              if (!track) return null
              
              return (
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 ${track.bgColor} rounded-2xl flex items-center justify-center`}>
                      <track.icon className={`w-8 h-8 ${track.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{track.name}</h2>
                      <p className="text-gray-600">{track.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{track.questions}</div>
                      <div className="text-sm text-gray-600">Practice Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{track.avgTime}</div>
                      <div className="text-sm text-gray-600">Average Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">4.8★</div>
                      <div className="text-sm text-gray-600">User Rating</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">All Topics Covered:</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {track.topics.map((topic) => (
                        <div
                          key={topic}
                          className={`px-3 py-2 ${track.bgColor} ${track.color.replace('bg-', 'text-')} text-sm rounded-lg`}
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Interview Types:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {track.interviewTypes.map((type) => (
                        <div key={type} className={`p-3 ${track.bgColor} ${track.color.replace('bg-', 'text-')} text-sm rounded-lg text-center font-medium`}>
                          {type === 'text' && '💬 Text Interview'}
                          {type === 'voice' && '🎙️ Voice Interview'}
                          {type === 'code' && '💻 Coding Interview'}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Link
                      href={`/mock?track=${track.id}&difficulty=beginner`}
                      className="btn-primary flex-1 text-center"
                    >
                      Start Beginner
                    </Link>
                    <Link
                      href={`/mock?track=${track.id}&difficulty=intermediate`}
                      className="btn-secondary flex-1 text-center"
                    >
                      Start Intermediate
                    </Link>
                    <Link
                      href={`/mock?track=${track.id}&difficulty=advanced`}
                      className="btn-secondary flex-1 text-center"
                    >
                      Start Advanced
                    </Link>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}