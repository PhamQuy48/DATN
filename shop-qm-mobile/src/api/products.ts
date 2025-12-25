import { api } from './config'
import { Product } from '../types'

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products')
      // API trả về {products: [...], pagination: {...}, filters: {...}}
      return response.data.products || []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${id}`)
      // API trả về {product: {...}}
      return response.data.product || response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    try {
      const response = await api.get('/products')
      // API trả về {products: [...]}
      const products: Product[] = response.data.products || []
      return products.filter((p) => p.featured)
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  },
}
