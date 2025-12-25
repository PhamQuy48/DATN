import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (response.ok && data.user) {
            set({ user: data.user, isAuthenticated: true })
            return { success: true }
          }

          return { success: false, error: data.error || 'Đăng nhập thất bại!' }
        } catch (error) {
          console.error('Login error:', error)
          return { success: false, error: 'Lỗi kết nối server!' }
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          })

          const data = await response.json()

          if (response.ok && data.user) {
            set({ user: data.user, isAuthenticated: true })
            return { success: true }
          }

          return { success: false, error: data.error || 'Đăng ký thất bại!' }
        } catch (error) {
          console.error('Register error:', error)
          return { success: false, error: 'Lỗi kết nối server!' }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)
