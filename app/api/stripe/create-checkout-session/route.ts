import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const plan = searchParams.get('plan')

    const prices = {
      pro: 1900, // $19.00 in cents
      enterprise: 9900, // $99.00 in cents
    }

    if (!plan || !prices[plan as keyof typeof prices]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // For now, redirect to a simple checkout page
    // Replace this with actual Stripe integration
    const checkoutUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout?plan=${plan}&amount=${prices[plan as keyof typeof prices]}`
    
    return NextResponse.redirect(checkoutUrl)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}