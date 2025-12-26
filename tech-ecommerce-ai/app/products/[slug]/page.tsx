'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import RatingSummary from '@/components/products/RatingSummary'
import ReviewsList from '@/components/products/ReviewsList'
import ReviewForm from '@/components/products/ReviewForm'
import { formatPrice, calculateDiscount } from '@/lib/utils/format'
import { Product } from '@prisma/client'
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Loader2,
  Share2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/lib/store/cart-store'
import { useRouter } from 'next/navigation'

type ApiResponse = {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewsData, setReviewsData] = useState<any>(null)
  const [loadingReviews, setLoadingReviews] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProduct()
  }, [slug])

  useEffect(() => {
    if (data?.product?.id) {
      fetchReviews()
    }
  }, [data?.product?.id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/slug/${slug}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    if (!data?.product?.id) return

    setLoadingReviews(true)
    try {
      const response = await fetch(`/api/reviews/${data.product.id}?limit=10`)
      const reviewsData = await response.json()
      setReviewsData(reviewsData)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleAddToCart = () => {
    if (data?.product) {
      addItem(data.product, quantity)
    }
  }

  const handleBuyNow = () => {
    if (data?.product) {
      addItem(data.product, quantity)
      router.push('/cart')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Link href="/products" className="btn btn-primary">
            Quay lại trang sản phẩm
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const { product, relatedProducts } = data
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.salePrice!)
    : 0
  const finalPrice = product.salePrice || product.price

  // Validate image URL
  const validateImageUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')
  }

  // Ensure images is always an array with valid URLs
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.filter(img => validateImageUrl(img))
    : validateImageUrl(product.thumbnail)
    ? [product.thumbnail!]
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Trang chủ
            </Link>
            <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
            <Link href="/products" className="text-gray-600 hover:text-blue-600">
              Sản phẩm
            </Link>
            <ChevronLeft className="w-4 h-4 rotate-180 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-md">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Product Detail */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div>
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 border border-gray-200">
                {images.length > 0 ? (
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="text-9xl mb-4">📦</div>
                      <p className="text-lg text-gray-500 font-medium">Không có hình ảnh</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-blue-600 ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Brand Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-md">
                  {product.brand}
                </span>
                {product.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-md">
                    🔥 HOT
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-900">{product.name}</h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({reviewsData?.summary?.totalReviews || 0} đánh giá)</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <p className="text-sm text-gray-600">
                  Đã bán <span className="font-semibold text-gray-900">{product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
                </p>
              </div>

              {/* Price - Prominent */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-4 border border-blue-100">
                <div className="flex items-baseline gap-3 mb-1">
                  {hasDiscount ? (
                    <>
                      <span className="text-4xl font-bold text-red-600">
                        {formatPrice(product.salePrice!)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasDiscount && (
                    <>
                      <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-md">
                        GIẢM {discount}%
                      </span>
                      <span className="text-sm text-gray-600">
                        Tiết kiệm {formatPrice(product.price - product.salePrice!)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-5 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900">Mô tả sản phẩm</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <label className="font-semibold mb-2 block text-gray-900">Số lượng</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-11 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-11 text-center border-x-2 border-gray-300 font-semibold focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-11 hover:bg-gray-100 font-bold text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300"
                >
                  Mua ngay
                </button>
              </div>

              <div className="flex gap-3 mb-5">
                <button className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Heart className="w-4 h-4" />
                  Yêu thích
                </button>
                <button className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
              </div>

              {/* Benefits */}
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Miễn phí vận chuyển</p>
                    <p className="text-xs text-gray-600">Cho đơn hàng từ 500.000đ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Bảo hành chính hãng</p>
                    <p className="text-xs text-gray-600">12 tháng toàn quốc</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">Đổi trả miễn phí</p>
                    <p className="text-xs text-gray-600">Trong vòng 7 ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Thông số kỹ thuật</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-1">
            {Object.entries(product.specs as Record<string, any>).map(([key, value]) => (
              <div key={key} className="flex py-3 border-b border-gray-200">
                <span className="w-2/5 text-sm text-gray-600 capitalize font-medium">{key}</span>
                <span className="w-3/5 text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Đánh giá sản phẩm</h2>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              {reviewsData && (
                <RatingSummary
                  avgRating={reviewsData.summary.avgRating}
                  totalReviews={reviewsData.summary.totalReviews}
                  ratingDistribution={reviewsData.summary.ratingDistribution}
                />
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-2">
              <ReviewForm
                productId={product.id}
                onSuccess={fetchReviews}
              />
            </div>
          </div>

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            reviewsData && (
              <ReviewsList reviews={reviewsData.reviews} />
            )
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
              <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                Xem thêm <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
