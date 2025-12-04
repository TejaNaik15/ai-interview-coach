'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white uppercase tracking-wider">AI Interview Coach</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tracks" className="text-gray-300 hover:text-white transition-colors text-sm">
              Practice Tracks
            </Link>
            <Link href="/mock" className="text-gray-300 hover:text-white transition-colors text-sm">
              Mock Interview
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
              Dashboard
            </Link>
            <Link href="/auth/login" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors text-sm">
              Login
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium">
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link href="/tracks" className="block text-gray-300 hover:text-white">
              Practice Tracks
            </Link>
            <Link href="/mock" className="block text-gray-300 hover:text-white">
              Mock Interview
            </Link>
            <Link href="/dashboard" className="block text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/auth/login" className="block px-4 py-2 bg-gray-800 text-white rounded-lg text-center">
              Login
            </Link>
            <Link href="/auth/signup" className="block px-4 py-2 bg-white text-black rounded-lg text-center">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}