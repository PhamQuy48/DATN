'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import { Product } from '@prisma/client'
import { Loader2 } from 'lucide-react'

type ApiResponse = {
  products: Product[]
  pagination: {
    page: number
    limit: number
    totalProducts: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: {
    brands: string[]
    categories: Array<{ id: string; name: string; slug: string }>
  }
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Get current filters from URL
  const currentCategory = searchParams.get('category') || ''
  const currentSearch = searchParams.get('search') || ''
  const currentSort = searchParams.get('sortBy') || 'newest'
  const currentPage = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    fetchProducts()
  }, [searchParams])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/products?${params}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', response.status, errorData)
        throw new Error(errorData.error || 'Failed to fetch products')
      }

      const data = await response.json()

      // Validate response structure
      if (!data || !data.products) {
        console.error('Invalid API response structure:', data)
        throw new Error('Invalid response from server')
      }

      setData(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Set empty data to prevent undefined errors - page will show empty state
      setData({
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          totalProducts: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          brands: [],
          categories: [],
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to page 1 when filters change
    params.set('page', '1')

    router.push(`/products?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tet Promotion Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 text-white py-3">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <span className="text-2xl">🧧</span>
            <span className="font-bold">SALE TẾT 2026</span>
            <span>-</span>
            <span>Giảm giá đến 50% + Freeship toàn quốc</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {currentCategory
                ? data?.filters?.categories?.find(c => c.slug === currentCategory)?.name || 'Sản phẩm'
                : 'Sản phẩm'}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {currentCategory
              ? `${data?.filters?.categories?.find(c => c.slug === currentCategory)?.name || 'Sản phẩm'}`
              : 'Tất cả sản phẩm'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Đang tải...' : `${data?.pagination?.totalProducts || 0} sản phẩm`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {data && (
              <ProductFilters
                categories={data.filters.categories}
                brands={data.filters.brands}
                currentCategory={currentCategory}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort & View Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">
                  Sắp xếp:
                </label>
                <select
                  value={currentSort}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Bán chạy nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>

              {currentSearch && (
                <div className="text-sm">
                  <span className="text-gray-600">Kết quả cho: </span>
                  <span className="font-semibold text-gray-900">"{currentSearch}"</span>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Đang tải sản phẩm...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && data && (
              <>
                {data.products.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Không tìm thấy sản phẩm
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Hãy thử tìm kiếm với từ khóa khác hoặc xem các danh mục khác
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Xem tất cả sản phẩm
                    </Link>
                  </div>
                )}

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!data.pagination.hasPrev}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 font-medium transition-all"
                    >
                      ← Trước
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(data.pagination.totalPages, 7) }, (_, i) => {
                        let page;
                        if (data.pagination.totalPages <= 7) {
                          page = i + 1;
                        } else if (currentPage <= 4) {
                          page = i + 1;
                        } else if (currentPage >= data.pagination.totalPages - 3) {
                          page = data.pagination.totalPages - 6 + i;
                        } else {
                          page = currentPage - 3 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-11 h-11 rounded-lg font-medium transition-all ${
                              page === currentPage
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'border border-gray-300 hover:bg-white hover:border-blue-500 hover:text-blue-600'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!data.pagination.hasNext}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 font-medium transition-all"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
