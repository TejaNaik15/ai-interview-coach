const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const mockRoutes = require('./routes/mock')
const dashboardRoutes = require('./routes/dashboard')
const stripeRoutes = require('./routes/stripe')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-interview-coach')

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/mock', mockRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/stripe', stripeRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Interview Coach API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})