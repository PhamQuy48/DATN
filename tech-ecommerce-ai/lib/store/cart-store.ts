import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'
import toast from 'react-hot-toast'

export type CartItem = {
  product: Product
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find((item) => item.product.id === product.id)

        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + quantity
          if (newQuantity > product.stock) {
            toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
            return
          }
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          })
          toast.success('Đã cập nhật số lượng trong giỏ hàng')
        } else {
          // Add new item
          if (quantity > product.stock) {
            toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`)
            return
          }
          set({ items: [...items, { product, quantity }] })
          toast.success('Đã thêm vào giỏ hàng')
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
        toast.success('Đã xóa khỏi giỏ hàng')
      },

      updateQuantity: (productId: string, quantity: number) => {
        const items = get().items
        const item = items.find((item) => item.product.id === productId)

        if (!item) return

        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        if (quantity > item.product.stock) {
          toast.error(`Chỉ còn ${item.product.stock} sản phẩm trong kho`)
          return
        }

        set({
          items: items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
        toast.success('Đã xóa toàn bộ giỏ hàng')
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.salePrice || item.product.price
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
