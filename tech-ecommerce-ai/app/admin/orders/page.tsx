'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils/format'
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  Edit,
  DollarSign,
} from 'lucide-react'
import toast from 'react-hot-toast'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'REFUNDING' | 'CANCELLED'
type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  totalAmount: number
  shippingFee: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
  user?: {
    name: string
    email: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          toast.error('Không thể tải danh sách đơn hàng')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Có lỗi xảy ra khi tải đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error Response:', data)
        throw new Error(data.error || 'Failed to update order status')
      }

      const updatedOrder = data.order

      // Update local state with the updated order from API (includes paymentStatus changes)
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, ...updatedOrder } : order
      ))
      toast.success(`Đã cập nhật trạng thái đơn hàng!`)
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3" /> Chờ xác nhận
        </span>
      case 'PROCESSING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          <Package className="w-3 h-3" /> Đang xử lý
        </span>
      case 'SHIPPING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
          <Truck className="w-3 h-3" /> Đang giao
        </span>
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" /> Hoàn thành
        </span>
      case 'REFUNDING':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
          <DollarSign className="w-3 h-3" /> Đang hoàn tiền
        </span>
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" /> Đã hủy
        </span>
    }
  }

  const getPaymentStatusBadge = (paymentStatus: PaymentStatus) => {
    switch (paymentStatus) {
      case 'PAID':
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          Đã thanh toán
        </span>
      case 'PENDING':
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
          Chờ thanh toán
        </span>
      case 'REFUNDED':
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          Đã hoàn tiền
        </span>
      case 'FAILED':
        return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Thanh toán thất bại
        </span>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-600 mt-1">Theo dõi và xử lý các đơn hàng</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn, tên khách hàng, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="REFUNDING">Đang hoàn tiền</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng đơn</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredOrders.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {filteredOrders.filter(o => o.status === 'PENDING').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang giao</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {filteredOrders.filter(o => o.status === 'SHIPPING').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {filteredOrders.filter(o => o.status === 'COMPLETED').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã hủy</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {filteredOrders.filter(o => o.status === 'CANCELLED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thanh toán</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{order.customerEmail}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{order.items.length} sản phẩm</p>
                        <p className="text-gray-500 truncate max-w-[200px]">
                          {order.items[0]?.productName || 'N/A'}
                          {order.items.length > 1 && ` +${order.items.length - 1}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-600">
                          {order.paymentMethod === 'cod' ? 'COD' :
                           order.paymentMethod === 'credit-card' ? 'Thẻ' :
                           order.paymentMethod === 'momo' ? 'MoMo' : 'Chuyển khoản'}
                        </p>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowDetailModal(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'PROCESSING')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Xác nhận"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'SHIPPING')}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Giao hàng"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'SHIPPING' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Hoàn thành"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'REFUNDING' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Hoàn tiền xong"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hủy đơn"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-600 mt-1">Mã đơn: {selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedOrder(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status & Payment */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Trạng thái đơn hàng</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Thanh toán</p>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                       selectedOrder.paymentMethod === 'credit-card' ? 'Thẻ tín dụng' :
                       selectedOrder.paymentMethod === 'momo' ? 'MoMo' : 'Chuyển khoản ngân hàng'}
                    </p>
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Thông tin khách hàng
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                  <p className="font-medium text-gray-900">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Số lượng</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Đơn giá</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-700">{formatPrice(item.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatPrice(selectedOrder.totalAmount - selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">{formatPrice(selectedOrder.shippingFee)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedOrder.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'PROCESSING')
                        setShowDetailModal(false)
                      }}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Xác nhận đơn hàng
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, 'CANCELLED')
                        setShowDetailModal(false)
                      }}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Hủy đơn
                    </button>
                  </>
                )}
                {selectedOrder.status === 'PROCESSING' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'SHIPPING')
                      setShowDetailModal(false)
                    }}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Truck className="w-5 h-5" />
                    Giao hàng
                  </button>
                )}
                {selectedOrder.status === 'SHIPPING' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'COMPLETED')
                      setShowDetailModal(false)
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Hoàn thành đơn hàng
                  </button>
                )}
                {selectedOrder.status === 'REFUNDING' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, 'CANCELLED')
                      setShowDetailModal(false)
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Hoàn tiền xong
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedOrder(null)
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
