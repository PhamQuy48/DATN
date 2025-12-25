'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { Heart, ShoppingBag } from 'lucide-react'

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlistStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Danh sách yêu thích trống</h1>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy thêm những sản phẩm ưa thích của bạn!
            </p>
            <Link href="/products" className="btn btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Khám phá sản phẩm
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
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500" />
              Danh sách yêu thích
            </h1>
            <p className="text-gray-600">{items.length} sản phẩm</p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
