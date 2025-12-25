import axios from 'axios'
import { API_BASE_URL } from './config'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  message: string
  products: any[]
}

export const chatAPI = {
  // Send message to AI chatbot
  sendMessage: async (message: string, conversationHistory: ChatMessage[]): Promise<ChatResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, {
        message,
        conversationHistory,
      })
      return response.data
    } catch (error: any) {
      console.error('Chat API error:', error)
      throw new Error(error.response?.data?.error || 'Không thể kết nối với chatbot')
    }
  },
}
