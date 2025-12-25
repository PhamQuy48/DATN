'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, Sparkles, Heart, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import UserNotificationBell from './UserNotificationBell'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.items)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast.success('Đã đăng xuất!')
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold group relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <span className="text-white font-bold text-lg">QM</span>
            </div>
            <div className="relative">
              <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                SHOP QM
              </span>
              <span className="absolute -top-2 -right-8 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                TẾT
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
                }
              }}
              className="relative w-full"
            >
              <input
                type="text"
                placeholder="Bạn cần tìm gì hôm nay?"
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* AI Assistant */}
            <Link
              href="/ai-assistant"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm">AI Tư vấn</span>
            </Link>

            {/* Notification Bell - Only for authenticated users */}
            {status === 'authenticated' && <UserNotificationBell />}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {status === 'authenticated' && session?.user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                      </div>
                      {session.user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Quản trị
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Thông tin tài khoản
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Đăng nhập</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 hover:bg-blue-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 pb-3 text-sm font-medium border-t border-gray-100 pt-3">
          <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors py-1">
            Tất cả sản phẩm
          </Link>
          <Link href="/products?category=laptop" className="text-gray-700 hover:text-blue-600 transition-colors py-1">
            💻 Laptop
          </Link>
          <Link href="/products?category=smartphone" className="text-gray-700 hover:text-blue-600 transition-colors py-1">
            📱 Điện thoại
          </Link>
          <Link href="/products?category=tablet" className="text-gray-700 hover:text-blue-600 transition-colors py-1">
            📱 Tablet
          </Link>
          <Link href="/products?category=accessory" className="text-gray-700 hover:text-blue-600 transition-colors py-1">
            🎧 Phụ kiện
          </Link>
          <Link href="/deals" className="text-red-600 hover:text-red-700 font-semibold transition-colors py-1 flex items-center gap-1">
            🔥 Khuyến mãi HOT
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container-custom py-4 flex flex-col gap-4">
            <Link href="/products" className="py-2 hover:text-primary-600">
              Tất cả sản phẩm
            </Link>
            <Link href="/products?category=laptop" className="py-2 hover:text-primary-600">
              Laptop
            </Link>
            <Link href="/products?category=smartphone" className="py-2 hover:text-primary-600">
              Điện thoại
            </Link>
            <Link href="/products?category=tablet" className="py-2 hover:text-primary-600">
              Tablet
            </Link>
            <Link href="/products?category=accessory" className="py-2 hover:text-primary-600">
              Phụ kiện
            </Link>
            <Link href="/ai-assistant" className="py-2 text-primary-600 font-medium">
              AI Assistant
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
