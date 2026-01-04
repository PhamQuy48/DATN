import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { addConnection, removeConnection } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('[SSE Stream] 📥 New SSE connection request received')

  const session = await getServerSession(authOptions)
  console.log('[SSE Stream] 🔐 Session check:', session ? 'Found' : 'Not found')

  if (!session?.user?.email) {
    console.log('[SSE Stream] ❌ Unauthorized - No session or email')
    return new Response('Unauthorized', { status: 401 })
  }

  console.log('[SSE Stream] 👤 Session user email:', session.user.email)

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  console.log('[SSE Stream] 🔍 Database user lookup:', user ? `Found (ID: ${user.id})` : 'Not found')

  if (!user) {
    console.log('[SSE Stream] ❌ User not found in database')
    return new Response('User not found', { status: 404 })
  }

  console.log('[SSE Stream] ✅ Creating SSE stream for user:', user.id, '(', user.email, ')')

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      console.log('[SSE Stream] 🚀 Stream started for user:', user.id)

      // Store connection with user ID
      addConnection(user.id, controller)

      // Send initial connection message
      const data = JSON.stringify({ type: 'connected', userId: user.id })
      controller.enqueue(`data: ${data}\n\n`)
      console.log('[SSE Stream] 📤 Sent initial connection message to user:', user.id)

      // Keep-alive ping every 30 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`: keep-alive\n\n`)
        } catch (error) {
          console.log('[SSE Stream] ⚠️ Keep-alive failed for user:', user.id, error)
          clearInterval(keepAlive)
        }
      }, 30000)

      console.log('[SSE Stream] ⏰ Keep-alive timer started for user:', user.id)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        console.log('[SSE Stream] 🔌 Connection aborted for user:', user.id)
        removeConnection(user.id)
        clearInterval(keepAlive)
        try {
          controller.close()
          console.log('[SSE Stream] 🔒 Stream closed for user:', user.id)
        } catch (error) {
          console.log('[SSE Stream] ⚠️ Stream already closed for user:', user.id)
        }
      })
    }
  })

  console.log('[SSE Stream] 🎉 SSE stream created successfully for user:', user.id)

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    }
  })
}
