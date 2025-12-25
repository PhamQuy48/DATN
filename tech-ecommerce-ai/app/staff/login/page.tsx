'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff, LogIn, ShoppingBag, UserCog } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StaffLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Check if already logged in as staff
  useEffect(() => {
    const checkStaffSession = async () => {
      try {
        const response = await fetch('/api/staff/me')
        if (response.ok) {
          // Already logged in as staff, redirect to staff page
          router.push('/staff')
        }
      } catch (error) {
        // Not logged in, stay on login page
      }
    }

    checkStaffSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setLoading(true)
    try {
      // Use staff-specific login API
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Đăng nhập thất bại!')
        setLoading(false)
        return
      }

      toast.success('Đăng nhập thành công!')
      // Redirect to staff page
      window.location.href = '/staff'
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Đăng nhập thất bại!')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-700 to-red-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4">
            <UserCog className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Cổng Nhân Viên</h1>
          <p className="text-orange-100">Đăng nhập để quản lý đơn hàng và sản phẩm</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email nhân viên
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Demo Account Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">📝 Tài khoản demo nhân viên:</p>
            <p>Email: <span className="font-mono">staff@example.com</span></p>
            <p>Password: <span className="font-mono">123456</span></p>
          </div>

          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Dành cho Nhân viên & Quản trị viên</p>
                <ul className="space-y-1 text-xs text-orange-700">
                  <li>• Xác nhận đơn hàng chờ xử lý</li>
                  <li>• Thêm và quản lý sản phẩm</li>
                  <li>• Theo dõi tồn kho thời gian thực</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </>
            )}
          </button>

          {/* Back Link */}
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="block w-full text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              ← Quay lại trang chủ
            </button>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="block w-full text-sm text-gray-600 hover:text-orange-600 transition-colors"
            >
              Đăng nhập cho khách hàng →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
