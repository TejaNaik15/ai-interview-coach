# AI Interview Coach

A comprehensive AI-powered interview preparation platform built with Next.js, TypeScript, and modern web technologies.

## Features

- 🤖 **AI-Powered Mock Interviews** - Practice with intelligent AI that provides contextual questions and feedback
- 💻 **Code Editor Integration** - Write and test code in real-time with Monaco Editor
- 🎯 **Multiple Practice Tracks** - Frontend, Backend, System Design, DSA, and Behavioral interviews
- 📊 **Detailed Analytics** - Track progress with comprehensive performance metrics
- 🎙️ **Voice & Text Modes** - Choose between text-based or voice interviews
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- ✨ **Advanced Animations** - Smooth GSAP-powered scroll animations and interactions
- 💳 **Stripe Integration** - Subscription management and payments
- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **GSAP** - Advanced animations and scroll effects
- **Monaco Editor** - Code editor component
- **React Query** - Data fetching and caching
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **OpenAI API** - AI-powered interview questions and feedback
- **Stripe** - Payment processing
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and update with your values:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
   OPENAI_API_KEY=your-openai-api-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   JWT_SECRET=your-jwt-secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Start the development servers**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   npm run server
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ai-interview-coach/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── mock/              # Mock interview page
│   ├── tracks/            # Practice tracks page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── providers.tsx      # Context providers
├── components/            # Reusable React components
│   ├── Features.tsx       # Features section
│   ├── Hero.tsx           # Hero section with animations
│   └── Navbar.tsx         # Navigation component
├── lib/                   # Utility functions
│   └── utils.ts           # Common utilities
├── server/                # Express.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── types/                 # TypeScript type definitions
│   └── index.ts           # Application types
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Key Features Implementation

### 1. AI-Powered Interviews
- OpenAI GPT integration for dynamic question generation
- Context-aware follow-up questions
- Intelligent feedback and scoring

### 2. GSAP Animations
- Scroll-triggered animations
- Parallax effects
- Smooth page transitions
- Interactive timeline components

### 3. Code Editor
- Monaco Editor integration
- Syntax highlighting
- Code execution (sandboxed)
- Multiple language support

### 4. Authentication & Security
- JWT tokens with HTTP-only cookies
- Password hashing with bcrypt
- Protected routes and API endpoints
- CORS configuration

### 5. Payment Integration
- Stripe Checkout for subscriptions
- Webhook handling for payment events
- Customer portal for subscription management
- Credit-based system for free users

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Mock Interviews
- `POST /api/mock/start` - Start new interview session
- `POST /api/mock/respond` - Submit response and get next question
- `POST /api/mock/end` - End interview and get feedback
- `GET /api/mock/session/:id` - Get interview session details

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics
- `GET /api/dashboard/history` - Get interview history
- `GET /api/dashboard/analytics` - Get performance analytics

### Payments
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/stripe/subscription` - Get subscription status

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy the `server` directory

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Configure network access and database users

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aiinterviewcoach.com or join our Discord community.