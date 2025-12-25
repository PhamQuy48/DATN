import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'
import toast from 'react-hot-toast'

type WishlistStore = {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const items = get().items
        const exists = items.find((item) => item.id === product.id)

        if (exists) {
          toast.error('Sản phẩm đã có trong danh sách yêu thích')
          return
        }

        set({ items: [...items, product] })
        toast.success('Đã thêm vào danh sách yêu thích')
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        })
        toast.success('Đã xóa khỏi danh sách yêu thích')
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
        toast.success('Đã xóa toàn bộ danh sách yêu thích')
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
