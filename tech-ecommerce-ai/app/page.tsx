import Link from 'next/link'
import {
  ShoppingBag, Sparkles, Truck, Shield, Clock, Award,
  Laptop, Smartphone, Tablet, Headphones, Watch, ChevronRight,
  Star, TrendingUp, Package
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TetBanner from '@/components/decorations/TetBanner'
import BannerSlider from '@/components/layout/BannerSlider'
import ProductSection from '@/components/products/ProductSection'
import ProductCard from '@/components/products/ProductCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, stock: { gt: 0 } },
      orderBy: { views: 'desc' },
      take: 10
    })
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

async function getBestSellers() {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { sold: 'desc' },
      take: 10
    })
    return products
  } catch (error) {
    console.error('Error fetching best sellers:', error)
    return []
  }
}

async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    return products
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return []
  }
}

async function getFlashSaleProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        salePrice: { not: null },
        // Giảm giá >= 20%
        AND: {
          salePrice: { lt: prisma.product.fields.price }
        }
      },
      orderBy: { sold: 'desc' },
      take: 10
    })
    return products
  } catch (error) {
    console.error('Error fetching flash sale products:', error)
    return []
  }
}

async function getHotProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { hot: true, stock: { gt: 0 } },
      orderBy: { sold: 'desc' },
      take: 10
    })
    return products
  } catch (error) {
    console.error('Error fetching hot products:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch all data in parallel
  const [featuredProducts, bestSellers, newArrivals, flashSale, hotProducts] = await Promise.all([
    getFeaturedProducts(),
    getBestSellers(),
    getNewArrivals(),
    getFlashSaleProducts(),
    getHotProducts()
  ])

  const categories = [
    { name: 'Laptop', icon: Laptop, slug: 'laptop', color: 'from-blue-500 to-blue-600' },
    { name: 'Điện thoại', icon: Smartphone, slug: 'dien-thoai', color: 'from-green-500 to-green-600' },
    { name: 'Tablet', icon: Tablet, slug: 'tablet', color: 'from-purple-500 to-purple-600' },
    { name: 'Tai nghe', icon: Headphones, slug: 'tai-nghe', color: 'from-orange-500 to-orange-600' },
    { name: 'Smartwatch', icon: Watch, slug: 'smartwatch', color: 'from-pink-500 to-pink-600' },
  ]

  const highlights = [
    { icon: Truck, title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500K' },
    { icon: Shield, title: 'Bảo hành chính hãng', desc: 'Toàn quốc' },
    { icon: Clock, title: 'Giao hàng nhanh', desc: 'Trong 2 giờ' },
    { icon: Award, title: 'Cam kết chất lượng', desc: '100% hàng chính hãng' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-3 text-sm md:text-base">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">KHUYẾN MÃI ĐẶC BIỆT:</span>
            <span>Giảm đến 50% cho sản phẩm công nghệ - Mua ngay!</span>
          </div>
        </div>
      </section>

      {/* Banner Slider */}
      <section className="bg-white py-8">
        <div className="container-custom">
          <BannerSlider />
        </div>
      </section>

      {/* Tet Banner */}
      <TetBanner />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductSection
          title="Sản phẩm nổi bật"
          subtitle="Những sản phẩm được lựa chọn kỹ lưỡng"
          products={featuredProducts}
          viewAllLink="/products?featured=true"
          icon={<Star className="w-6 h-6 text-white" />}
          gradient="from-yellow-500 to-orange-500"
        />
      )}

      {/* Hot Products */}
      {hotProducts.length > 0 && (
        <ProductSection
          title="Sản phẩm HOT"
          subtitle="Sản phẩm bán chạy, được quan tâm nhiều nhất"
          products={hotProducts}
          viewAllLink="/products?hot=true"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          gradient="from-red-500 to-pink-500"
        />
      )}

      {/* Flash Sale */}
      {flashSale.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container-custom">
            {/* Flash Sale Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🔥</div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">Flash Sale</h2>
                    <p className="text-sm text-white/90">Giảm giá cực sốc - Số lượng có hạn</p>
                  </div>
                </div>
                <Link
                  href="/products?sale=true"
                  className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-gray-100 transition-all"
                >
                  Xem tất cả
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {flashSale.slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductSection
          title="Bán chạy nhất"
          subtitle="Top sản phẩm được yêu thích nhất"
          products={bestSellers}
          viewAllLink="/products?sort=sold"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          gradient="from-green-500 to-emerald-500"
        />
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductSection
          title="Sản phẩm mới"
          subtitle="Cập nhật xu hướng công nghệ mới nhất"
          products={newArrivals}
          viewAllLink="/products?sort=newest"
          icon={<Package className="w-6 h-6 text-white" />}
          gradient="from-blue-500 to-cyan-500"
        />
      )}

      {/* Category Cards */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh mục sản phẩm</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all group border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn SHOP QM?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Tư vấn thông minh</h3>
              <p className="text-gray-600 text-sm">
                Chatbot AI giúp bạn tìm sản phẩm phù hợp nhất
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Bảo hành chính hãng</h3>
              <p className="text-gray-600 text-sm">
                100% sản phẩm chính hãng, bảo hành toàn quốc
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Giao hàng siêu tốc</h3>
              <p className="text-gray-600 text-sm">
                Giao hàng nhanh trong 2 giờ tại nội thành
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
