import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db/prisma'
import { addConnection, removeConnection } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Admin SSE] Request received')

    // Check admin authentication (cookie-based)
    const cookieStore = await cookies()
    console.log('🍪 [Admin SSE] Checking cookies...')

    const adminSession = cookieStore.get('admin_session')
    console.log('🍪 [Admin SSE] admin_session cookie:', adminSession ? 'Found' : 'Not found')

    if (!adminSession || !adminSession.value) {
      console.log('❌ [Admin SSE] No admin session cookie')
      return new Response('Unauthorized - No admin session', { status: 401 })
    }

    // Cookie value is just the user ID (not JSON)
    const userId = adminSession.value
    console.log('✅ [Admin SSE] User ID from cookie:', userId)

    // Get admin user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'STAFF')) {
      return new Response('Unauthorized - Not an admin', { status: 403 })
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Store connection with user ID
        addConnection(user.id, controller)

        // Send initial connection message
        const data = JSON.stringify({ type: 'connected', userId: user.id })
        controller.enqueue(`data: ${data}\n\n`)

        console.log(`✅ Admin SSE connected: ${user.email} (${user.id})`)

        // Keep-alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          try {
            controller.enqueue(`: keep-alive\n\n`)
          } catch (error) {
            clearInterval(keepAlive)
          }
        }, 30000)

        // Cleanup on close
        request.signal.addEventListener('abort', () => {
          removeConnection(user.id)
          clearInterval(keepAlive)
          console.log(`🔌 Admin SSE disconnected: ${user.email}`)
          try {
            controller.close()
          } catch (error) {
            // Stream already closed
          }
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no' // Disable nginx buffering
      }
    })
  } catch (error) {
    console.error('❌ Admin SSE error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
