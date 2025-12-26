import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { checkAuth } from '@/lib/auth/check-auth'
import { notifyUser } from '@/lib/notifications/sse'

// POST /api/orders/[id]/cancel - Cancel an order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params in Next.js 15
    const { id } = await params

    // Get the order first with items
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order
    if (order.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if order can be cancelled
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending orders can be cancelled' },
        { status: 400 }
      )
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
      include: {
        items: true,
      },
    })

    // Restore stock for all cancelled products
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }

    // Create notification for customer
    const notification = await prisma.notification.create({
      data: {
        title: '❌ Đơn hàng đã hủy',
        message: `Đơn hàng #${order.orderNumber} của bạn đã được hủy thành công. Số lượng sản phẩm đã được hoàn lại kho.`,
        type: 'WARNING',
        orderId: order.id,
        userId: user.id,
        read: false
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            status: true
          }
        }
      }
    })

    // Send real-time notification via SSE
    notifyUser(user.id, {
      ...notification,
      createdAt: notification.createdAt.toISOString()
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
