'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { X, Mail, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface SendPromotionModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function SendPromotionModal({
  product,
  isOpen,
  onClose,
}: SendPromotionModalProps) {
  const [discountPercent, setDiscountPercent] = useState<number>(10)
  const [validUntil, setValidUntil] = useState<string>('')
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (discountPercent < 1 || discountPercent > 100) {
      toast.error('Phần trăm giảm giá phải từ 1% đến 100%')
      return
    }

    setSending(true)
    try {
      const response = await fetch('/api/promotions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          discountPercent,
          validUntil: validUntil || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails')
      }

      toast.success(
        `Đã gửi ${data.data.successCount} email thành công!${
          data.data.failCount > 0 ? ` (${data.data.failCount} thất bại)` : ''
        }`
      )
      onClose()
    } catch (error: any) {
      console.error('Error sending promotion emails:', error)
      toast.error(error.message || 'Không thể gửi email khuyến mãi')
    } finally {
      setSending(false)
    }
  }

  const salePrice = product.price * (1 - discountPercent / 100)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Gửi Email Khuyến Mãi
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={sending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">Sản phẩm khuyến mãi:</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500 line-through">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {salePrice.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-sm text-green-600 font-semibold">
                (Tiết kiệm {((product.price - salePrice) / 1000).toFixed(0)}K)
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
              <p>
                Email sẽ được gửi đến <strong>TẤT CẢ khách hàng</strong> trong
                hệ thống. Hãy kiểm tra kỹ thông tin trước khi gửi.
              </p>
            </div>
          </div>

          {/* Discount Percent */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phần trăm giảm giá (%)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
              placeholder="Ví dụ: 20"
              required
              disabled={sending}
            />
            <p className="mt-2 text-sm text-gray-500">
              Nhập số từ 1 đến 100. Ví dụ: 20 = giảm 20%
            </p>
          </div>

          {/* Valid Until */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hiệu lực đến ngày (Tùy chọn)
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <p className="mt-2 text-sm text-gray-500">
              Để trống nếu không giới hạn thời gian
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              disabled={sending}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Gửi Email Khuyến Mãi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
