'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center">
              <Search className="w-32 h-32 text-primary-300" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold mb-4">Không tìm thấy trang</h1>
          <p className="text-xl text-gray-600 mb-8">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn btn-primary inline-flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </Link>
            <Link
              href="/products"
              className="btn btn-secondary inline-flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Xem sản phẩm
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="font-bold mb-4">Bạn có thể quan tâm:</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <Link href="/products?category=laptop" className="text-primary-600 hover:text-primary-700">
                Laptop
              </Link>
              <Link href="/products?category=smartphone" className="text-primary-600 hover:text-primary-700">
                Điện thoại
              </Link>
              <Link href="/cart" className="text-primary-600 hover:text-primary-700">
                Giỏ hàng
              </Link>
              <Link href="/wishlist" className="text-primary-600 hover:text-primary-700">
                Yêu thích
              </Link>
              <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                Liên hệ
              </Link>
              <Link href="/faq" className="text-primary-600 hover:text-primary-700">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
