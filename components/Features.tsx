'use client'

import { Brain, Code, MessageSquare, BarChart3, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Interviews',
    description: 'Practice with intelligent AI that adapts to your responses and provides contextual follow-up questions.'
  },
  {
    icon: Code,
    title: 'Code Editor & Runner',
    description: 'Write and test code in real-time with our integrated Monaco editor and sandboxed execution environment.'
  },
  {
    icon: MessageSquare,
    title: 'Voice & Text Mode',
    description: 'Choose between text-based or voice interviews to practice your communication skills naturally.'
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Get comprehensive feedback on technical skills, communication, and areas for improvement.'
  },
  {
    icon: Users,
    title: 'Multiple Tracks',
    description: 'Specialized practice for Frontend, Backend, System Design, DSA, and Behavioral interviews.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your interview data is encrypted and secure. Delete recordings anytime you want.'
  }
]

export default function Features() {
  return (
    <section className="features-section py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Ace Your Interview
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and practice you need 
            to confidently tackle any technical or behavioral interview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card bg-black/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}