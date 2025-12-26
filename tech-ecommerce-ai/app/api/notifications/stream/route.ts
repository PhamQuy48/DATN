import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { addConnection, removeConnection } from '@/lib/notifications/sse'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Store connection with user ID
      addConnection(user.id, controller)

      // Send initial connection message
      const data = JSON.stringify({ type: 'connected', userId: user.id })
      controller.enqueue(`data: ${data}\n\n`)

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
}
