export interface User {
  id: string
  email: string
  name: string
  role: string
  banned?: boolean
  createdAt?: string
}

export interface Product {
  id: string
  slug: string
  sku?: string
  name: string
  description: string
  price: number
  salePrice?: number
  stock: number
  images: string | string[] | any  // Hỗ trợ cả string JSON và array
  thumbnail?: string
  categoryId: string
  category?: Category
  brand?: string
  featured?: boolean
  rating?: number
  sold?: number
  views?: number
  reviews?: number
  specs?: any
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}
