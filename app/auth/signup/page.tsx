'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthCard from '../../../components/ui/auth-card'
import MinimalHero from '../../../components/ui/hero-minimalism'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      <div className="min-h-screen flex items-center justify-center">
        <AuthCard type="signup" onSubmit={handleSubmit} />
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <span className="text-gray-400">Already have an account? </span>
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign in
        </Link>
      </div>
    </div>
  )
}