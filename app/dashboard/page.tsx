'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Clock, Target, Trophy, Play, Calendar, TrendingUp } from 'lucide-react'
import { BentoGrid } from '../../components/ui/bento-grid'

interface DashboardStats {
  totalInterviews: number
  averageScore: number
  timeSpent: number
  streak: number
  weeklyCount: number
  weeklyGoal: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInterviews: 0,
    averageScore: 0,
    timeSpent: 0,
    streak: 0,
    weeklyCount: 0,
    weeklyGoal: 5
  })

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const [recentInterviews, setRecentInterviews] = useState([])

  useEffect(() => {
    // Fetch recent interviews
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/dashboard/interviews')
        if (response.ok) {
          const data = await response.json()
          setRecentInterviews(data)
        }
      } catch (error) {
        console.error('Failed to fetch interviews:', error)
      }
    }

    fetchInterviews()
  }, [])

  const tracks = [
    { name: 'Frontend', progress: 65, color: 'bg-blue-500' },
    { name: 'Backend', progress: 40, color: 'bg-green-500' },
    { name: 'System Design', progress: 25, color: 'bg-purple-500' },
    { name: 'Behavioral', progress: 80, color: 'bg-yellow-500' }
  ]

  return (
    <div className="min-h-screen bg-black pt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">Track your interview preparation progress</p>
        </div>

        {/* Stats Grid */}
        <BentoGrid items={[
          {
            title: "Total Interviews",
            meta: `${stats.totalInterviews} completed`,
            description: "Track your interview practice sessions and monitor your progress over time.",
            icon: <BarChart3 className="w-4 h-4 text-blue-500" />,
            status: "Live",
            tags: ["Progress", "Stats"]
          },
          {
            title: "Average Score",
            meta: `${stats.averageScore}%`,
            description: "Your overall performance across all interview categories and difficulty levels.",
            icon: <Target className="w-4 h-4 text-emerald-500" />,
            status: "Updated",
            tags: ["Performance", "Score"]
          },
          {
            title: "Time Spent",
            meta: `${stats.timeSpent}h practiced`,
            description: "Total time invested in interview preparation and skill development.",
            icon: <Clock className="w-4 h-4 text-purple-500" />,
            tags: ["Time", "Practice"]
          },
          {
            title: "Current Streak",
            meta: `${stats.streak} days`,
            description: "Maintain consistency in your interview preparation journey.",
            icon: <Trophy className="w-4 h-4 text-yellow-500" />,
            status: "Active",
            tags: ["Streak", "Consistency"]
          }
        ]} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/mock" className="flex items-center space-x-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Start Mock Interview</p>
                    <p className="text-sm text-gray-400">Begin a new practice session</p>
                  </div>
                </Link>

                <Link href="/tracks" className="flex items-center space-x-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Practice Tracks</p>
                    <p className="text-sm text-gray-400">Explore learning paths</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Interviews */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Interviews</h2>
              {recentInterviews.length > 0 ? (
                <div className="space-y-3">
                  {recentInterviews.map((interview: any) => (
                    <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {interview.type.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{interview.type}</p>
                          <p className="text-sm text-gray-400">{interview.date} • {interview.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{interview.score}%</p>
                        <p className="text-sm text-gray-400">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No interviews yet</p>
                  <p className="text-sm text-gray-500 mb-4">Start your first mock interview to see your progress here</p>
                  <Link href="/mock" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Play className="w-4 h-4 mr-2" />
                    Start Interview
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Track Progress</h2>
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">{track.name}</span>
                      <span className="text-sm text-gray-400">{track.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`${track.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${track.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Weekly Goal</h2>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{stats.weeklyCount}/{stats.weeklyGoal}</p>
                <p className="text-sm text-gray-400">Interviews completed this week</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (stats.weeklyCount / stats.weeklyGoal) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}