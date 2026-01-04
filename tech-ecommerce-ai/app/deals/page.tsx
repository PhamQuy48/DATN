import { Suspense } from 'react'
import DealsContent from './DealsContent'

export const metadata = {
  title: 'Khuyến Mãi HOT - Giảm Giá Tết 2026 | Thế Giới Công Nghệ',
  description: 'Săn deal công nghệ cực sốc dịp Tết 2026! Giảm giá đến 70% cho laptop, điện thoại, phụ kiện. Mua ngay kẻo lỡ!',
  keywords: ['khuyến mãi', 'giảm giá', 'sale tết 2026', 'deal hot', 'công nghệ giá rẻ'],
}

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang tải khuyến mãi...</p>
          </div>
        </div>
      }>
        <DealsContent />
      </Suspense>
    </div>
  )
}
