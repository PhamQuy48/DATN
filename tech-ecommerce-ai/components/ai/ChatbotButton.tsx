'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import Chatbot from './Chatbot'

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
        >
          <Bot className="w-8 h-8" />
          <span className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Tư vấn AI
          </span>
        </button>
      )}

      {/* Chatbot */}
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  )
}
