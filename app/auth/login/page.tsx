'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthCard from '../../../components/ui/auth-card'
import MinimalHero from '../../../components/ui/hero-minimalism'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      <div className="min-h-screen flex items-center justify-center">
        <AuthCard type="login" onSubmit={handleSubmit} />
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <span className="text-gray-400">Don't have an account? </span>
        <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  )
}