import axios from 'axios'

/**
 * CẤU HÌNH API
 *
 * Để dễ dàng thay đổi khi mang đi nơi khác:
 * 1. Copy file `config.local.example.ts` thành `config.local.ts`
 * 2. Sửa IP và PORT trong `config.local.ts`
 * 3. File sẽ tự động import từ config.local.ts
 *
 * Nếu không có config.local.ts, sẽ dùng mặc định bên dưới
 */

// Import từ config.local.ts nếu có (không bị commit lên git)
let API_BASE_URL = 'http://192.168.1.2:3004' // Default

try {
  // @ts-ignore - File này có thể không tồn tại
  const localConfig = require('./config.local')
  if (localConfig.API_BASE_URL) {
    API_BASE_URL = localConfig.API_BASE_URL
    console.log('📡 Sử dụng API từ config.local.ts:', API_BASE_URL)
  }
} catch (e) {
  console.log('📡 Sử dụng API mặc định:', API_BASE_URL)
  console.log('💡 Tạo file config.local.ts để tùy chỉnh (xem config.local.example.ts)')
}

export { API_BASE_URL }

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)
