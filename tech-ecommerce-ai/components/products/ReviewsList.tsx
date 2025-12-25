'use client'

import { Star, ThumbsUp } from 'lucide-react'
import Image from 'next/image'

type Review = {
  id: string
  rating: number
  comment: string
  images: string[]
  helpful: number
  verified: boolean
  createdAt: string
  user: {
    id: string
    name: string
    image?: string | null
  }
}

type ReviewsListProps = {
  reviews: Review[]
  onHelpful?: (reviewId: string) => void
}

export default function ReviewsList({ reviews, onHelpful }: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Chưa có đánh giá nào</p>
        <p className="text-sm text-gray-500 mt-1">
          Hãy là người đầu tiên đánh giá sản phẩm này
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          {/* User Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <span className="text-white font-semibold text-lg">
                  {review.user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">
                  {review.user.name}
                </h4>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Đã mua hàng
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-3">
                {review.comment}
              </p>

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <button
                onClick={() => onHelpful?.(review.id)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Hữu ích ({review.helpful})</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
