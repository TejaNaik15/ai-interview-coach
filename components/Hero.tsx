'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight, Play, Star } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const illustrationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Hero text animation
      gsap.fromTo('.hero-text', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }
      )

      // Illustration scroll animation
      gsap.to(illustrationRef.current, {
        y: -100,
        rotation: 5,
        scale: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      // Floating animation for illustration
      gsap.to('.floating-element', {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.3
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 z-10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="hero-text">
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Master Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {' '}Interviews
              </span>
            </h1>
          </div>
          
          <div className="hero-text">
            <p className="text-xl text-gray-300 leading-relaxed">
              Practice with AI-powered mock interviews, get real-time feedback, 
              and land your dream job with confidence.
            </p>
          </div>

          <div className="hero-text flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup" className="bg-white text-black hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-lg">
              <span>Start Practicing</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="hero-text flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
            <span>•</span>
            <span>10,000+ interviews completed</span>
          </div>
        </div>

        <div ref={illustrationRef} className="relative">
          <div className="floating-element glass-card p-8 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">AI</span>
                </div>
                <div>
                  <p className="font-medium">AI Interviewer</p>
                  <p className="text-sm text-gray-500">Senior Software Engineer</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  "Tell me about a challenging project you worked on and how you overcame the obstacles."
                </p>
              </div>
              
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <div className="floating-element absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-80" />
          <div className="floating-element absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl opacity-60" />
          <div className="floating-element absolute top-1/2 -right-8 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg opacity-70" />
        </div>
      </div>
    </div>
  )
}