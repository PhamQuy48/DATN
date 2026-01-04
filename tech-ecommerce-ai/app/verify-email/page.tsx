'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('Token xác thực không hợp lệ')
      return
    }

    verifyEmail(token)
  }, [searchParams])

  const verifyEmail = async (token: string) => {
    try {
      setStatus('loading')

      const response = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        if (data.alreadyVerified) {
          setStatus('already-verified')
          setMessage('Email đã được xác thực trước đó')
          setEmail(data.user?.email || '')
        } else {
          setStatus('success')
          setMessage(data.message || 'Xác thực email thành công!')
          setEmail(data.user?.email || '')
          toast.success('Xác thực email thành công!')
        }
      } else {
        setStatus('error')
        setMessage(data.error || 'Xác thực email thất bại')
        toast.error(data.error || 'Xác thực email thất bại')
      }
    } catch (error) {
      console.error('Error verifying email:', error)
      setStatus('error')
      setMessage('Có lỗi xảy ra khi xác thực email')
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Không tìm thấy email')
      return
    }

    setResending(true)
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || 'Email xác thực đã được gửi lại!')
      } else {
        toast.error(data.error || 'Không thể gửi lại email')
      }
    } catch (error) {
      console.error('Error resending verification:', error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setResending(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xác thực email...
            </h1>

            <p className="text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success' || status === 'already-verified') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'already-verified' ? 'Email đã được xác thực!' : 'Xác thực thành công!'}
            </h1>

            <p className="text-gray-600 mb-8">
              {message}
            </p>

            {email && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Đăng nhập ngay
              </Link>

              <Link
                href="/"
                className="block w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Xác thực thất bại
          </h1>

          <p className="text-gray-600 mb-6">
            {message}
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>💡 Lưu ý:</strong>
            </p>
            <ul className="mt-2 text-sm text-yellow-700 text-left space-y-1">
              <li>• Link xác thực có thể đã hết hạn</li>
              <li>• Link chỉ sử dụng được một lần</li>
              <li>• Email có thể đã được xác thực trước đó</li>
            </ul>
          </div>

          <div className="space-y-3">
            {email && (
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Gửi lại email xác thực
                  </>
                )}
              </button>
            )}

            <Link
              href="/login"
              className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Đăng nhập
            </Link>

            <Link
              href="/register"
              className="block w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
