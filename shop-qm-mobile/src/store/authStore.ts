import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../types'
import { authAPI } from '../api/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const result = await authAPI.login(email, password)
    if (result.success && result.user) {
      await AsyncStorage.setItem('user', JSON.stringify(result.user))
      set({ user: result.user, isAuthenticated: true })
      return { success: true }
    }
    return { success: false, error: result.error }
  },

  register: async (name: string, email: string, password: string) => {
    const result = await authAPI.register(name, email, password)
    if (result.success && result.user) {
      await AsyncStorage.setItem('user', JSON.stringify(result.user))
      set({ user: result.user, isAuthenticated: true })
      return { success: true }
    }
    return { success: false, error: result.error }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },

  loadUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user')
      if (userJson) {
        const user = JSON.parse(userJson)
        set({ user, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error('Error loading user:', error)
      set({ isLoading: false })
    }
  },
}))
