'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/format'
import { isValidImageUrl } from '@/lib/utils/image-validator'
import {
  Package,
  CheckCircle,
  Clock,
  Loader,
  Plus,
  Trash2,
  Search,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  LogOut,
  User,
  Truck,
  History,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  totalAmount: number
  status: string
  createdAt: string
  items: {
    id: string
    productName: string
    quantity: number
    price: number
  }[]
}

type Product = {
  id: string
  name: string
  price: number
  salePrice: number | null
  stock: number
  thumbnail: string
  sold: number
}

type StaffUser = {
  id: string
  email: string
  name: string
  role: string
}

export default function StaffPage() {
  const router = useRouter()
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'history' | 'products'>('pending')

  // Orders state
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [processingOrders, setProcessingOrders] = useState<Order[]>([])
  const [historyOrders, setHistoryOrders] = useState<Order[]>([])
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null)

  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    brand: '',
    categoryId: ''
  })

  useEffect(() => {
    checkStaffAccess()
  }, [])

  const checkStaffAccess = async () => {
    try {
      const response = await fetch('/api/staff/me')

      if (!response.ok) {
        toast.error('Vui lòng đăng nhập tài khoản nhân viên!')
        router.push('/staff/login')
        return
      }

      const data = await response.json()
      setStaffUser(data.user)
      setLoading(false)

      // Load data
      fetchOrders()
    } catch (error) {
      console.error('Error checking access:', error)
      toast.error('Vui lòng đăng nhập!')
      router.push('/staff/login')
    }
  }

  const handleLogout = async () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      try {
        await fetch('/api/staff/logout', { method: 'POST' })
        toast.success('Đã đăng xuất!')
        router.push('/staff/login')
      } catch (error) {
        console.error('Logout error:', error)
        toast.error('Lỗi đăng xuất')
      }
    }
  }

  const fetchOrders = async () => {
    try {
      // Fetch pending orders
      const pendingResponse = await fetch('/api/orders?status=PENDING&limit=20')
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json()
        setPendingOrders(pendingData.orders || [])
      }

      // Fetch processing orders
      const processingResponse = await fetch('/api/orders?status=PROCESSING&limit=20')
      if (processingResponse.ok) {
        const processingData = await processingResponse.json()
        setProcessingOrders(processingData.orders || [])
      }

      // Fetch history orders (COMPLETED, CANCELLED, SHIPPING)
      const historyResponse = await fetch('/api/orders?limit=50')
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        const historyOrders = (historyData.orders || []).filter((order: Order) =>
          ['COMPLETED', 'CANCELLED', 'SHIPPING'].includes(order.status)
        )
        setHistoryOrders(historyOrders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải danh sách đơn hàng')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await fetch('/api/products')

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Không thể tải danh sách sản phẩm')
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'products' && products.length === 0) {
      fetchProducts()
    }
  }, [activeTab])

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm('Xác nhận đơn hàng này?')) return

    setProcessingOrderId(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' })
      })

      if (!response.ok) {
        throw new Error('Failed to confirm order')
      }

      toast.success('Đã xác nhận đơn hàng!')
      fetchOrders() // Reload orders
    } catch (error) {
      console.error('Error confirming order:', error)
      toast.error('Không thể xác nhận đơn hàng')
    } finally {
      setProcessingOrderId(null)
    }
  }

  const handleConfirmShipping = async (orderId: string) => {
    if (!confirm('Xác nhận chuyển hàng đơn này?')) return

    setProcessingOrderId(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SHIPPING' })
      })

      if (!response.ok) {
        throw new Error('Failed to confirm shipping')
      }

      toast.success('Đã xác nhận chuyển hàng!')
      fetchOrders() // Reload orders
    } catch (error) {
      console.error('Error confirming shipping:', error)
      toast.error('Không thể xác nhận chuyển hàng')
    } finally {
      setProcessingOrderId(null)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.price || !newProduct.brand) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    try {
      const productData = {
        name: newProduct.name,
        slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
        brand: newProduct.brand,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        description: `Sản phẩm ${newProduct.name}`,
        categoryId: newProduct.categoryId || 'cm7mj6dez0000v92xc3ic5qeu', // Default category
        images: JSON.stringify(['/placeholder-product.jpg']),
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      toast.success('Đã thêm sản phẩm mới!')
      setShowAddForm(false)
      setNewProduct({ name: '', price: '', stock: '', brand: '', categoryId: '' })
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Không thể thêm sản phẩm')
    }
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Xóa sản phẩm "${productName}"?`)) return

    setDeletingProductId(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Đã xóa sản phẩm!')
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Không thể xóa sản phẩm')
    } finally {
      setDeletingProductId(null)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading || !staffUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🛍️ Quản Lý Bán Hàng</h1>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  {staffUser?.name}
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {staffUser?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Về trang chủ
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-yellow-600 text-yellow-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Chờ xác nhận
                {pendingOrders.length > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                    {pendingOrders.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'processing'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Đang xử lý
                {processingOrders.length > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {processingOrders.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Lịch sử đơn hàng
              </div>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Quản lý sản phẩm
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Pending Orders Tab */}
        {activeTab === 'pending' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Đơn hàng chờ xác nhận
              </h2>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </button>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Không có đơn hàng chờ xác nhận</p>
                <p className="text-gray-500 text-sm mt-2">
                  Các đơn hàng mới sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border-l-4 border-l-yellow-500 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Đơn hàng #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Khách hàng: {order.customerName} - {order.customerPhone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Chờ xác nhận
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Sản phẩm ({order.items.length}):
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} x{item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      disabled={processingOrderId === order.id}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {processingOrderId === order.id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Xác nhận đơn hàng
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Processing Orders Tab */}
        {activeTab === 'processing' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Đơn hàng đang xử lý
              </h2>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </button>
            </div>

            {processingOrders.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Không có đơn hàng đang xử lý</p>
                <p className="text-gray-500 text-sm mt-2">
                  Các đơn hàng đã xác nhận sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {processingOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border-l-4 border-l-blue-500 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Đơn hàng #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Khách hàng: {order.customerName} - {order.customerPhone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          <Package className="w-3 h-3 inline mr-1" />
                          Đang xử lý
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Sản phẩm ({order.items.length}):
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.productName} x{item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleConfirmShipping(order.id)}
                      disabled={processingOrderId === order.id}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {processingOrderId === order.id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Truck className="w-5 h-5" />
                          Xác nhận chuyển hàng
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Lịch sử đơn hàng
              </h2>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </button>
            </div>

            {historyOrders.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Chưa có lịch sử đơn hàng</p>
                <p className="text-gray-500 text-sm mt-2">
                  Các đơn hàng đã hoàn thành hoặc hủy sẽ hiển thị ở đây
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {historyOrders.map((order) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'COMPLETED':
                        return (
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Hoàn thành
                          </span>
                        )
                      case 'CANCELLED':
                        return (
                          <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            <XCircle className="w-3 h-3 inline mr-1" />
                            Đã hủy
                          </span>
                        )
                      case 'SHIPPING':
                        return (
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            <Truck className="w-3 h-3 inline mr-1" />
                            Đang giao
                          </span>
                        )
                      default:
                        return null
                    }
                  }

                  const getBorderColor = (status: string) => {
                    switch (status) {
                      case 'COMPLETED':
                        return 'border-l-green-500'
                      case 'CANCELLED':
                        return 'border-l-red-500'
                      case 'SHIPPING':
                        return 'border-l-orange-500'
                      default:
                        return 'border-l-gray-500'
                    }
                  }

                  return (
                    <div key={order.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor(order.status)} p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Đơn hàng #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Khách hàng: {order.customerName} - {order.customerPhone}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </div>
                          <div className="mt-2">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Sản phẩm ({order.items.length}):
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.productName} x{item.quantity}
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thêm sản phẩm mới</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm *
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thương hiệu *
                      </label>
                      <input
                        type="text"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá (VNĐ) *
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Thêm sản phẩm
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Products List */}
            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProducts.map((product) => {
                  const hasValidThumbnail = isValidImageUrl(product.thumbnail)
                  return (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                        {hasValidThumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                            <div className="text-2xl">📦</div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span className="font-bold text-blue-600">
                            {formatPrice(product.salePrice || product.price)}
                          </span>
                          <span className="text-gray-600">
                            Tồn kho: {product.stock}
                          </span>
                          <span className="text-gray-600">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            Đã bán: {product.sold}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        disabled={deletingProductId === product.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        {deletingProductId === product.id ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
