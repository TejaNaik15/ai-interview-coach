const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Create checkout session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body
    
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: user._id.toString()
      }
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    res.status(500).json({ message: 'Failed to create checkout session' })
  }
})

// Handle webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const userId = session.metadata.userId
        
        // Update user subscription status
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'premium',
          credits: 999 // Unlimited for premium users
        })
        
        console.log('Subscription activated for user:', userId)
        break

      case 'invoice.payment_succeeded':
        // Handle successful recurring payment
        const invoice = event.data.object
        console.log('Payment succeeded:', invoice.id)
        break

      case 'invoice.payment_failed':
        // Handle failed payment
        const failedInvoice = event.data.object
        console.log('Payment failed:', failedInvoice.id)
        break

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object
        const customer = await stripe.customers.retrieve(subscription.customer)
        
        const user = await User.findOne({ email: customer.email })
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            subscriptionStatus: 'free',
            credits: 3
          })
        }
        
        console.log('Subscription cancelled for:', customer.email)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ message: 'Webhook handler failed' })
  }
})

// Get subscription status
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscriptionStatus credits')
    res.json(user)
  } catch (error) {
    console.error('Get subscription error:', error)
    res.status(500).json({ message: 'Failed to get subscription status' })
  }
})

// Create customer portal session
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const { returnUrl } = req.body
    const user = await User.findById(req.userId)
    
    // Find or create Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })
    
    let customerId
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name
      })
      customerId = customer.id
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    res.json({ url: portalSession.url })
  } catch (error) {
    console.error('Portal session error:', error)
    res.status(500).json({ message: 'Failed to create portal session' })
  }
})

module.exports = router