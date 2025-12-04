'use client'

import Link from 'next/link'
import { Home, Target, MessageSquare, BarChart3, LogIn, ArrowRight, Brain, Code, Users, Shield, Check, Star } from 'lucide-react'
import Features from '../components/Features'
import { BentoGrid, BentoItem } from '../components/ui/bento-grid'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
        <div className="flex items-center gap-1 sm:gap-2 rounded-2xl border border-gray-800 bg-black/40 backdrop-blur-md p-1 shadow-sm">
          <Link href="/" className="flex items-center rounded-xl px-2 sm:px-4 py-2 text-sm font-medium bg-gray-800 text-blue-400">
            <Home size={18} className="sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Home</span>
          </Link>
          <Link href="/tracks" className="flex items-center rounded-xl px-2 sm:px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            <Target size={18} className="sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Tracks</span>
          </Link>
          <Link href="/mock" className="flex items-center rounded-xl px-2 sm:px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            <MessageSquare size={18} className="sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Mock</span>
          </Link>
          <Link href="/dashboard" className="flex items-center rounded-xl px-2 sm:px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            <BarChart3 size={18} className="sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Dashboard</span>
          </Link>
          <div className="mx-1 h-[24px] w-[1.2px] bg-gray-700" />
          <Link href="/auth/login" className="flex items-center rounded-xl px-2 sm:px-4 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            <LogIn size={18} className="sm:w-5 sm:h-5" />
            <span className="ml-2 hidden sm:inline">Login</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="z-10 flex flex-col items-center max-w-4xl">
          <div className="mb-4 inline-block rounded-full border border-gray-700 bg-gray-900/50 px-4 py-1.5 text-sm font-medium text-gray-300 backdrop-blur-sm">
            🚀 AI-Powered Interview Preparation
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
            <span className="animated-text-gradient">
              Master Your Dream Job Interviews
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-300 mb-8">
            Practice with our advanced AI interviewer, get real-time feedback, and boost your confidence. Join thousands of developers who landed their dream jobs with our platform.
          </p>

          <Link href="/auth/signup" className="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold shadow-lg transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center gap-2">
            Start Practicing Now
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Professional images grid */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20">
          <div className="grid grid-cols-6 gap-4 h-full p-4">
            {[
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=300&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=300&fit=crop&auto=format',
            ].map((src, index) => (
              <div key={index} className="relative h-full">
                <img
                  src={src}
                  alt={`Professional ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=Professional+${index + 1}&background=6366f1&color=fff&size=200`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <div className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Ace Your Interview
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and practice you need 
            to confidently tackle any technical or behavioral interview.
          </p>
        </div>
        <BentoGrid items={[
          {
            title: "AI-Powered Interviews",
            meta: "GPT-4 Enhanced",
            description: "Practice with intelligent AI that adapts to your responses and provides contextual follow-up questions.",
            icon: <Brain className="w-4 h-4 text-blue-500" />,
            status: "Live",
            tags: ["AI", "Adaptive", "Smart"],
            colSpan: 2,
            hasPersistentHover: true,
            href: "/mock"
          },
          {
            title: "Code Editor & Runner",
            meta: "Monaco Powered",
            description: "Write and test code in real-time with our integrated editor and sandboxed execution environment.",
            icon: <Code className="w-4 h-4 text-emerald-500" />,
            status: "Updated",
            tags: ["Coding", "Testing"],
            href: "/mock?mode=code"
          },
          {
            title: "Voice & Text Mode",
            meta: "Multi-modal",
            description: "Choose between text-based or voice interviews to practice your communication skills naturally.",
            icon: <MessageSquare className="w-4 h-4 text-purple-500" />,
            tags: ["Voice", "Text", "Communication"],
            colSpan: 2,
            href: "/mock?mode=voice"
          },
          {
            title: "Detailed Analytics",
            meta: "Real-time",
            description: "Get comprehensive feedback on technical skills, communication, and areas for improvement.",
            icon: <BarChart3 className="w-4 h-4 text-sky-500" />,
            status: "Beta",
            tags: ["Analytics", "Feedback"],
            href: "/dashboard"
          },
          {
            title: "Multiple Tracks",
            meta: "6 Specializations",
            description: "Specialized practice for Frontend, Backend, System Design, DSA, and Behavioral interviews.",
            icon: <Users className="w-4 h-4 text-orange-500" />,
            tags: ["Tracks", "Specialized"],
            href: "/tracks"
          },
          {
            title: "Secure & Private",
            meta: "Enterprise Grade",
            description: "Your interview data is encrypted and secure. Delete recordings anytime you want.",
            icon: <Shield className="w-4 h-4 text-red-500" />,
            tags: ["Security", "Privacy"]
          }
        ]} />
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start free and upgrade when you're ready. All plans include our core AI interview features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <Link href="/auth/signup" className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block text-center">
                  Get Started
                </Link>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  5 AI interviews per month
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Basic feedback & scoring
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Text & voice modes
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  All interview tracks
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 rounded-2xl p-8 backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star size={16} className="mr-1" /> Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <button 
                  onClick={() => window.open('/api/stripe/create-checkout-session?plan=pro', '_blank')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Upgrade to Pro
                </button>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Unlimited AI interviews
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Advanced analytics & insights
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Code execution & testing
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Interview history & recordings
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Priority support
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <button 
                  onClick={() => window.open('/api/stripe/create-checkout-session?plan=enterprise', '_blank')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Contact Sales
                </button>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Everything in Pro
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Custom interview templates
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Team management & analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  White-label solution
                </li>
                <li className="flex items-center text-gray-300">
                  <Check size={20} className="text-green-400 mr-3 flex-shrink-0" />
                  Dedicated support
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">All plans include a 7-day free trial. Cancel anytime.</p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span>✓ Secure payments via Stripe</span>
              <span>✓ No setup fees</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}