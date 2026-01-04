'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Clock, Tag, TrendingDown, Gift, Zap, Star } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { Product } from '@prisma/client'
import toast from 'react-hot-toast'

export default function DealsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | '30' | '50' | '70'>('all')
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const wishlistItems = useWishlistStore((state) => state.items)

  // Countdown đến Tết Nguyên Đán 2026 (17/2/2026)
  useEffect(() => {
    const countdownDate = new Date('2026-02-17T23:59:59').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = countdownDate - now

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  // Cập nhật thời gian thực mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch sản phẩm có giảm giá
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/products?limit=100')
        if (!response.ok) throw new Error('Failed to fetch')

        const data = await response.json()

        // Lọc sản phẩm có salePrice
        const dealsProducts = data.products.filter((p: Product) => p.salePrice && p.salePrice < p.price)

        // Sắp xếp theo % giảm giá cao nhất
        dealsProducts.sort((a: Product, b: Product) => {
          const discountA = ((a.price - (a.salePrice || 0)) / a.price) * 100
          const discountB = ((b.price - (b.salePrice || 0)) / b.price) * 100
          return discountB - discountA
        })

        setProducts(dealsProducts)
      } catch (error) {
        console.error('Error fetching deals:', error)
        toast.error('Không thể tải danh sách khuyến mãi')
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100)
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    const discount = calculateDiscount(product.price, product.salePrice || 0)

    if (filter === '30') return discount >= 30 && discount < 50
    if (filter === '50') return discount >= 50 && discount < 70
    if (filter === '70') return discount >= 70

    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải khuyến mãi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {/* Trang trí Tết - Hoa đào trái */}
      <div className="fixed top-0 left-0 w-64 h-64 opacity-30 pointer-events-none z-0">
        <div className="absolute top-20 left-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="absolute w-12 h-12 animate-float"
              style={{
                top: `${i * 40}px`,
                left: `${i * 30}px`,
                animationDelay: `${i * 0.5}s`
              }}
            >
              <div className="text-6xl">🌸</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trang trí Tết - Hoa mai phải */}
      <div className="fixed top-0 right-0 w-64 h-64 opacity-30 pointer-events-none z-0">
        <div className="absolute top-20 right-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="absolute w-12 h-12 animate-float"
              style={{
                top: `${i * 40}px`,
                right: `${i * 30}px`,
                animationDelay: `${i * 0.3}s`
              }}
            >
              <div className="text-6xl">🏵️</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-custom py-8 relative z-10">
        {/* Header với trang trí Tết */}
        <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-3xl p-8 mb-8 overflow-hidden shadow-2xl">
          {/* Pháo hoa animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-1/4 text-4xl animate-ping">✨</div>
            <div className="absolute top-8 right-1/4 text-4xl animate-ping" style={{ animationDelay: '0.5s' }}>🎆</div>
            <div className="absolute bottom-4 left-1/3 text-4xl animate-ping" style={{ animationDelay: '1s' }}>🎇</div>
          </div>

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl animate-bounce">🧧</span>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                FLASH SALE TẾT 2026
              </h1>
              <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
            </div>
            <p className="text-xl text-white/90 mb-2">
              🎉 Giảm giá cực sốc - Rinh ngay deal khủng đón Tết! 🎉
            </p>
            <p className="text-sm text-white/80 mb-6">
              ⏰ {currentTime.toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-4 bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <Clock className="w-8 h-8 text-white" />
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="bg-white text-red-600 font-black text-3xl px-4 py-2 rounded-lg min-w-[70px]">
                    {timeLeft.days}
                  </div>
                  <p className="text-white text-sm mt-1">Ngày</p>
                </div>
                <div className="text-white text-3xl">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 font-black text-3xl px-4 py-2 rounded-lg min-w-[70px]">
                    {timeLeft.hours}
                  </div>
                  <p className="text-white text-sm mt-1">Giờ</p>
                </div>
                <div className="text-white text-3xl">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 font-black text-3xl px-4 py-2 rounded-lg min-w-[70px]">
                    {timeLeft.minutes}
                  </div>
                  <p className="text-white text-sm mt-1">Phút</p>
                </div>
                <div className="text-white text-3xl">:</div>
                <div className="text-center">
                  <div className="bg-white text-red-600 font-black text-3xl px-4 py-2 rounded-lg min-w-[70px]">
                    {timeLeft.seconds}
                  </div>
                  <p className="text-white text-sm mt-1">Giây</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Tag className="w-5 h-5 inline mr-2" />
            Tất cả Deal
          </button>
          <button
            onClick={() => setFilter('30')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === '30'
                ? 'bg-orange-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingDown className="w-5 h-5 inline mr-2" />
            Giảm 30-50%
          </button>
          <button
            onClick={() => setFilter('50')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === '50'
                ? 'bg-yellow-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-5 h-5 inline mr-2" />
            Giảm 50-70%
          </button>
          <button
            onClick={() => setFilter('70')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              filter === '70'
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Gift className="w-5 h-5 inline mr-2" />
            Giảm trên 70%
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có sản phẩm trong mục này
            </h3>
            <p className="text-gray-600">
              Hãy thử lọc theo mức giảm giá khác nhé!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const discount = calculateDiscount(product.price, product.salePrice || 0)
              const isInWishlist = wishlistItems.some(item => item.id === product.id)

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      -{discount}%
                    </div>
                  </div>

                  {/* HOT Badge for high discount */}
                  {discount >= 50 && (
                    <div className="absolute top-3 right-3 z-10 animate-pulse">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                        🔥 HOT
                      </div>
                    </div>
                  )}

                  <Link href={`/products/${product.slug}`}>
                    <div className="relative h-64 bg-gray-100">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600">Đã bán {product.sold}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">
                          {(product.salePrice || 0).toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {product.price.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {product.stock > 0 ? (
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Còn hàng ({product.stock} sản phẩm)
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 font-medium">
                          ✗ Hết hàng
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => {
                        addToCart(product)
                        toast.success('Đã thêm vào giỏ hàng!')
                      }}
                      disabled={product.stock === 0}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Thêm vào giỏ
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(product)
                      }}
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        isInWishlist
                          ? 'bg-pink-50 border-pink-500 text-pink-500'
                          : 'border-gray-200 text-gray-400 hover:border-pink-500 hover:text-pink-500'
                      }`}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer với lời chúc Tết */}
        <div className="mt-12 text-center bg-gradient-to-r from-red-100 to-yellow-100 rounded-2xl p-8">
          <div className="text-4xl mb-4">🎊 🧧 🎉</div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">
            Chúc Mừng Năm Mới 2026!
          </h3>
          <p className="text-gray-700">
            Vạn sự như ý - An khang thịnh vượng - Phát tài phát lộc
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
