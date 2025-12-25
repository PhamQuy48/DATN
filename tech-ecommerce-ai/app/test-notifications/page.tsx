'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function TestNotificationsPage() {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testFetch = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/notifications?limit=10')
      const data = await res.json()

      console.log('API Response:', data)

      if (res.ok) {
        setNotifications(data.notifications || [])
      } else {
        setError(`Error ${res.status}: ${data.error || 'Unknown error'}`)
      }
    } catch (err: any) {
      setError(`Fetch error: ${err.message}`)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      testFetch()
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang kiểm tra session...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Chưa đăng nhập!</h1>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem thông báo.</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Session Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🔍 Test Notifications API</h1>

          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Session Info:</h3>
              <div className="text-sm space-y-1">
                <p><strong>Email:</strong> {session?.user?.email || 'N/A'}</p>
                <p><strong>Name:</strong> {session?.user?.name || 'N/A'}</p>
                <p><strong>Role:</strong> {(session?.user as any)?.role || 'N/A'}</p>
                <p><strong>Status:</strong> {status}</p>
              </div>
            </div>

            {session?.user?.email !== 'aq@gmail.com' && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Cảnh báo!</h3>
                <p className="text-sm text-yellow-800">
                  Bạn đang đăng nhập bằng: <strong>{session?.user?.email}</strong>
                  <br />
                  Để xem notifications test, hãy đăng nhập với: <strong>aq@gmail.com</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Test Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={testFetch}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Đang kiểm tra...' : '🔄 Refresh Notifications'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">❌ Lỗi:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Notifications ({notifications.length})
          </h2>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">📭 Không có thông báo</p>
              <p className="text-sm">
                {session?.user?.email === 'aq@gmail.com'
                  ? 'Hãy thử đặt hàng mới hoặc kiểm tra database'
                  : 'Hãy đăng nhập với aq@gmail.com để xem notifications test'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div
                  key={notif.id || index}
                  className={`p-4 rounded-lg border-l-4 ${
                    !notif.read ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        Chưa đọc
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Type: {notif.type}</span>
                    {notif.order && (
                      <span>Order: #{notif.order.orderNumber}</span>
                    )}
                    <span>{new Date(notif.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg p-6 mt-6 font-mono text-xs overflow-x-auto">
          <h3 className="font-semibold mb-3 text-sm">🐛 Debug Info:</h3>
          <pre>{JSON.stringify({ session, notifications, error }, null, 2)}</pre>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-yellow-900 mb-3">📝 Hướng dẫn:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
            <li>Đảm bảo đã đăng nhập với: <strong>aq@gmail.com</strong></li>
            <li>Click nút "Refresh Notifications" để test API</li>
            <li>Xem kết quả ở phần Notifications</li>
            <li>Nếu không có notifications, kiểm tra database</li>
            <li>Mở Console (F12) để xem logs chi tiết</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
