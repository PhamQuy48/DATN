'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import RevenueChart from '@/components/admin/RevenueChart'
import OrderStatusChart from '@/components/admin/OrderStatusChart'
import TopProductsChart from '@/components/admin/TopProductsChart'
import RecentActivities from '@/components/admin/RecentActivities'

type StatsData = {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
  }
  revenueChart: {
    date: string
    revenue: number
    orders: number
  }[]
  orderStatusChart: {
    status: string
    count: number
  }[]
  topProductsChart: {
    name: string
    sold: number
    revenue: number
  }[]
  recentOrders: any[]
  recentUsers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError('Không thể tải thống kê')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thống kê...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold mb-2">Lỗi tải dữ liệu</p>
          <p className="text-gray-600">{error || 'Đã xảy ra lỗi'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan về cửa hàng của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng doanh thu"
          value={stats.overview.totalRevenue}
          icon={DollarSign}
          gradient="from-green-500 to-emerald-600"
          isCurrency
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.overview.totalOrders}
          icon={ShoppingCart}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Người dùng"
          value={stats.overview.totalUsers}
          icon={Users}
          gradient="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Sản phẩm"
          value={stats.overview.totalProducts}
          icon={Package}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-8">
        <RevenueChart data={stats.revenueChart} />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <OrderStatusChart data={stats.orderStatusChart} />
        <TopProductsChart data={stats.topProductsChart} />
      </div>

      {/* Recent Activities */}
      <RecentActivities
        orders={stats.recentOrders}
        users={stats.recentUsers}
      />

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Quản lý sản phẩm
              </h3>
              <p className="text-sm text-gray-600">Thêm, sửa, xóa sản phẩm</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Quản lý đơn hàng
              </h3>
              <p className="text-sm text-gray-600">Xem và cập nhật đơn hàng</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                Quản lý người dùng
              </h3>
              <p className="text-sm text-gray-600">Xem danh sách người dùng</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
