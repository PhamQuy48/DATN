'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Bell, Package, Tag, Check, Trash2, Clock, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ORDER' | 'VOUCHER'

interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  createdAt: string
  orderId?: string
  order?: {
    id: string
    orderNumber: string
  }
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchNotifications()
    }
  }, [status, router])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()

      if (response.ok) {
        setNotifications(data.notifications || [])
      } else {
        toast.error('Không thể tải thông báo')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      })

      if (response.ok) {
        setNotifications(notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST'
      })

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
        toast.success('Đã đánh dấu tất cả là đã đọc')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Có lỗi xảy ra')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id))
        toast.success('Đã xóa thông báo')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Có lỗi xảy ra')
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER':
        return <Package className="w-6 h-6 text-blue-600" />
      case 'VOUCHER':
        return <Gift className="w-6 h-6 text-green-600" />
      case 'SUCCESS':
        return <Check className="w-6 h-6 text-green-600" />
      case 'WARNING':
        return <Bell className="w-6 h-6 text-yellow-600" />
      case 'ERROR':
        return <Bell className="w-6 h-6 text-red-600" />
      default:
        return <Bell className="w-6 h-6 text-gray-600" />
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'ORDER':
        return 'bg-blue-50 border-blue-200'
      case 'VOUCHER':
        return 'bg-green-50 border-green-200'
      case 'SUCCESS':
        return 'bg-green-50 border-green-200'
      case 'WARNING':
        return 'bg-yellow-50 border-yellow-200'
      case 'ERROR':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Bell className="w-8 h-8" />
                  Thông báo
                </h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc tất cả thông báo'}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chưa đọc ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Bạn chưa có thông báo nào'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all hover:shadow-md ${
                    !notification.read ? getNotificationColor(notification.type) : 'border-gray-200'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              {notification.title}
                              {!notification.read && (
                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {notification.message}
                            </p>

                            {notification.orderId && (
                              <button
                                onClick={() => router.push(`/orders/${notification.orderId}`)}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                              >
                                <Package className="w-4 h-4" />
                                Xem đơn hàng
                              </button>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Đánh dấu đã đọc"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3" />
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
