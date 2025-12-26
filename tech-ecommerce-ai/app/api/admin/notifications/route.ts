import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// GET /api/admin/notifications - Get all notifications for admin
export async function GET(request: NextRequest) {
  try {
    // Get admin session from cookie
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: { id: true, email: true, role: true, banned: true }
    })

    if (!user || user.role !== 'ADMIN' || user.banned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Get notifications for this admin
    const whereClause: any = { userId: user.id }
    if (unreadOnly) {
      whereClause.read = false
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            customerName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Get unread count for this admin
    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false }
    })

    return NextResponse.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/notifications - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    // Get admin session from cookie
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: { id: true, role: true, banned: true }
    })

    if (!user || user.role !== 'ADMIN' || user.banned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all notifications as read for this admin
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true }
      })

      return NextResponse.json({
        message: 'All notifications marked as read',
        success: true
      })
    } else if (notificationId) {
      // Mark specific notification as read (verify ownership)
      await prisma.notification.updateMany({
        where: { id: notificationId, userId: user.id },
        data: { read: true }
      })

      return NextResponse.json({
        message: 'Notification marked as read',
        success: true
      })
    } else {
      return NextResponse.json(
        { error: 'Either notificationId or markAllAsRead must be provided' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/notifications - Delete notification(s)
export async function DELETE(request: NextRequest) {
  try {
    // Get admin session from cookie
    const sessionCookie = request.cookies.get('admin_session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: { id: true, role: true, banned: true }
    })

    if (!user || user.role !== 'ADMIN' || user.banned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const deleteAll = searchParams.get('all') === 'true'

    if (deleteAll) {
      // Delete all read notifications for this admin
      await prisma.notification.deleteMany({
        where: { userId: user.id, read: true }
      })

      return NextResponse.json({
        message: 'All read notifications deleted',
        success: true
      })
    } else if (notificationId) {
      // Delete specific notification (verify ownership)
      await prisma.notification.deleteMany({
        where: { id: notificationId, userId: user.id }
      })

      return NextResponse.json({
        message: 'Notification deleted',
        success: true
      })
    } else {
      return NextResponse.json(
        { error: 'Either id or all parameter must be provided' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}
