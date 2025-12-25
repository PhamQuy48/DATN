'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils/format'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  ShoppingBag,
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
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

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

  const handleCancelOrder = async (orderId: string, orderNumber: string, paymentStatus: PaymentStatus) => {
    // Check if order was paid or not
    const isPaid = paymentStatus === 'PAID'
    const newStatus = isPaid ? 'REFUNDING' : 'CANCELLED'

    const confirmMessage = isPaid
      ? `Bạn có chắc muốn hủy đơn hàng #${orderNumber}?\n\nĐơn hàng đã thanh toán sẽ được chuyển sang trạng thái "Đang hoàn tiền" và chúng tôi sẽ xử lý hoàn tiền trong thời gian sớm nhất.`
      : `Bạn có chắc muốn hủy đơn hàng #${orderNumber}?\n\nĐơn hàng chưa thanh toán (COD) sẽ bị hủy ngay lập tức.`

    if (!confirm(confirmMessage)) {
      return
    }

    setCancellingOrderId(orderId)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel order')
      }

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      const successMessage = isPaid
        ? 'Yêu cầu hoàn tiền đã được gửi! Chúng tôi sẽ hoàn tiền cho bạn sớm nhất.'
        : 'Đơn hàng đã được hủy thành công!'
      toast.success(successMessage)
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi hủy đơn hàng')
    } finally {
      setCancellingOrderId(null)
    }
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-4 h-4" />
            Chờ xác nhận
          </span>
        )
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
            <Package className="w-4 h-4" />
            Đang xử lý
          </span>
        )
      case 'SHIPPING':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
            <Truck className="w-4 h-4" />
            Đang giao hàng
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Hoàn thành
          </span>
        )
      case 'REFUNDING':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-orange-100 text-orange-700">
            <DollarSign className="w-4 h-4" />
            Đang hoàn tiền
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-4 h-4" />
            Đã hủy
          </span>
        )
    }
  }

  const canCancelOrder = (status: OrderStatus) => {
    return status === 'PENDING' || status === 'PROCESSING'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Các đơn hàng của bạn sẽ xuất hiện ở đây sau khi đặt hàng
            </p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Mã đơn hàng</p>
                        <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-600">Ngày đặt</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Details */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Thông tin đơn hàng
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm">
                          <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">{order.customerEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600">Số điện thoại</p>
                            <p className="font-medium text-gray-900">{order.customerPhone}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600">Địa chỉ giao hàng</p>
                            <p className="font-medium text-gray-900">{order.shippingAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                          <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-gray-600">Phương thức thanh toán</p>
                            <p className="font-medium text-gray-900">
                              {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                               order.paymentMethod === 'credit-card' ? 'Thẻ tín dụng/ghi nợ' :
                               order.paymentMethod === 'momo' ? 'Ví MoMo' : 'Chuyển khoản ngân hàng'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        Sản phẩm ({order.items.length})
                      </h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-start text-sm"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-gray-600">Số lượng: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Price Summary */}
                      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tạm tính</span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(order.totalAmount - order.shippingFee)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Phí vận chuyển</span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(order.shippingFee)}
                          </span>
                        </div>
                        <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                          <span className="font-semibold text-gray-900">Tổng cộng</span>
                          <span className="font-bold text-primary-600 text-lg">
                            {formatPrice(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {canCancelOrder(order.status) && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => handleCancelOrder(order.id, order.orderNumber, order.paymentStatus)}
                        disabled={cancellingOrderId === order.id}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {cancellingOrderId === order.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            Đang hủy...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            Hủy đơn hàng
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              Cần hỗ trợ?
            </h4>
            <p className="text-sm text-blue-700">
              Bạn có thể hủy đơn hàng khi đơn hàng đang ở trạng thái "Chờ xác nhận" hoặc "Đang xử lý".
              Nếu cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
