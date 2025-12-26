'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice } from '@/lib/utils/format'
import { ShoppingBag, Tag, CheckCircle, X, Loader, Edit2, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidImageUrl } from '@/lib/utils/image-validator'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, clearCart, removeItem } = useCartStore()
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherData, setVoucherData] = useState<any>(null)
  const [voucherValidating, setVoucherValidating] = useState(false)
  const [voucherError, setVoucherError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'cod',
    notes: ''
  })
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const profileData = await response.json()
            setFormData((prev) => ({
              ...prev,
              customerName: profileData.name || '',
              customerEmail: profileData.email || '',
              customerPhone: profileData.phone || '',
              shippingAddress: profileData.address || ''
            }))
            setProfileLoaded(true)
          }
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
    }

    loadProfile()
  }, [status])

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập để thanh toán!')
      router.push('/login')
      return
    }

    // Load selected items from localStorage
    const storedIds = localStorage.getItem('checkoutItemIds')
    if (storedIds) {
      const ids = JSON.parse(storedIds)
      setSelectedItemIds(ids)
      const selected = items.filter((item) => ids.includes(item.product.id))
      setSelectedItems(selected)

      if (selected.length === 0) {
        toast.error('Không tìm thấy sản phẩm trong giỏ hàng!')
        router.push('/cart')
      }
    } else {
      toast.error('Vui lòng chọn sản phẩm từ giỏ hàng!')
      router.push('/cart')
    }
  }, [status, session, items, router])

  // Calculate totals
  const subtotal = selectedItems.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price
    return total + price * item.quantity
  }, 0)

  const shippingFee = subtotal >= 10000000 ? 0 : 30000
  const discount = voucherData?.discount || 0
  const totalAmount = subtotal + shippingFee - discount

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Vui lòng nhập mã voucher!')
      return
    }

    setVoucherValidating(true)
    setVoucherError('')

    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherCode,
          orderTotal: subtotal
        })
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        setVoucherError(data.error || 'Mã voucher không hợp lệ')
        setVoucherData(null)
        toast.error(data.error || 'Mã voucher không hợp lệ')
      } else {
        setVoucherData(data)
        toast.success(`Đã áp dụng mã giảm ${formatPrice(data.discount)}!`)
      }
    } catch (error) {
      console.error('Error validating voucher:', error)
      setVoucherError('Có lỗi xảy ra khi kiểm tra voucher')
      toast.error('Có lỗi xảy ra khi kiểm tra voucher')
    } finally {
      setVoucherValidating(false)
    }
  }

  const handleRemoveVoucher = () => {
    setVoucherCode('')
    setVoucherData(null)
    setVoucherError('')
    toast.success('Đã xóa mã giảm giá')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedItems.length === 0) {
      toast.error('Giỏ hàng trống!')
      return
    }

    // Validate required fields
    if (!formData.customerName || !formData.customerName.trim()) {
      toast.error('Vui lòng nhập họ tên!')
      return
    }
    if (!formData.customerEmail || !formData.customerEmail.trim()) {
      toast.error('Vui lòng nhập email!')
      return
    }
    if (!formData.customerPhone || !formData.customerPhone.trim()) {
      toast.error('Vui lòng nhập số điện thoại!')
      return
    }
    if (!formData.shippingAddress || !formData.shippingAddress.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!')
      return
    }

    setSubmitting(true)

    try {
      const orderItems = selectedItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity
      }))

      const orderData = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim() || null,
        items: orderItems,
        totalAmount,
        shippingFee,
        voucherId: voucherData?.voucher?.id || null,
        voucherCode: voucherData?.voucher?.code || null,
        discount: voucherData?.discount || 0
      }

      console.log('Order data being sent:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Order creation failed:', data)
        throw new Error(data.error || 'Failed to create order')
      }

      toast.success('Đặt hàng thành công!')

      // Remove ONLY purchased items from cart (not all items!)
      selectedItemIds.forEach((id) => {
        removeItem(id)
      })

      // Clear localStorage
      localStorage.removeItem('checkoutItemIds')

      // Redirect to order success page
      router.push(`/orders/${data.order.id}`)
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading' || selectedItems.length === 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Thông tin giao hàng</h2>
                  {profileLoaded && formData.customerPhone && formData.shippingAddress && (
                    <button
                      type="button"
                      onClick={() => router.push('/profile')}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {profileLoaded && formData.customerPhone && formData.shippingAddress ? (
                  <div className="space-y-4">
                    {/* Profile info loaded - Display as readonly */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Họ và tên
                        </label>
                        <p className="text-gray-900 font-medium">{formData.customerName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Email
                          </label>
                          <p className="text-gray-900">{formData.customerEmail}</p>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Số điện thoại
                          </label>
                          <p className="text-gray-900">{formData.customerPhone}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Địa chỉ giao hàng
                        </label>
                        <p className="text-gray-900 whitespace-pre-line">
                          {formData.shippingAddress.split('|').filter(p => p).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        💡 Thông tin được tự động điền từ hồ sơ của bạn. Bấm <strong>Chỉnh sửa</strong> để cập nhật.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* No profile info - Show form */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-700">
                        ⚠️ Bạn chưa cập nhật thông tin giao hàng.{' '}
                        <button
                          type="button"
                          onClick={() => router.push('/profile')}
                          className="font-semibold underline hover:text-yellow-800"
                        >
                          Cập nhật ngay
                        </button>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ giao hàng *
                      </label>
                      <textarea
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, shippingAddress: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold">Ghi chú đơn hàng</h2>
                  <span className="text-sm text-gray-500">(Không bắt buộc)</span>
                </div>

                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Ví dụ: Giao hàng vào buổi chiều, gọi trước 15 phút..."
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Phương thức thanh toán</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-500">
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">
                        Chuyển khoản trước, giao hàng sau
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold">Đơn hàng ({selectedItems.length} sản phẩm)</h2>

                {/* Products */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedItems.map((item) => {
                    const price = item.product.salePrice || item.product.price
                    const hasValidThumbnail = isValidImageUrl(item.product.thumbnail)
                    return (
                      <div key={item.product.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {hasValidThumbnail ? (
                            <Image
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-2xl">📦</div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                          <p className="text-sm font-semibold text-blue-600">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Voucher Input */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá
                  </label>

                  {voucherData ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">
                            {voucherData.voucher.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVoucher}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-green-600">
                        Giảm {formatPrice(voucherData.discount)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={voucherValidating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {voucherValidating ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Tag className="w-4 h-4" />
                        )}
                        Áp dụng
                      </button>
                    </div>
                  )}
                  {voucherError && (
                    <p className="text-sm text-red-600 mt-1">{voucherError}</p>
                  )}
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Đặt hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
