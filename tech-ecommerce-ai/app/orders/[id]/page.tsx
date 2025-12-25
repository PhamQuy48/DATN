'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import OrderTimeline from '@/components/orders/OrderTimeline'
import { formatPrice } from '@/lib/utils/format'
import { ArrowLeft, Package, MapPin, CreditCard, Tag, Loader, XCircle, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

type Order = {
  id: string
  orderNumber: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDING'
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED'
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  totalAmount: number
  discount: number
  shippingFee: number
  voucherCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
  items: {
    id: string
    productId: string
    productName: string
    price: number
    quantity: number
  }[]
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [orderId, setOrderId] = useState<string>('')

  useEffect(() => {
    params.then(p => setOrderId(p.id))
  }, [params])

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập!')
      router.push('/login')
      return
    }

    if (status === 'authenticated' && orderId) {
      fetchOrder()
    }
  }, [status, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order')
      }

      setOrder(data.order)
    } catch (error: any) {
      console.error('Error fetching order:', error)
      toast.error(error.message || 'Không tìm thấy đơn hàng')
      router.push('/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return

    if (order.status !== 'PENDING') {
      toast.error('Chỉ có thể hủy đơn hàng đang chờ xác nhận!')
      return
    }

    const confirmed = confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')
    if (!confirmed) return

    setCancelling(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order')
      }

      toast.success('Đã hủy đơn hàng thành công!')
      fetchOrder() // Reload order data
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      toast.error(error.message || 'Không thể hủy đơn hàng')
    } finally {
      setCancelling(false)
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)'
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng'
      default:
        return method
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'PAID':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Đã thanh toán</span>
      case 'PENDING':
        return <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Chờ thanh toán</span>
      case 'REFUNDED':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Đã hoàn tiền</span>
      case 'FAILED':
        return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Thất bại</span>
      default:
        return null
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h1>
            <Link href="/cart" className="text-blue-600 hover:text-blue-700">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đơn hàng #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Đặt hàng lúc {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Cancel Order Button */}
            {order.status === 'PENDING' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Đang hủy...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Hủy đơn hàng
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <OrderTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm đã đặt</h3>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Số lượng: {item.quantity}</span>
                        <span>•</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">Địa chỉ giao hàng</h3>
              </div>

              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p>{order.customerEmail}</p>
                <p className="text-gray-600">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-gray-900">Ghi chú đơn hàng</h3>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h3>

              {/* Payment Method */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Phương thức thanh toán</span>
                </div>
                <p className="text-gray-900">{getPaymentMethodLabel(order.paymentMethod)}</p>
                <div className="mt-2">
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>

              {/* Voucher */}
              {order.voucherCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Mã giảm giá</span>
                  </div>
                  <p className="font-semibold text-green-700">{order.voucherCode}</p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">
                    {formatPrice(order.totalAmount - order.shippingFee + order.discount)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium">
                    {order.shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(order.shippingFee)
                    )}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span className="font-medium">-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
