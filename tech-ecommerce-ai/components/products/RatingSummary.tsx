import { Star } from 'lucide-react'

type RatingSummaryProps = {
  avgRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export default function RatingSummary({
  avgRating,
  totalReviews,
  ratingDistribution
}: RatingSummaryProps) {
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0
    return Math.round((count / totalReviews) * 100)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h3>

      {/* Overall Rating */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(avgRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {totalReviews} đánh giá
          </div>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution]
            const percentage = getPercentage(count)

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-700">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Verified Purchase Info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Chỉ người mua hàng mới có thể đánh giá</span>
      </div>
    </div>
  )
}
