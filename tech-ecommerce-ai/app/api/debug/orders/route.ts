import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// DEBUG: Get all orders without authentication
export async function GET() {
  try {
    console.log('🔍 DEBUG: Fetching all orders...')

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const total = await prisma.order.count()

    console.log(`✅ Found ${orders.length} orders (Total: ${total})`)

    return NextResponse.json({
      success: true,
      total,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        userId: order.userId,
        userEmail: order.user?.email,
        userRole: order.user?.role,
        itemsCount: order.items.length,
      }))
    })
  } catch (error) {
    console.error('❌ DEBUG Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
