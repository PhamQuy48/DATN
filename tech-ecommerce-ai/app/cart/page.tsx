'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice } from '@/lib/utils/format'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { items, updateQuantity, removeItem, clearCart } = useCartStore()
  const [isChecking, setIsChecking] = useState(true)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

  useEffect(() => {
    // Check authentication on mount
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng!')
      router.push('/login')
    } else {
      setIsChecking(false)
    }
  }, [status, router])

  // Toggle select single item
  const toggleSelectItem = (productId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([])
    } else {
      setSelectedItemIds(items.map((item) => item.product.id))
    }
  }

  // Check if all items are selected
  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length

  // Get selected items
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.product.id))

  // Show loading state while checking auth
  if (status === 'loading' || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-16 h-16 text-gray-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Đang kiểm tra...</h1>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate total price for SELECTED items only
  const totalPrice = selectedItems.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price
    return total + price * item.quantity
  }, 0)

  const shippingFee = totalPrice > 0 ? (totalPrice >= 10000000 ? 0 : 30000) : 0
  const finalPrice = totalPrice + shippingFee

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản phẩm yêu thích!
            </p>
            <Link href="/products" className="btn btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Giỏ hàng của bạn</h1>
              <p className="text-gray-600">{items.length} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Xóa tất cả
          </button>
        </div>

        {/* Select All Checkbox */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="font-medium text-gray-900">
              Chọn tất cả ({selectedItemIds.length}/{items.length})
            </span>
          </label>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.product.salePrice || item.product.price
              const totalItemPrice = price * item.quantity
              const isSelected = selectedItemIds.includes(item.product.id)

              return (
                <div
                  key={item.product.id}
                  className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all ${
                    isSelected ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Checkbox */}
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item.product.id)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                      />
                    </div>

                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs text-gray-500 uppercase mb-1">
                            {item.product.brand}
                          </p>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-500 ml-2">
                            (Còn {item.product.stock} sản phẩm)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary-600">
                            {formatPrice(totalItemPrice)}
                          </div>
                          {item.product.salePrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              {selectedItemIds.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Chưa chọn sản phẩm nào</p>
                  <p className="text-sm text-gray-400">
                    Hãy chọn sản phẩm để xem tổng tiền
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({selectedItemIds.length} sản phẩm)</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
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
                {totalPrice < 10000000 && totalPrice > 0 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    Mua thêm {formatPrice(10000000 - totalPrice)} để được miễn phí vận chuyển
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedItemIds.length > 0) {
                    // Save selected item IDs to localStorage for checkout page
                    localStorage.setItem('checkoutItemIds', JSON.stringify(selectedItemIds))
                    router.push('/checkout')
                  } else {
                    toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán!')
                  }
                }}
                disabled={selectedItemIds.length === 0}
                className="w-full btn btn-primary flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thanh toán ({selectedItemIds.length} sản phẩm)
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/products"
                className="block text-center text-primary-600 hover:text-primary-700"
              >
                Tiếp tục mua sắm
              </Link>

              {/* Benefits */}
              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bảo hành chính hãng</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Đổi trả miễn phí 7 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thanh toán an toàn</span>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
