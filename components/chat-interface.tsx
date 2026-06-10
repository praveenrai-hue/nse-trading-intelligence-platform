'use client'

import { useState } from 'react'
import { Send, Loader } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hi! I&apos;m your AI trading assistant. I can help you understand trading signals, analyze stocks, explain options concepts, and provide trading guidance. What would you like to know?',
    timestamp: new Date(),
  },
]

const suggestedQuestions = [
  'What does this BUY signal mean?',
  'Explain the Greeks in options trading',
  'How do I calculate risk-reward ratio?',
  'What is Max Pain in option trading?',
  'Explain Put-Call Ratio (PCR)',
  'How to identify a breakout?',
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: String(messages.length + 1),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        role: 'assistant',
        content:
          'I understand you asked about that topic. This is a simulated response. In production, I would provide detailed analysis using the multi-agent AI system. Feel free to ask any trading-related questions!',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuestionClick = (question: string) => {
    setInput(question)
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Header */}
      <div className="border-b px-8 py-6">
        <h1 className="text-2xl font-bold text-foreground">AI Trading Assistant</h1>
        <p className="mt-1 text-muted-foreground">
          Ask me anything about trading signals, options, or market analysis
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-8 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary text-black'
                  : 'bg-secondary/20 text-foreground border border-border'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`mt-1 text-xs ${
                message.role === 'user' ? 'text-black/60' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary/20 border border-border rounded-lg px-4 py-3 flex items-center gap-2">
              <Loader className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="border-t px-8 py-6">
          <p className="mb-3 text-sm font-medium text-muted-foreground">Suggested questions:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {suggestedQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(question)}
                className="rounded-lg border border-border bg-secondary/5 px-3 py-2 text-left text-sm text-foreground hover:bg-secondary/20 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t px-8 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about trading..."
            className="flex-1 rounded-lg border border-border bg-secondary/20 px-4 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}
