import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Note: Question generation now handled by /api/question endpoint using JSON dataset

export async function POST(request: NextRequest) {
  let requestBody: any
  try {
    requestBody = await request.json()
    const { action, mode, track, context, askedQuestions, difficulty, language, userResponse } = requestBody
    console.log('Interview API called:', { action, mode, track, context: context?.substring(0, 100) })
    
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    if (action === 'generate-question') {
      // Clean and format asked questions for better uniqueness checking
      const cleanAskedQuestions = (askedQuestions || []).map((q: string) => 
        q.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim()
      )
      const askedQuestionsStr = (askedQuestions || []).join('\n') || 'None'
      console.log('Generating question for track:', track, 'mode:', mode)
      console.log('Asked questions count:', askedQuestions?.length || 0)
      
      // For code mode, use JSON dataset via /api/question
      if (mode === 'code') {
        const questionCount = askedQuestions?.length || 0
        console.log(`Code interview: ${difficulty.toUpperCase()} level, ${questionCount} questions asked`)
      }
      
      // Track-specific question prompts
      const trackPrompts = {
        frontend: {
          text: `You are a FAANG frontend technical interviewer. Analyze the candidate's response and ask a SPECIFIC follow-up question.

Candidate just said: "${context}"

Previously asked questions (NEVER repeat these exact questions):
${askedQuestionsStr}

Based on their response, ask about:
- If they mentioned React: Ask about specific hooks, performance, or state management
- If they mentioned JavaScript: Ask about ES6+ features, async/await, or closures
- If they mentioned CSS: Ask about flexbox, grid, animations, or responsive design
- If they mentioned APIs: Ask about error handling, caching, or authentication
- If they mentioned performance: Ask about optimization techniques or metrics
- If they mentioned libraries: Ask about implementation details or alternatives

Rules:
1. Ask ONE specific question directly related to what they just mentioned
2. Be conversational and natural
3. Ask for concrete examples or implementation details
4. Don't repeat any previously asked questions
5. Make it progressively more technical

Return only JSON:
{
  "question": "specific follow-up question based on their exact response"
}`,
          code: `Generate a ${difficulty.toUpperCase()} frontend coding problem.

Previously asked problems (avoid these):
${askedQuestionsStr}

For ${difficulty.toUpperCase()} frontend coding:
${difficulty === 'easy' ? 
  'Focus on DOM manipulation, basic React components, simple JavaScript functions, CSS styling challenges.' :
  difficulty === 'medium' ?
  'Intermediate React hooks, state management, API integration, responsive design challenges, performance optimization.' :
  'Advanced React patterns, custom hooks, complex state management, build tool configuration, advanced CSS techniques.'
}

Return JSON:
{
  "difficulty": "${difficulty}",
  "question": "Frontend coding problem",
  "constraints": ["Frontend-specific constraints"],
  "examples": [{"input": "Example input", "output": "Expected output", "explanation": "Solution explanation"}]
}`
        },
        backend: {
          text: `You are a FAANG backend technical interviewer. Ask a SPECIFIC follow-up based on their response.

Candidate just said: "${context}"

Previously asked questions (NEVER repeat):
${askedQuestionsStr}

Based on their response, ask about:
- If they mentioned APIs: Ask about REST vs GraphQL, error handling, or rate limiting
- If they mentioned databases: Ask about SQL vs NoSQL, indexing, or transactions
- If they mentioned Node.js: Ask about event loop, clustering, or memory management
- If they mentioned authentication: Ask about JWT, OAuth, or session management
- If they mentioned caching: Ask about Redis, cache invalidation, or strategies
- If they mentioned deployment: Ask about CI/CD, containers, or monitoring

Rules:
1. Ask ONE specific question about what they just mentioned
2. Be conversational and build on their exact words
3. Ask for implementation details or real examples
4. Don't repeat previous questions
5. Make it progressively deeper

Return only JSON:
{
  "question": "specific follow-up question based on their response"
}`,
          code: `Generate a ${difficulty.toUpperCase()} backend coding problem.

Previously asked problems (avoid these):
${askedQuestionsStr}

For ${difficulty.toUpperCase()} backend coding:
${difficulty === 'easy' ? 
  'Focus on basic API endpoints, simple database queries, file operations, basic algorithms.' :
  difficulty === 'medium' ?
  'Intermediate API design, database relationships, authentication logic, caching implementation.' :
  'Advanced system design, complex database optimization, distributed systems, performance tuning.'
}

Return JSON:
{
  "difficulty": "${difficulty}",
  "question": "Backend coding problem",
  "constraints": ["Backend-specific constraints"],
  "examples": [{"input": "Example input", "output": "Expected output", "explanation": "Solution explanation"}]
}`
        },
        'system-design': {
          text: `You are a FAANG system design interviewer. Generate a NEW system design question.

Candidate's response: "${context}"

Previously asked questions (NEVER repeat):
${askedQuestionsStr}

System design question categories to explore:
- Scalability and load balancing
- Database sharding and replication
- Caching strategies (Redis, Memcached)
- CDN and content delivery
- Message queues and pub/sub systems
- Microservices vs monolithic architecture
- Distributed systems and consistency
- Performance monitoring and observability

Rules:
1. Generate a UNIQUE system design question not in the previous list
2. Build on their response naturally
3. Focus on scalability and architecture
4. Ask for specific design decisions and trade-offs
5. Progress from basic to advanced system design concepts

Return JSON:
{
  "question": "your new system design follow-up question"
}`,
          code: `Generate a ${difficulty.toUpperCase()} system design coding problem.

Previously asked problems (avoid these):
${askedQuestionsStr}

For ${difficulty.toUpperCase()} system design coding:
${difficulty === 'easy' ? 
  'Focus on basic system components, simple load balancer logic, basic caching implementation.' :
  difficulty === 'medium' ?
  'Intermediate distributed system components, database partitioning logic, message queue implementation.' :
  'Advanced distributed algorithms, consensus protocols, complex system optimization.'
}

Return JSON:
{
  "difficulty": "${difficulty}",
  "question": "System design coding problem",
  "constraints": ["System design constraints"],
  "examples": [{"input": "Example input", "output": "Expected output", "explanation": "Solution explanation"}]
}`
        },
        dsa: {
          text: `You are a FAANG DSA technical interviewer. Generate a NEW algorithms question.

Candidate's response: "${context}"

Previously asked questions (NEVER repeat):
${askedQuestionsStr}

DSA question categories to explore:
- Array and string manipulation techniques
- Tree and graph traversal algorithms
- Dynamic programming approaches
- Sorting and searching algorithms
- Hash table and set operations
- Recursion and backtracking
- Time and space complexity analysis
- Optimization strategies

Rules:
1. Generate a UNIQUE DSA question not in the previous list
2. Build on their response naturally
3. Focus on algorithmic thinking and problem-solving
4. Ask for specific algorithm implementations
5. Progress from basic to advanced DSA concepts

Return JSON:
{
  "question": "your new DSA follow-up question"
}`,
          code: `Generate a ${difficulty.toUpperCase()} DSA coding problem from our dataset.

Previously asked problems (avoid these IDs):
${askedQuestionsStr}

For ${difficulty.toUpperCase()} level:
${difficulty === 'easy' ? 
  'Focus on fundamental algorithms and data structures. Time complexity O(n) or O(n log n). Clear problem statements with basic constraints.' :
  difficulty === 'medium' ?
  'Intermediate algorithms like sliding window, binary search, DP. Time complexity O(n log n) to O(n²). Multiple solution approaches possible.' :
  'Advanced algorithms including complex DP, graph theory, advanced DS. Optimization challenges and system design elements. Time complexity O(n²) or better optimization required.'
}

Return a problem from our comprehensive dataset that has not been asked before.

Return JSON:
{
  "difficulty": "${difficulty}",
  "question": "Problem from dataset",
  "constraints": ["Dataset constraints"],
  "examples": [{"input": "Dataset input", "output": "Dataset output", "explanation": "Dataset explanation"}]
}`
        },
        behavioral: {
          text: `You are a FAANG behavioral interviewer. Ask a SPECIFIC follow-up based on their response.

Candidate just said: "${context}"

Previously asked questions (NEVER repeat):
${askedQuestionsStr}

Based on their response, ask about:
- If they mentioned teamwork: Ask about a specific conflict or collaboration challenge
- If they mentioned learning: Ask about a time they failed or struggled
- If they mentioned leadership: Ask about a difficult decision or team motivation
- If they mentioned projects: Ask about obstacles, timeline pressure, or stakeholder management
- If they mentioned problem-solving: Ask for a specific example with details
- If they mentioned growth: Ask about feedback they received or gave

Rules:
1. Ask ONE specific behavioral question related to what they mentioned
2. Use "Tell me about a time when..." format
3. Ask for concrete examples with STAR method details
4. Don't repeat previous questions
5. Dig deeper into their experiences

Return only JSON:
{
  "question": "specific behavioral follow-up question"
}`
        }
      }

      const prompts = {
        text: trackPrompts[track as keyof typeof trackPrompts]?.text || `You are a FAANG technical interviewer. Generate a NEW question.

Candidate's response: "${context}"

Previously asked questions (NEVER repeat):
${askedQuestionsStr}

Question categories to explore:
- Technical depth and experience
- System design and architecture
- Problem-solving approaches
- Project challenges and solutions
- Technology choices and trade-offs
- Team collaboration and leadership
- Learning and growth experiences

Rules:
1. Generate a UNIQUE question not in the previous list
2. Build on their response naturally
3. Explore different aspects of their experience
4. Ask for specific examples and details
5. Progress from basic to advanced topics

Return JSON:
{
  "question": "your new follow-up question"
}`,
        
        voice: trackPrompts[track as keyof typeof trackPrompts]?.text?.replace('technical interviewer', 'voice interviewer').replace('Generate a NEW', 'Generate a NEW voice-friendly') || `You are conducting a FAANG voice interview.

Candidate said: "${context}"
Previously asked questions:
${askedQuestionsStr}

Rules:
1. NEVER repeat any previously asked questions
2. Ask ONE clear question that's easy to answer verbally
3. Build directly on what they just said
4. Focus on behavioral and communication skills
5. Keep questions conversational

Return JSON:
{
  "question": "your voice-friendly question"
}`,
        
        code: trackPrompts[track as keyof typeof trackPrompts]?.code || `Generate a ${difficulty.toUpperCase()} coding problem from our curated dataset.

Previously asked problems (avoid these IDs):
${askedQuestionsStr}

For ${difficulty.toUpperCase()} level:
${difficulty === 'easy' ? 
  'Focus on fundamental algorithms and data structures. Time complexity O(n) or O(n log n). Clear problem statements with basic constraints.' :
  difficulty === 'medium' ?
  'Intermediate algorithms like sliding window, binary search, DP. Time complexity O(n log n) to O(n²). Multiple solution approaches possible.' :
  'Advanced algorithms including complex DP, graph theory, advanced DS. Optimization challenges and system design elements. Time complexity O(n²) or better optimization required.'
}

Return a problem from our comprehensive dataset that has not been asked before.

Return JSON:
{
  "difficulty": "${difficulty}",
  "question": "Problem from dataset",
  "constraints": ["Dataset constraints"],
  "examples": [{"input": "Dataset input", "output": "Dataset output", "explanation": "Dataset explanation"}]
}`
      }

      console.log('Using prompt for mode:', mode)
      console.log('Prompt preview:', prompts[mode].substring(0, 200) + '...')
      
      const result = await model.generateContent(prompts[mode])
      const response = await result.response
      let text = response.text().trim()
      
      console.log('Gemini raw response:', text)
      
      // Clean JSON response
      if (text.includes('```json')) {
        text = text.split('```json')[1].split('```')[0].trim()
      } else if (text.includes('```')) {
        text = text.split('```')[1].split('```')[0].trim()
      }
      
      try {
        const parsed = JSON.parse(text)
        console.log('Parsed JSON:', parsed)
        
        // Check if the generated question is too similar to previous ones
        if (parsed.question) {
          const newQuestionClean = parsed.question.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim()
          const isSimilar = cleanAskedQuestions.some(asked => {
            const similarity = newQuestionClean.includes(asked.substring(0, 20)) || asked.includes(newQuestionClean.substring(0, 20))
            return similarity && asked.length > 10
          })
          
          if (isSimilar) {
            console.log('Question too similar, using fallback')
            const fallbackQuestions = {
              frontend: [
                "Can you walk me through how you handle state management in complex React applications?",
                "What's your approach to optimizing frontend performance?",
                "How do you ensure cross-browser compatibility in your projects?",
                "Describe your experience with frontend testing strategies."
              ],
              backend: [
                "How do you design APIs for scalability?",
                "What's your approach to database optimization?",
                "How do you handle error management in production?",
                "Describe your experience with microservices architecture."
              ],
              behavioral: [
                "Tell me about a time when you had to make a difficult technical decision.",
                "Describe a situation where you had to work with a challenging team member.",
                "Give me an example of when you had to learn something completely new.",
                "Tell me about a project that didn't go as planned."
              ]
            }
            const trackFallbacks = fallbackQuestions[track as keyof typeof fallbackQuestions] || fallbackQuestions.frontend
            const randomFallback = trackFallbacks[Math.floor(Math.random() * trackFallbacks.length)]
            return NextResponse.json({ question: randomFallback })
          }
        }
        
        return NextResponse.json(parsed)
      } catch (parseError) {
        console.log('JSON parse failed, returning raw text as question')
        // If JSON parsing fails, treat the whole response as the question
        if (text && text.length > 10) {
          return NextResponse.json({ question: text })
        } else {
          // Fallback questions by track
          const fallbackQuestions = {
            frontend: "Can you walk me through how you would optimize the performance of a React application?",
            backend: "How would you design a RESTful API for a user management system?",
            'system-design': "How would you design a URL shortening service to handle millions of requests?",
            dsa: "Can you explain your approach to solving dynamic programming problems?",
            behavioral: "Tell me about a time when you had to work under pressure to meet a deadline."
          }
          const fallback = fallbackQuestions[track as keyof typeof fallbackQuestions] || "Can you tell me more about your technical experience?"
          return NextResponse.json({ question: fallback })
        }
      }
    }

    if (action === 'evaluate-answer') {
      const prompt = `Evaluate this ${mode} interview answer and provide a score out of 10.

Question: ${context}
Answer: ${userResponse}

Score based on:
- Communication clarity (0-3 points)
- Technical content (0-4 points) 
- Specific examples (0-3 points)

Provide constructive feedback and suggestions.

Return JSON:
{
  "score": 7,
  "feedback": "Good introduction! You mentioned development background and scalar applications. To strengthen your response, provide specific examples of technologies you've used, programming languages you're proficient in, and describe a particular project you've worked on.",
  "strengths": ["Clear communication", "Relevant background mentioned"],
  "weaknesses": ["Need more specific technical details", "Could provide concrete project examples"]
}`

      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text().trim()
      
      if (text.includes('```json')) {
        text = text.split('```json')[1].split('```')[0].trim()
      }
      
      try {
        const parsed = JSON.parse(text)
        // Ensure score is a number
        if (parsed.score) {
          parsed.score = parseInt(parsed.score) || 5
        }
        return NextResponse.json(parsed)
      } catch (parseError) {
        console.error('JSON parse error for evaluation:', parseError)
        // Better fallback based on mode
        const fallbackScore = mode === 'code' ? 4 : 6
        return NextResponse.json({
          score: fallbackScore,
          feedback: `Your ${mode === 'code' ? 'code solution' : 'answer'} shows understanding but needs improvement. ${text}`,
          strengths: [mode === 'code' ? "Shows problem-solving approach" : "Demonstrates knowledge"],
          weaknesses: [mode === 'code' ? "Could optimize further" : "Could be more specific with examples"]
        })
      }
    }

    if (action === 'evaluate-code') {
      // Check if no code was provided
      const codeContent = userResponse?.trim() || ''
      if (!codeContent || codeContent === '1234' || codeContent.length < 10) {
        return NextResponse.json({
          score: 0,
          feedback: "No code solution provided. Please write your implementation to solve the problem.",
          strengths: [],
          weaknesses: ["No code submitted", "Need to implement the solution"]
        })
      }

      const prompt = `Evaluate this ${language} code solution and return JSON.

Problem: ${context}

Code:
${userResponse}

Score out of 10 based on:
- Correctness (0-4 points)
- Efficiency (0-3 points) 
- Code quality (0-3 points)

Return exactly this JSON format:
{
  "score": 7,
  "feedback": "Your solution works but can be optimized. Time complexity is O(n²), consider using HashMap for O(n). Handle edge cases like empty input.",
  "strengths": ["Correct logic", "Clean code structure"],
  "weaknesses": ["Can optimize time complexity", "Missing edge case handling"]
}`

      const result = await model.generateContent(prompt)
      const response = await result.response
      let text = response.text().trim()
      
      if (text.includes('```json')) {
        text = text.split('```json')[1].split('```')[0].trim()
      }
      
      try {
        // Try to parse JSON
        let parsed
        if (text.startsWith('{') && text.endsWith('}')) {
          parsed = JSON.parse(text)
        } else {
          // Extract JSON from text if wrapped in other content
          const jsonMatch = text.match(/\{[^}]+\}/s)
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0])
          } else {
            throw new Error('No JSON found')
          }
        }
        
        // Ensure required fields exist
        parsed.score = parseInt(parsed.score) || 5
        parsed.feedback = parsed.feedback || "Code evaluation completed"
        parsed.strengths = parsed.strengths || ["Shows effort"]
        parsed.weaknesses = parsed.weaknesses || ["Needs improvement"]
        
        console.log('Parsed evaluation:', parsed)
        return NextResponse.json(parsed)
      } catch (parseError) {
        console.error('JSON parse error for code evaluation:', parseError, 'Raw text:', text)
        
        // Create evaluation from raw text
        const score = text.includes('good') || text.includes('correct') ? 7 : 
                     text.includes('works') || text.includes('solution') ? 6 : 5
        
        return NextResponse.json({
          score,
          feedback: `Code Review: ${text.substring(0, 200)}...`,
          strengths: ["Demonstrates programming knowledge", "Attempts problem solving"],
          weaknesses: ["Consider optimization opportunities", "Review edge case handling"]
        })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API error:', error)
    
    // If this is a question generation request that failed, provide fallback
    if (requestBody?.action === 'generate-question') {
      const fallbackQuestions = {
        frontend: "Can you describe a challenging frontend problem you've solved recently?",
        backend: "How do you handle error management in your backend applications?",
        'system-design': "What factors do you consider when designing a scalable system?",
        dsa: "Walk me through your problem-solving approach for algorithmic challenges.",
        behavioral: "Tell me about a time when you had to learn something new quickly."
      }
      
      const track = requestBody.track || 'frontend'
      const fallback = fallbackQuestions[track as keyof typeof fallbackQuestions] || "Can you tell me more about your experience?"
      return NextResponse.json({ question: fallback })
    }
    
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}