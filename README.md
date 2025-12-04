# 🤖 AI Interview Coach

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

> **A comprehensive AI-powered interview preparation platform that helps developers ace technical interviews with personalized practice sessions, real-time feedback, and track-specific questions.**

## 🌟 Features

### 🎯 **Track-Specific Interview Practice**
- **Frontend Development**: React, JavaScript, CSS, Performance Optimization
- **Backend Development**: APIs, Databases, System Architecture, Microservices  
- **System Design**: Scalability, Distributed Systems, Load Balancing
- **Data Structures & Algorithms**: Arrays, Trees, Dynamic Programming
- **Behavioral Interviews**: Leadership, Teamwork, STAR Method

### 🎙️ **Multiple Interview Modes**
- **💬 Text Interviews**: Type responses with detailed AI feedback
- **🎤 Voice Interviews**: Practice verbal communication skills
- **💻 Coding Interviews**: Live code editor with syntax highlighting and evaluation

### 🧠 **AI-Powered Intelligence**
- **Contextual Questions**: AI generates follow-ups based on your specific responses
- **Smart Evaluation**: Real-time scoring with detailed feedback
- **Adaptive Difficulty**: Questions progress from basic to advanced
- **Anti-Repetition**: Ensures unique questions throughout the session

### 📊 **Advanced Analytics**
- Performance tracking across different tracks
- Detailed scoring with strengths/weaknesses analysis
- Progress monitoring over time
- Interview history and session replays

## 🚀 Live Demo

**🔗 [Try AI Interview Coach](https://ai-interview-coach.vercel.app)**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Components
- **Animations**: GSAP for smooth interactions
- **Code Editor**: Monaco Editor (VS Code engine)
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: Google Gemini AI
- **Authentication**: JWT with HTTP-only cookies
- **Payments**: Stripe Integration

### DevOps & Deployment
- **Hosting**: Vercel (Frontend) + Railway (Backend)
- **Database**: MongoDB Atlas
- **Environment**: Docker support
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites
```bash
Node.js 18+
MongoDB (local or Atlas)
Google Gemini API key
```

### 1. Clone Repository
```bash
git clone https://github.com/TejaNaik15/ai-interview-coach.git
cd ai-interview-coach
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and add your credentials:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:
```env
# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
JWT_SECRET=your-jwt-secret-here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-interview?retryWrites=true&w=majority

# AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Payment (Optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

⚠️ **Security Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### 4. Start Development
```bash
# Frontend (Port 3000)
npm run dev

# Backend (Port 5000) - In separate terminal
npm run server
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🏗️ Project Structure

```
ai-interview-coach/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API endpoints
│   │   ├── 📁 interview/     # Interview logic
│   │   ├── 📁 question/      # Question generation
│   │   └── 📁 auth/          # Authentication
│   ├── 📁 tracks/            # Practice tracks page
│   ├── 📁 mock/              # Interview interface
│   └── 📁 dashboard/         # User dashboard
├── 📁 components/            # React components
│   ├── 📁 interview/         # Interview modes
│   │   ├── TextInterview.tsx
│   │   ├── VoiceInterview.tsx
│   │   └── CodeInterview.tsx
│   └── 📁 ui/                # UI components
├── 📁 data/                  # Question datasets
│   ├── questions.json        # DSA problems
│   └── track-questions.json  # Track-specific questions
├── 📁 lib/                   # Utilities
│   ├── interview-store.ts    # State management
│   └── utils.ts              # Helper functions
├── 📁 server/                # Express backend
│   ├── 📁 models/            # MongoDB schemas
│   ├── 📁 routes/            # API routes
│   └── 📁 middleware/        # Custom middleware
└── 📁 types/                 # TypeScript definitions
```

## 🎯 Key Features Deep Dive

### 🤖 AI Interview Engine
```typescript
// Smart question generation based on user responses
const generateContextualQuestion = async (userResponse: string, track: string) => {
  const prompt = `Based on "${userResponse}", ask a specific ${track} follow-up question...`
  return await geminiAI.generateContent(prompt)
}
```

### 🎨 Modern UI Components
```tsx
// Responsive interview interface with real-time feedback
<InterviewInterface>
  <QuestionPanel />
  <ResponseArea mode={selectedMode} />
  <FeedbackPanel evaluation={aiEvaluation} />
</InterviewInterface>
```

### 📊 Performance Analytics
```typescript
// Track user progress across different interview types
interface InterviewMetrics {
  track: string
  mode: 'text' | 'voice' | 'code'
  score: number
  duration: number
  questionsAnswered: number
}
```

## 🔧 API Endpoints

### Interview Management
```bash
POST /api/interview
# Actions: generate-question, evaluate-answer, evaluate-code

POST /api/question  
# Get track-specific coding problems

GET /api/dashboard/stats
# User performance analytics
```

### Authentication
```bash
POST /api/auth/login
POST /api/auth/signup
GET /api/auth/me
```

## 🎨 Customization

### Adding New Tracks
1. Update `tracks` configuration in `/app/tracks/page.tsx`
2. Add track-specific questions in `/data/track-questions.json`
3. Update AI prompts in `/app/api/interview/route.ts`

### Custom Question Sets
```json
{
  "your-track": {
    "easy": [
      {
        "id": "YT1",
        "title": "Your Question",
        "question": "Question description...",
        "constraints": "Constraints...",
        "examples": [{"input": "...", "output": "..."}]
      }
    ]
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables (Production)
```env
NEXTAUTH_URL=https://your-domain.com
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your-production-key
```

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Code Standards
- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Component-driven** development

## 📈 Performance

- **⚡ Fast**: Sub-second response times
- **📱 Responsive**: Mobile-first design
- **🔄 Real-time**: Live code evaluation
- **🎯 Accurate**: AI-powered scoring

## 🔒 Security

- **🔐 JWT Authentication** with HTTP-only cookies
- **🛡️ Input Validation** on all endpoints
- **🚫 Rate Limiting** to prevent abuse
- **🔒 Environment Variables** for sensitive data
- **🚨 Secret Management**: All credentials stored in environment variables
- **📝 Security Best Practices**: 
  - Never commit `.env.local` to version control
  - Rotate API keys regularly
  - Use strong, unique secrets for production
  - Enable MongoDB IP whitelisting

## 📊 Analytics & Monitoring

- **User Progress Tracking**
- **Performance Metrics**
- **Error Monitoring**
- **Usage Analytics**

## 🐛 Troubleshooting

### Common Issues

**Q: AI not generating questions?**
```bash
# Check Gemini API key
echo $GEMINI_API_KEY

# Verify API quota
curl -H "Authorization: Bearer $GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1/models
```

**Q: MongoDB connection failed?**
```bash
# Test connection
mongosh "mongodb+srv://your-connection-string"
```

**Q: Build errors?**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent question generation
- **MongoDB** for reliable data storage
- **Vercel** for seamless deployment
- **Next.js** team for the amazing framework

## 📞 Support

- **📧 Email**: tinkuteja740@gmail.com
- **💬 Discord**: [Join Community](https://discord.gg/aiinterviewcoach)
- **🐛 Issues**: [GitHub Issues](https://github.com/TejaNaik15/ai-interview-coach/issues)
- **📖 Docs**: [Documentation](https://docs.aiinterviewcoach.com)

---

<div align="center">

**⭐ Star this repo if it helped you ace your interviews! ⭐**

[🚀 Get Started](https://ai-interview-coach.vercel.app) • [📖 Documentation](https://docs.aiinterviewcoach.com) • [💬 Community](https://discord.gg/aiinterviewcoach)

</div>