import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Product, CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  loadCart: () => Promise<void>
  getTotal: () => number
  getItemsCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: async (product: Product, quantity = 1) => {
    const { items } = get()
    const existingItem = items.find((item) => item.product.id === product.id)

    let newItems: CartItem[]
    if (existingItem) {
      newItems = items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      newItems = [...items, { product, quantity }]
    }

    await AsyncStorage.setItem('cart', JSON.stringify(newItems))
    set({ items: newItems })
  },

  removeFromCart: async (productId: string) => {
    const { items } = get()
    const newItems = items.filter((item) => item.product.id !== productId)
    await AsyncStorage.setItem('cart', JSON.stringify(newItems))
    set({ items: newItems })
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const { items } = get()
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }

    const newItems = items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    )
    await AsyncStorage.setItem('cart', JSON.stringify(newItems))
    set({ items: newItems })
  },

  clearCart: async () => {
    await AsyncStorage.removeItem('cart')
    set({ items: [] })
  },

  loadCart: async () => {
    try {
      const cartJson = await AsyncStorage.getItem('cart')
      if (cartJson) {
        const items = JSON.parse(cartJson)
        set({ items })
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  },

  getTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price
      return total + price * item.quantity
    }, 0)
  },

  getItemsCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },
}))
