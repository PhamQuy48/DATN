import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { notifyUser } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

// POST /api/notifications/test - Send test notification to current user
export async function POST(request: NextRequest) {
  try {
    console.log('[Test Notification] 🧪 Starting test notification...')

    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.log('[Test Notification] ❌ No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Test Notification] 👤 User email:', session.user.email)

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!user) {
      console.log('[Test Notification] ❌ User not found in database')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('[Test Notification] 👤 Found user in DB:', {
      id: user.id,
      email: user.email,
      name: user.name
    })

    // Create test notification in database
    console.log('[Test Notification] 📝 Creating notification in database...')
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        title: '🧪 Thông báo thử nghiệm',
        message: `Đây là thông báo thử nghiệm được gửi lúc ${new Date().toLocaleString('vi-VN')}. Nếu bạn nhận được thông báo này, hệ thống đang hoạt động bình thường!`,
        type: 'INFO',
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

    console.log('[Test Notification] ✅ Notification created in database:', {
      id: notification.id,
      userId: notification.userId,
      title: notification.title
    })

    // Send real-time notification via SSE
    console.log('[Test Notification] 📤 Sending via SSE...')
    notifyUser(user.id, {
      ...notification,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString()
    })

    console.log('[Test Notification] 🎉 Test notification completed!')

    // Check if notification was saved
    const savedNotification = await prisma.notification.findUnique({
      where: { id: notification.id }
    })

    console.log('[Test Notification] 🔍 Verification - Notification in DB:', savedNotification ? 'Yes' : 'No')

    return NextResponse.json({
      success: true,
      message: 'Test notification sent successfully',
      notification: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt.toISOString(),
        savedInDatabase: !!savedNotification
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      instructions: [
        '1. Kiểm tra browser console để xem SSE message',
        '2. Kiểm tra notification bell (chuông thông báo) trên header',
        '3. Nếu vẫn không thấy, làm mới trang (F5)',
        '4. Kiểm tra tab Network trong DevTools để xem SSE stream'
      ]
    })
  } catch (error) {
    console.error('[Test Notification] ❌ Error:', error)
    console.error('[Test Notification] Stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      {
        error: 'Failed to send test notification',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
