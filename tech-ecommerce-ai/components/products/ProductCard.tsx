'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils/format'
import type { Product } from '@prisma/client'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const addItem = useCartStore((state) => state.addItem)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()

    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích!')
      router.push('/login')
      return
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()

    if (status !== 'authenticated') {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!')
      router.push('/login')
      return
    }

    addItem(product, 1)
  }
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.salePrice!)
    : 0

  // Validate thumbnail URL - thumbnails are now always plain strings
  const thumbnailUrl = product.thumbnail || ''
  const hasValidThumbnail = thumbnailUrl &&
    thumbnailUrl.trim() !== '' &&
    (thumbnailUrl.startsWith('http://') || thumbnailUrl.startsWith('https://'))

  return (
    <div className="bg-white rounded-xl border border-gray-200 group overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        {hasValidThumbnail ? (
          <Image
            src={thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="text-6xl mb-2">📦</div>
              <p className="text-sm text-gray-500 font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-500 rounded-lg blur opacity-75"></div>
                <span className="relative flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-red-600 to-yellow-500 text-white text-xs font-bold rounded-lg shadow-lg">
                  🧧 GIẢM {discount}%
                </span>
              </div>
              {discount >= 30 && (
                <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-lg shadow-md animate-pulse">
                  🎉 SALE TẾT
                </span>
              )}
            </>
          )}
          {product.featured && !hasDiscount && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-lg shadow-md">
              🔥 HOT
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg">
              Hết hàng
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all ${
              inWishlist
                ? 'text-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Product Info */}
      <div className="p-3.5">
        {/* Brand - Premium badge style */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
            {product.brand}
          </span>
          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-xs text-orange-600 font-medium">
              Chỉ còn {product.stock}
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="block font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Rating & Sold */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-600">
            Đã bán {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}
          </span>
        </div>

        {/* Price - Prominent display */}
        <div className="mb-3">
          {hasDiscount ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="inline-block px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded">
                Tiết kiệm {formatPrice(product.price - product.salePrice!)}
              </div>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Premium style */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg active:scale-95'
          }`}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  )
}
