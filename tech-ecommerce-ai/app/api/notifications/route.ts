import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Notifications API] Starting request...')
    const session = await getServerSession(authOptions)
    console.log('🔍 [Notifications API] Session:', session ? 'Found' : 'Not found', session?.user?.email)

    if (!session?.user?.email) {
      console.log('❌ [Notifications API] No session or email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    console.log('🔍 [Notifications API] Finding user:', session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    console.log('🔍 [Notifications API] User found:', user ? user.id : 'Not found')

    if (!user) {
      console.log('❌ [Notifications API] User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    console.log('🔍 [Notifications API] Query params:', { limit, unreadOnly, userId: user.id })

    // Get notifications for this user
    console.log('🔍 [Notifications API] Fetching notifications...')
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unreadOnly ? { read: false } : {})
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    console.log('✅ [Notifications API] Found notifications:', notifications.length)

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false
      }
    })
    console.log('✅ [Notifications API] Unread count:', unreadCount)

    // Serialize dates to ISO strings - explicitly pick fields
    console.log('🔍 [Notifications API] Serializing notifications...')
    const serializedNotifications = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      userId: n.userId,
      orderId: n.orderId,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
      order: n.order || null
    }))

    console.log('🔍 [Notifications API] Serialized:', serializedNotifications.length)
    const response = {
      notifications: serializedNotifications,
      unreadCount
    }
    console.log('✅ [Notifications API] Returning response')
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ [Notifications API] ERROR:', error)
    console.error('❌ [Notifications API] Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all user's notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false
        },
        data: { read: true }
      })

      return NextResponse.json({
        message: 'All notifications marked as read',
        success: true
      })
    } else if (notificationId) {
      // Verify notification belongs to user
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: user.id
        }
      })

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        )
      }

      // Mark specific notification as read
      await prisma.notification.update({
        where: { id: notificationId },
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

// DELETE /api/notifications - Delete notification(s)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const deleteAll = searchParams.get('all') === 'true'

    if (deleteAll) {
      // Delete all read notifications for this user
      await prisma.notification.deleteMany({
        where: {
          userId: user.id,
          read: true
        }
      })

      return NextResponse.json({
        message: 'All read notifications deleted',
        success: true
      })
    } else if (notificationId) {
      // Verify notification belongs to user
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId: user.id
        }
      })

      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        )
      }

      // Delete specific notification
      await prisma.notification.delete({
        where: { id: notificationId }
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
