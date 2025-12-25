import { Product, Category, User, Order } from '@prisma/client'

// Extended Product Type với relations
export type ProductWithDetails = Product & {
  category: Category
}

// Cart Types
export type CartItemType = {
  id: string
  productId: string
  quantity: number
  product: Product
}

export type CartType = {
  id: string
  userId: string
  items: CartItemType[]
}

// Order Types
export type OrderWithDetails = Order & {
  items: Array<{
    id: string
    quantity: number
    price: number
    product: Product
  }>
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    ward: string
    district: string
    city: string
  }
}

// AI Types
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  products?: Product[]
}

export type ProductRecommendation = {
  product: Product
  score: number
  reason: string
}

// Filter Types
export type ProductFilters = {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  inStock?: boolean
  featured?: boolean
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating'
  search?: string
}
