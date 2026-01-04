'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, Loader2, Sparkles, Zap, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type ProductSuggestion = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  salePrice: number | null
  finalPrice: number
  discount: number
  description: string
  rating: number
  sold: number
  stock: number
  images: string[]
}

type Message = {
  role: 'user' | 'assistant'
  content: string
  products?: ProductSuggestion[]
  timestamp: Date
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

type ChatbotProps = {
  onClose: () => void
}

const quickSuggestions = [
  { icon: '💻', text: 'Laptop gaming tốt nhất', query: 'Tôi muốn tìm laptop gaming mạnh nhất' },
  { icon: '📱', text: 'iPhone mới nhất', query: 'iPhone mới nhất giá bao nhiêu?' },
  { icon: '💰', text: 'Sản phẩm dưới 20 triệu', query: 'Gợi ý sản phẩm dưới 20 triệu' },
  { icon: '⭐', text: 'Sản phẩm hot nhất', query: 'Sản phẩm nào đang hot nhất?' },
]

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của Thế Giới Công Nghệ.\n\nTôi có thể giúp bạn:\n• Tìm sản phẩm phù hợp 💻\n• So sánh giá và tính năng 📊\n• Gợi ý theo ngân sách 💰\n\nBạn cần tìm gì hôm nay?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent, queryText?: string) => {
    e.preventDefault()
    const messageText = queryText || input
    if (!messageText.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        products: data.products,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại. 😊',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: typeof quickSuggestions[0]) => {
    setInput(suggestion.query)
    inputRef.current?.focus()
  }

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-slide-up">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white p-5 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/20 animate-pulse-slow"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce-slow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              AI Assistant
              <Zap className="w-4 h-4 animate-pulse" />
            </h3>
            <p className="text-xs text-red-100">Tư vấn thông minh 24/7</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-2 rounded-lg transition-colors relative z-10"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message, index) => (
          <div key={index} className="animate-fade-in">
            <div
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Product Suggestions */}
            {message.products && message.products.length > 0 && (
              <div className="mt-3 ml-12 space-y-2 animate-slide-up">
                {message.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg transition-all group"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {product.images?.[0] && product.images[0].trim() !== '' && (product.images[0].startsWith('http') || product.images[0].startsWith('/')) ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-3xl">📦</span>
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-red-600">
                          {formatPrice(product.finalPrice)}
                        </p>
                        {product.salePrice && product.salePrice < product.price && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5">
                          <span className="text-yellow-500">★</span>
                          {product.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>Đã bán {product.sold}</span>
                        {product.stock > 0 ? (
                          <span className="text-green-600">• Còn {product.stock}</span>
                        ) : (
                          <span className="text-red-600">• Hết hàng</span>
                        )}
                      </div>
                    </div>
                    <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 self-center" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                <span className="text-sm text-gray-600">Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-4 pb-3 pt-2">
          <p className="text-xs text-gray-500 mb-2 font-medium">Gợi ý nhanh:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-md transition-all text-xs group"
              >
                <span className="text-base mb-1 block group-hover:scale-110 transition-transform inline-block">
                  {suggestion.icon}
                </span>
                <span className="text-gray-700 font-medium">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full flex items-center justify-center hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
