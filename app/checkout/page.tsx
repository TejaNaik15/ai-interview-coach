'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, CreditCard } from 'lucide-react'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'pro'
  const amount = searchParams.get('amount') || '1900'

  const planDetails = {
    pro: {
      name: 'Pro Plan',
      price: '$19',
      features: [
        'Unlimited AI interviews',
        'Advanced analytics & insights', 
        'Code execution & testing',
        'Interview history & recordings',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '$99',
      features: [
        'Everything in Pro',
        'Custom interview templates',
        'Team management & analytics',
        'White-label solution',
        'Dedicated support'
      ]
    }
  }

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-2">{currentPlan.name}</h3>
              <p className="text-3xl font-bold">{currentPlan.price}<span className="text-lg text-gray-400">/month</span></p>
            </div>

            <div className="space-y-3 mb-6">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check size={16} className="text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total (monthly)</span>
                <span>{currentPlan.price}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">7-day free trial included</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <CreditCard size={24} className="mr-3" />
              Payment Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">CVC</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                Start 7-Day Free Trial
              </button>

              <p className="text-xs text-gray-400 text-center">
                By subscribing, you agree to our Terms of Service and Privacy Policy. 
                You can cancel anytime before your trial ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}