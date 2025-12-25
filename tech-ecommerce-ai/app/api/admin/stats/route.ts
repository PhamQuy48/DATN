import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Tổng quan (Total stats)
    const [totalUsers, totalOrders, totalProducts, completedOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        where: { status: 'COMPLETED' },
        select: { totalAmount: true }
      })
    ])

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // 2. Doanh thu 7 ngày gần nhất
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      date.setHours(0, 0, 0, 0)
      return date
    })

    const revenueByDay = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)

        const orders = await prisma.order.findMany({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: date,
              lt: nextDay
            }
          },
          select: { totalAmount: true }
        })

        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

        return {
          date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          revenue: revenue,
          orders: orders.length
        }
      })
    )

    // 3. Đơn hàng theo trạng thái
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    })

    const orderStatusData = ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.id
    }))

    // 4. Top 5 sản phẩm bán chạy
    const topProducts = await prisma.product.findMany({
      orderBy: { sold: 'desc' },
      take: 5,
      select: {
        name: true,
        sold: true,
        price: true,
        salePrice: true
      }
    })

    const topProductsData = topProducts.map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      sold: p.sold,
      revenue: (p.salePrice || p.price) * p.sold
    }))

    // 5. Đơn hàng gần nhất
    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    // 6. User mới gần nhất
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    })

    return NextResponse.json({
      overview: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts
      },
      revenueChart: revenueByDay,
      orderStatusChart: orderStatusData,
      topProductsChart: topProductsData,
      recentOrders: recentOrders.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString()
      })),
      recentUsers: recentUsers.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
