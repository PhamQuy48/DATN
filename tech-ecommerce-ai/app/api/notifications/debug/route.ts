import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { getActiveConnections } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

// GET /api/notifications/debug - Debug notification system
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get active SSE connections
    const activeConnections = getActiveConnections()

    // Get user's notifications count
    const notificationCount = await prisma.notification.count({
      where: { userId: user.id }
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, read: false }
    })

    // Get recent notifications
    const recentNotifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        read: true,
        createdAt: true
      }
    })

    // Check if user has active SSE connection
    const hasActiveConnection = activeConnections.userIds.includes(user.id)

    const debugInfo = {
      timestamp: new Date().toISOString(),
      currentUser: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      sseConnection: {
        hasActiveConnection,
        totalActiveConnections: activeConnections.count,
        allActiveUserIds: activeConnections.userIds,
        currentUserConnected: hasActiveConnection ? '✅ Connected' : '❌ Not Connected'
      },
      notifications: {
        total: notificationCount,
        unread: unreadCount,
        recent: recentNotifications.map(n => ({
          ...n,
          createdAt: n.createdAt.toISOString()
        }))
      },
      system: {
        nodeEnv: process.env.NODE_ENV,
        databaseConnected: true // If we got here, DB is connected
      },
      troubleshooting: {
        steps: [
          hasActiveConnection ? '✅ SSE connection is active' : '❌ SSE connection is NOT active - refresh page or check browser console',
          notificationCount > 0 ? `✅ ${notificationCount} notifications exist in database` : '⚠️ No notifications in database yet',
          unreadCount > 0 ? `📬 ${unreadCount} unread notifications` : '📭 All notifications are read',
          activeConnections.count > 0 ? `✅ ${activeConnections.count} total SSE connections active` : '❌ No SSE connections active'
        ]
      }
    }

    console.log('[Debug] 🐛 Debug info requested by:', user.email)
    console.log('[Debug] 📊 SSE connections:', activeConnections.count)
    console.log('[Debug] 👤 User has connection:', hasActiveConnection)

    return NextResponse.json(debugInfo, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('[Debug] ❌ Error getting debug info:', error)
    return NextResponse.json(
      {
        error: 'Failed to get debug info',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
