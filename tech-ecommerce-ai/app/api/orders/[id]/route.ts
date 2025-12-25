import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { checkAuth } from '@/lib/auth/check-auth'

// GET /api/orders/[id] - Get a specific order
export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // If not admin, only allow viewing own orders
    if (user.role !== 'ADMIN' && order.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[id] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await checkAuth(request)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
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

    // Check permissions
    const isAdmin = user.role === 'ADMIN'
    const isStaff = user.role === 'STAFF'
    const isOwner = order.userId === user.id

    if (!isAdmin && !isStaff && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate status transitions
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'REFUNDING', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Customer can only cancel their own orders
    // Admin and Staff have full access to change order status
    if (!isAdmin && !isStaff) {
      // Only allow REFUNDING or CANCELLED status
      if (status !== 'REFUNDING' && status !== 'CANCELLED') {
        return NextResponse.json(
          { error: 'Customers can only cancel orders' },
          { status: 403 }
        )
      }

      // Check if order can be cancelled
      if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
        return NextResponse.json(
          { error: 'Order cannot be cancelled at this stage' },
          { status: 400 }
        )
      }

      // If customer wants to set REFUNDING, check if payment was made
      if (status === 'REFUNDING') {
        if (order.paymentStatus !== 'PAID') {
          return NextResponse.json(
            { error: 'Only paid orders can be refunded. Please cancel this order instead.' },
            { status: 400 }
          )
        }
      }

      // If customer wants to set CANCELLED, check if payment was NOT made (COD)
      if (status === 'CANCELLED') {
        if (order.paymentStatus === 'PAID') {
          return NextResponse.json(
            { error: 'Paid orders must request refund first' },
            { status: 400 }
          )
        }
      }
    }

    // Prepare update data
    const updateData: any = { status }

    // If admin is completing refund (REFUNDING → CANCELLED), mark payment as REFUNDED
    if (isAdmin && status === 'CANCELLED' && order.status === 'REFUNDING') {
      updateData.paymentStatus = 'REFUNDED'
    }

    // If admin is marking order as COMPLETED and payment is PENDING (COD), mark as PAID
    if (isAdmin && status === 'COMPLETED' && order.paymentStatus === 'PENDING') {
      updateData.paymentStatus = 'PAID'
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    })

    // Handle product stock and sold count updates based on status change
    const oldStatus = order.status
    const newStatus = status

    // When order is COMPLETED: increment sold count
    if (newStatus === 'COMPLETED' && oldStatus !== 'COMPLETED') {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sold: {
              increment: item.quantity
            }
          }
        })
      }
    }

    // When order is CANCELLED: restore stock (that was decremented when order was created)
    if (newStatus === 'CANCELLED' && oldStatus !== 'CANCELLED') {
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
    }

    // Create notification for user when admin/staff updates order status
    if ((isAdmin || isStaff) && oldStatus !== newStatus) {
      const statusMessages: Record<string, { title: string; message: string; type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ORDER' }> = {
        PROCESSING: {
          title: 'Đơn hàng đang được xử lý',
          message: `Đơn hàng #${order.orderNumber} của bạn đang được chuẩn bị`,
          type: 'INFO'
        },
        SHIPPING: {
          title: 'Đơn hàng đang giao',
          message: `Đơn hàng #${order.orderNumber} đang được giao đến bạn`,
          type: 'INFO'
        },
        COMPLETED: {
          title: 'Đơn hàng hoàn thành',
          message: `Đơn hàng #${order.orderNumber} đã được giao thành công`,
          type: 'SUCCESS'
        },
        CANCELLED: {
          title: 'Đơn hàng đã hủy',
          message: `Đơn hàng #${order.orderNumber} đã bị hủy`,
          type: 'ERROR'
        },
        REFUNDING: {
          title: 'Đang xử lý hoàn tiền',
          message: `Yêu cầu hoàn tiền cho đơn hàng #${order.orderNumber} đang được xử lý`,
          type: 'WARNING'
        }
      }

      const notificationData = statusMessages[newStatus]
      if (notificationData) {
        await prisma.notification.create({
          data: {
            userId: order.userId,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            orderId: order.id,
            read: false
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
