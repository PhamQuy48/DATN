'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Vui lòng nhập email')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success('Vui lòng kiểm tra email của bạn!')
      } else {
        toast.error(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Chúng tôi đã gửi mã xác nhận đến email <strong>{email}</strong>.
              Vui lòng kiểm tra hộp thư đến (hoặc thư rác) và làm theo hướng dẫn.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                💡 <strong>Lưu ý:</strong> Mã xác nhận có hiệu lực trong 15 phút.
                Nếu không nhận được email, vui lòng kiểm tra thư mục spam hoặc yêu cầu gửi lại.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/reset-password"
                className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Nhập mã xác nhận
              </Link>

              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Gửi lại email
              </button>

              <Link
                href="/login"
                className="block w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back button */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại đăng nhập
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Quên mật khẩu?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Nhập email của bạn, chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Gửi mã xác nhận
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>💡 Gợi ý:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Kiểm tra cả thư mục spam nếu không thấy email</li>
                <li>Mã xác nhận có hiệu lực trong 15 phút</li>
                <li>Bạn có thể yêu cầu gửi lại email nếu cần</li>
              </ul>
            </p>
          </div>
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-gray-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
