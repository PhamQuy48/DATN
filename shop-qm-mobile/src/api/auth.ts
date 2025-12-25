import { api } from './config'
import { User, AuthResponse } from '../types'

export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return {
        success: true,
        user: response.data.user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Lỗi kết nối server!',
      }
    }
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      return {
        success: true,
        user: response.data.user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Lỗi kết nối server!',
      }
    }
  },
}
