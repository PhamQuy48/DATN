import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Product } from '../types'

interface WishlistState {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  loadWishlist: () => Promise<void>
}

const WISHLIST_STORAGE_KEY = '@shop_qm_wishlist'

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addToWishlist: async (product: Product) => {
    const currentItems = get().items
    const exists = currentItems.some((item) => item.id === product.id)

    if (!exists) {
      const newItems = [...currentItems, product]
      set({ items: newItems })

      try {
        await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems))
      } catch (error) {
        console.error('Error saving wishlist:', error)
      }
    }
  },

  removeFromWishlist: async (productId: string) => {
    const newItems = get().items.filter((item) => item.id !== productId)
    set({ items: newItems })

    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems))
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => item.id === productId)
  },

  clearWishlist: async () => {
    set({ items: [] })
    try {
      await AsyncStorage.removeItem(WISHLIST_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing wishlist:', error)
    }
  },

  loadWishlist: async () => {
    try {
      const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY)
      if (stored) {
        set({ items: JSON.parse(stored) })
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
  },
}))
